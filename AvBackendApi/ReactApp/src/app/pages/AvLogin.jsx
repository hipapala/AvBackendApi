import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import logoImage from '../../img/logo.png';

import {httpHelper} from '../components/AvLoader'; 
import {rootScope} from '../avroot.jsx'; 
import {isRequired, summary, errorClass} from '../components/AvValidators'; 
import { isEmail } from 'validator';

export default class AvLogin extends React.Component {
    state = {
      redirectToReferrer: false,
      email: '',
			password: '',
			isFailed: false,
			isTouched: false
		}	

    handleInputChange = (e) => {
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
    }

    login = (validation) => {
      this.setState({
				isFailed: false,
				isTouched: true
			});		

			if(validation.isValid){
				httpHelper.post('/api/auth', {email: this.state.email, password: this.state.password}, (data)=>{
					if(data.isAuthenticated){
						rootScope.auth = data;
						this.setState({ redirectToReferrer: true });
					}else{
						this.setState({
							isFailed: true
						});								
					}
				}, {isAuthenticated: true, email: this.state.email, isAdmin: true, isUser: false});
		  }
    }
  
    render() {
      const { from } = this.props.location.state || { from: { pathname: '/' } }
      const { redirectToReferrer } = this.state
  
      if (redirectToReferrer) {
        return (
          <Redirect to={from}/>
        )
      }

			var validation = summary({
				email: [isRequired(this.state.email), isEmail(this.state.email)],
				password: [isRequired(this.state.password)]
			});	

      return (
    <div className="wrapper pa-0">
			<header className="sp-header">
				<div className="sp-logo-wrap pull-left">
					<a href="index.html">
						<img className="brand-img mr-10" src={ logoImage } alt="brand"/>
						<span className="brand-text">Jetson</span>
					</a>
				</div>
				{/* <div className="form-group mb-0 pull-right">
					<span className="inline-block pr-10">Don't have an account?</span>
					<a className="inline-block btn btn-info  btn-rounded btn-outline" href="signup.html">Sign Up</a>
				</div> */}
				<div className="clearfix"></div>
			</header>
			<div className="page-wrapper pa-0 ma-0 auth-page">
				<div className="container-fluid">
					<div className="table-struct full-width full-height">
						<div className="table-cell vertical-align-middle auth-form-wrap">
							<div className="auth-form  ml-auto mr-auto no-float">
								<div className="row">
									<div className="col-sm-12 col-xs-12">
										<div className="mb-30">
											<h3 className="text-center txt-dark mb-10">Sign in to Jetson</h3>
											<h6 className="text-center nonecase-font txt-grey">Enter your details below</h6>
										</div>	
										<div className="form-wrap">
											<form>
												<div className={`form-group ${errorClass(validation.email, this.state.isTouched)}`}>
													<label className="control-label mb-10" htmlFor="exampleInputEmail_2">Email address</label>
													<input type="email" name="email" value={this.state.email} onChange={this.handleInputChange} className="form-control" required="" id="exampleInputEmail_2" placeholder="Enter email" />
												</div>
												<div className={`form-group ${errorClass(validation.password, this.state.isTouched)}`}>
													<label className="pull-left control-label mb-10" htmlFor="exampleInputpwd_2">Password</label>
													{/* <a className="capitalize-font txt-primary block mb-10 pull-right font-12" href="forgot-password.html">forgot password ?</a>
													<div className="clearfix"></div> */}
													<input type="password" name="password" onChange={this.handleInputChange} value={this.state.password} value={this.state.password} className="form-control" required="" id="exampleInputpwd_2" placeholder="Enter pwd" />
												</div>
												{this.state.isFailed ? (
													<div class="alert alert-danger">
											         Neteisingai įvestas el. paštas arba slaptažodis 
									     	  </div>
												) : ''}
												{/* <div className="form-group">
													<div className="checkbox checkbox-primary pr-10 pull-left">
														<input id="checkbox_2" required="" type="checkbox" />
														<label htmlFor="checkbox_2"> Keep me logged in</label>
													</div>
													<div className="clearfix"></div>
                        </div> */}
												<div className="form-group text-center">
													<button type="button" onClick={()=>this.login(validation)} className="btn btn-info  btn-rounded">sign in</button>
												</div>
											</form>
										</div>
									</div>	
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>   
      );
    }
}