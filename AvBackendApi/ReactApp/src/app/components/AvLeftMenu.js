import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
  
  export class AvLeftMenu extends Component {
    render() {
      return (
        <div className="fixed-sidebar-left">
          <ul className="nav navbar-nav side-nav nicescroll-bar">
          <li className="navigation-header">
              <span>Xml</span> 
              <i className="zmdi zmdi-more"></i>
            </li>
            <li>
              <NavLink activeClassName='active' to="/xmls"><div className="pull-left"><i className="fa fa-file mr-20"></i><span className="right-nav-text">Xml list</span></div><div className="clearfix"></div></NavLink>
            </li>          
            <li className="navigation-header">
              <span>Admin</span> 
              <i className="zmdi zmdi-more"></i>
            </li>
            <li>
              <NavLink activeClassName='active' to="/users"><div className="pull-left"><i className="fa fa-users mr-20"></i><span className="right-nav-text">Vartotojai</span></div><div className="clearfix"></div></NavLink>
            </li>
          </ul>
	    	</div>
      );
    } 
  }