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
import AvLogin from './pages/AvLogin.jsx'; 
import AvUsers from './pages/AvUsers.jsx'; 
import AvXmls from './pages/AvXmls.jsx'; 
import AvXml from './pages/AvXml.jsx'; 
import {AvTopMenu} from './components/AvTopMenu'; 
import {AvLeftMenu} from './components/AvLeftMenu'; 
import {AvContent} from './components/AvContent'; 


export const rootScope = {
  auth:{
    isAuthenticated: false
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    rootScope.auth.isAuthenticated ? (
      <div className="wrapper theme-1-active pimary-color-green">
        <AvTopMenu auth={rootScope.auth} />
        <AvLeftMenu auth={rootScope.auth} />
        <Component {...props}/>
      </div>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

class AvRoot extends React.Component {
  state = {
    isLoaded: false
  }

  componentDidMount(){
   // this.setState({ isLoaded: true });
    httpHelper.get('/api/auth', (data)=>{
      rootScope.auth = data;
      this.setState({ isLoaded: true });
    });
  }

  render() {
    const { isLoaded } = this.state

    if (!isLoaded) {
      return (
        <div>
          <AvLoader />
        </div>
      )
    }

    return (
    <div>
      <AvLoader />
      <Router>          
          <Switch>
            <Route path="/login" render={(props)=><AvLogin {...props} />}  />
            <PrivateRoute path="/users" component={AvUsers}/>
            <PrivateRoute path="/xmls" component={AvXmls}/>
            <PrivateRoute path="/xml/:id?" component={AvXml}/>
            <Route render={() => (<Redirect to="/users" />)} />
          </Switch>
      </Router>      
    </div>
    )
  }
}

ReactDOM.render(<Provider store={store}><AvRoot /></Provider>, document.getElementById('react_main'));