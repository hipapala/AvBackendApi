import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../img/logo.png';
  
  export class AvTopMenu extends Component {
    render() {
      return (
        <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="mobile-only-brand pull-left">
          <div className="nav-header pull-left">
            <div className="logo-wrap">
              <Link to="/login">
                <img className="brand-img" src={ logoImage } alt="brand"/>
                <span className="brand-text">Jetson</span>
              </Link>
            </div>
          </div>	
          <a id="toggle_nav_btn" className="toggle-left-nav-btn inline-block ml-20 pull-left" href="javascript:void(0);"><i className="zmdi zmdi-menu"></i></a>
          <a id="toggle_mobile_nav" className="mobile-only-view" href="javascript:void(0);"><i className="zmdi zmdi-more"></i></a>
        </div>
        <div id="mobile_only_nav" className="mobile-only-nav pull-right">
          <ul className="nav navbar-right top-nav pull-right">
            <li className="dropdown auth-drp">
              <a href="#" className="dropdown-toggle pr-0" data-toggle="dropdown">
                 <i className="zmdi zmdi-more-vert top-nav-icon"></i>
              </a>
              <ul className="dropdown-menu user-auth-dropdown" data-dropdown-in="flipInX" data-dropdown-out="flipOutX">
                {/* <li>
                  <a href="#"><i className="zmdi zmdi-settings"></i><span>Settings</span></a>
                </li>
                <li className="divider"></li> */}
                <li>
                  <a href="#"><i className="zmdi zmdi-power"></i><span>Log Out</span></a>
                </li>
              </ul>
            </li>
          </ul>
        </div>	
      </nav>
      );
    } 
  }