import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { Provider } from 'react-redux';  
import { store } from './components/redux';

import AvLoader from './components/AvLoader'; 
import {httpHelper} from './components/AvLoader'; 
import AvLogin from './pages/AvLogin'; 


export const rootScope = {
  auth:{
    isAuthenticated: false
  }
}


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    rootScope.auth.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

class AvUsers extends React.Component {
  render() {
    return (
      <div>
        <h2>AvUsers</h2>
        <div><input type="text" /></div>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

const AuthButton = withRouter(({ history }) => (
  rootScope.auth.isAuthenticated ? (
    <p>
      Welcome!
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

class AvRoot extends React.Component {
  state = {
    isLoaded: false,
    auth: rootScope.auth
  }

  setAuth(){
    this.setState({ auth: rootScope.auth });
  }

  componentDidMount(){
    var _this = this;
    setTimeout(function(){
     // rootScope.auth.isAuthenticated = true;
      _this.setState({ isLoaded: true });
    }, 1000);
    setTimeout(function(){
    //  rootScope.auth.isAuthenticated = true;
      rootScope.test = true;
   //   _this.setState(_this.state);
    }, 3000);    
  }

  render() {
    // const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { isLoaded } = this.state
    const { auth } = this.state

    if (!isLoaded) {
      return (
        <div>WAITING</div>
      )
    }

    return 
    <div>
      <AvLoader />
      <span>{this.state.eina}</span>
        {auth.isAuthenticated ? (
    <p>
      Welcome!
    </p>
  ) : (
    <p>You are not logged in.</p>
  )}
            <Router>          
              <div>
              
              { <ul>
        <li><Link to="/users">users</Link></li>
        <li><Link to="/login">login</Link></li>
      </ul>                     }
                <Switch>
                  {/* <Route path="/login" component={AvLogin}  setAuth={this.setAuth}  /> */}
                  
                  <Route path="/login" render={(props)=><AvLogin {...props} root={this} />}  />

                  <PrivateRoute path="/users" component={AvUsers}/>
                  <Route render={() => (<Redirect to="/users" />)} />
                </Switch>
              </div>
            </Router>      
      </div>
  }
}

ReactDOM.render(<Provider store={store}><AvRoot /></Provider>, document.getElementById('react_main'));