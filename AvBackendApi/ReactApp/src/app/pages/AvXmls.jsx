import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {isEmail, isRequired, summary, errorClass} from '../components/AvValidators';
import {httpHelper} from '../components/AvLoader';  
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import {AvContent} from '../components/AvContent';  

export default class AvXmls extends React.Component {
	state = {
		items: []
	};

	componentDidMount(){
		this.load();
	}

  load = () => {
		httpHelper.get('/api/xmls', (data)=>{
			this.setState({ items: data });
		});
	}	

  // edit = (item) => {
  //     this.props.history.push('/some/path');
	// }
	
  remove = (user) => {
		if(confirm('Are you sure?')){
			httpHelper.remove('/api/xmls/' + user.id,()=>{
				this.load();
			});
		}
	}	
  
    render() { 
      return (
				<AvContent title='Xml list'>	
			<div className="contact-list">
				<div className="row">
					<aside className="col-lg-2 col-md-4 pr-0">
						<div className="mt-20 mb-20 ml-15 mr-15">
						  <Link className='btn btn-success btn-block' to="/xml">
							   New Xml
							</Link>
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
											<th>Created</th>
											<th>Name</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{this.state.items.map((item, index) => (
										<tr key={index}>
											<td>{moment(item.created).format('YYYY-MM-DD HH:mm')}</td>
											<td>{item.name}</td>
											<td>
												<Link to={'/xml/' + item.id } className="text-inverse pr-10" title="Edit"><i className="zmdi zmdi-edit txt-warning"></i></Link>
												<a href={'/api/xmls/download/' + item.id} className="text-inverse pr-10"><i className="zmdi zmdi-download txt-success"></i></a>
									   		<a href="javascript:void(0)" className="text-inverse" title="Delete" onClick={()=>this.remove(item)}><i className="zmdi zmdi-delete txt-danger"></i></a>
											</td>
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