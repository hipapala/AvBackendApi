import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {isEmail, isRequired, summary, errorClass} from '../components/AvValidators';
import {httpHelper} from '../components/AvLoader';  
import {AvContent} from '../components/AvContent';  

class AvUserModal extends React.Component {
	state = {
		showModal: false,
		isTouched: false,
		user: {}
	}

  handleInputChange = (e) => {
		const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		this.state.user[e.target.name] = value;
		this.setState({user: this.state.user});
	}	
  
    open(user){
        this.setState({ showModal: true, isTouched: false, isFinished: false, user: user ? {id: user.id, email: user.email, isAdmin: user.isAdmin} : {} });
	}

	close(){
		this.setState({ showModal: false });
	}

	save(validation){
		this.setState({ isTouched: true });
		debugger;
		if(validation.isValid){
			debugger;
			httpHelper.post('/api/users', this.state.user, ()=>{
				this.props.load();
				this.setState({ isFinished: true });
			});			
		}
	}

	render() {
		var validation = summary({
			email: [isRequired(this.state.user.email), isEmail(this.state.user.email)],
			password: [this.state.user.id > 0 ? true : isRequired(this.state.user.password)]
		});	

	  return (
		<Modal show={this.state.showModal} onHide={()=>this.close()}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.user.id > 0 ? 'User' : 'New user'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
		  {this.state.isFinished ?
		  (<div className="alert alert-success alert-dismissable">
				<i className="zmdi zmdi-check pr-15 pull-left"></i><p className="pull-left">Successfully saved.</p> 
				<div className="clearfix"></div>
		   </div>		  
		):(<form className="form-horizontal form-material">
		  <div className="form-group">
			  <div className={`col-md-12 mb-20 ${errorClass(validation.email, this.state.isTouched)}`}>
				  <input readOnly={this.state.user.id > 0 ? 'readOnly' : ''} type="email" name="email" value={this.state.user.email} onChange={this.handleInputChange} className="form-control" placeholder="Email" />
			  </div>
			  <div className={`col-md-12 mb-20 ${errorClass(validation.password, this.state.isTouched)}`}>
				  <input type="password" name="password" value={this.state.user.password} onChange={this.handleInputChange} className="form-control" placeholder="Password" />
			  </div>
			  <div className='col-md-12 mb-20'>
			  <div className="checkbox checkbox-primary">
					<input id="checkbox2" name="isAdmin" type="checkbox" onChange={this.handleInputChange} checked={this.state.user.isAdmin} />
					<label htmlFor="checkbox2">
						Administrator
					</label>
			  </div>
			  </div>			  			  
		  </div>
	      </form>)}
	      </Modal.Body>
          <Modal.Footer>
		  {!this.state.isFinished ?(
		        <button type="button" className="btn btn-info waves-effect" onClick={()=>this.save(validation)}>Save</button>) : ''}
				<button type="button" className="btn btn-default waves-effect" onClick={()=>this.close()}>Close</button>
          </Modal.Footer>
        </Modal>
	  )
	}
  }

export default class AvUsers extends React.Component {
	state = {
        users: []
	};

	componentDidMount(){
		this.load();
	}

    load = () => {
		httpHelper.get('/api/users', (data)=>{
			this.setState({ users: data });
		}, [{Id: 1, Email: 'marius_rudys@gmail.com', IsAdmin: true}, {Id: 2, Email: 'mmama@gmail.com', IsAdmin: false}, {Id: 3, Email: 'gerulaitis@gmail.com', IsAdmin: false}]);
	}	

    edit = (user) => {
      this.modal.open(user);
	}
	
    remove = (user) => {
		if(confirm('Are you sure?')){
			httpHelper.remove('/api/users/' + user.id,()=>{
				this.load();
			});
		}
	}	
  
    render() { 
      return (
				<AvContent title='Users'>	
			<div className="contact-list">
				<div className="row">
					<aside className="col-lg-2 col-md-4 pr-0">
						<div className="mt-20 mb-20 ml-15 mr-15">
							<a onClick={()=>this.edit()} title="Compose" className="btn btn-success btn-block">
							Add new contact
							</a>
							<AvUserModal load={this.load} ref={(modal) => { this.modal = modal; }} />
						</div>
					</aside>
					
					<aside className="col-lg-10 col-md-8 pl-0">
						<div className="panel pa-0">
						<div className="panel-wrapper collapse in">
						<div className="panel-body  pa-0">
							<div className="table-responsive mb-30">
								<table className="table  display table-hover mb-30">
									<thead>
										<tr>
											<th>Email</th>
											<th>Role</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{this.state.users.map((item, index) => (
										<tr key={index}>
											<td>{item.email}</td>
											<td>{item.isAdmin ? (<span className="label label-danger">Admin</span>) : (<span className="label label-primary">User</span>)}</td>
											<td><a href="javascript:void(0)" onClick={()=>this.edit(item)} className="text-inverse pr-10" title="Edit"><i className="zmdi zmdi-edit txt-warning"></i></a><a href="javascript:void(0)" className="text-inverse" title="Delete" onClick={()=>this.remove(item)}><i className="zmdi zmdi-delete txt-danger"></i></a></td>
										</tr>																	
										))}																
									</tbody>
								</table>
							</div>
						</div>
						</div>
						</div>
					</aside>
				</div>
			</div>
			</AvContent>	
      )
    }
}