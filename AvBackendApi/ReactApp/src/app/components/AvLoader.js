import React, {  
    Component,
  } from 'react';
  
  import { connect } from 'react-redux';
  
  import {  
    requestStart,
    requestFinish,
    store
  } from './redux';
  
  // App.js
  export class AvLoader extends Component {
    // componentDidMount(){
    //  var _this = this;
    //   this.props.requestStart();
    //   setTimeout(function(){
    //     _this.props.requestFinish();
    //    // alert();
    //   }, 4000);
    // }

    render() {
          // <button onClick={this.props.requestStart}>
          //   Exit Geod
          // </button>
          // <button onClick={() => this.props.requestFinish()}>
          //   Click Me!
          // </button>      
     // var _this = this;
    //   this.props.requestStart();
      // setTimeout(function(){
      //   _this.props.requestFinish();
      // }, 2000);
      return (
        <div>{this.props.activeReqCount > 0 ? (<div className="avloader"></div>) : ''}</div>
      );
    }
  
  }
  
  // AppContainer.js
  const mapStateToProps = (state, ownProps) => ({  
    activeReqCount: state.activeReq.activeReqCount,
  });
  
  const mapDispatchToProps = {  
    requestStart,
    requestFinish
  };

  const AvLoaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(AvLoader);
 
  export const httpHelper = { 
    get: (url, clbck) => {  
        store.dispatch(mapDispatchToProps.requestStart());
        fetch(url,{
          method: 'GET',
          credentials: "same-origin",
          headers: {"Content-Type": "application/json"}
        })
        .then(function(response){
          store.dispatch(mapDispatchToProps.requestFinish());
          return response.json();
        }).then(function(data){
          if(clbck) clbck(data);
        });
    },
    post: (url, data, clbck) => {  
      store.dispatch(mapDispatchToProps.requestStart());
      fetch(url,{
        method: 'POST',
        credentials: "same-origin",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
      })
      .then(function(response){
        store.dispatch(mapDispatchToProps.requestFinish());
        return response.json();
      }).then(function(data){
        if(clbck) clbck(data);
      });
    }, 
    put: (url, data, clbck) => {  
      store.dispatch(mapDispatchToProps.requestStart());
      fetch(url,{
        method: 'PUT',
        credentials: "same-origin",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
      })
      .then(function(response){
        store.dispatch(mapDispatchToProps.requestFinish());
        return response.json();
      }).then(function(data){
        if(clbck) clbck(data);
      });
    },     
    upload: (url, file, clbck) => {  
      var formData  = new FormData();
      formData.append('file', file)
      store.dispatch(mapDispatchToProps.requestStart());
      fetch(url,{
        method: 'POST',
        credentials: "same-origin",
        body: formData//,
     //   headers: {"Content-Type": "application/json"}
      })
      .then(function(response){
        store.dispatch(mapDispatchToProps.requestFinish());
        return response.json();
      }).then(function(data){
        if(clbck) clbck(data);
      });
    },     
    remove: (url, clbck) => {  
      store.dispatch(mapDispatchToProps.requestStart());
      fetch(url,{
        method: 'DELETE',
        credentials: "same-origin",
        headers: {"Content-Type": "application/json"}
      })
      .then(function(response){
        store.dispatch(mapDispatchToProps.requestFinish());
        return response.json();
      }).then(function(data){
        if(clbck) clbck(data);
      });
    },        
    post2: (data, clbck, test) => {  
      store.dispatch(mapDispatchToProps.requestStart());
      setTimeout(function(){
        store.dispatch(mapDispatchToProps.requestFinish())
        if(clbck) clbck(test);
      }, 2000);
    },    
    start: function(){ store.dispatch(mapDispatchToProps.requestStart())} 
  };
  export default AvLoaderContainer;