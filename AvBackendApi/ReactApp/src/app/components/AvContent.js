import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
  
  export class AvContent extends Component {
    render() {
      return (
        <div className="page-wrapper">
            <div className="container-fluid">
				<div className="row heading-bg">
					<div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
					  <h5 className="txt-dark">{this.props.title}</h5>
					</div>
					{/* <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
					  <ol className="breadcrumb">
						<li><a href="index.html">Dashboard</a></li>
						<li><a href="#"><span>apps</span></a></li>
						<li className="active"><span>contact list</span></li>
					  </ol>
					</div> */}
				</div>
				
				<div className="row">
					<div className="col-lg-12">
						<div className="panel panel-default card-view pa-0">
							<div className="panel-wrapper collapse in">
								<div className="panel-body pa-0">

                    {this.props.children}

                </div>
							</div>
						</div>
					</div>
				</div>
			</div>
			

			<footer className="footer container-fluid pl-30 pr-30">
				<div className="row">
					<div className="col-sm-12">
						<p>2017 &copy; Jetson. Pampered by Hencework</p>
					</div>
				</div>
			</footer>
        </div>
      );
    } 
  }