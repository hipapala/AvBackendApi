import React from 'react';
import ReactDOM from 'react-dom';
 
class Hello extends React.Component {
  state = {
    isLoaded: false
  }


  render() {

    fetch(`/api/values`)
    .then( function(response) {
      return response;
    })
    .then( function(response) {
      setTimeout( function() {
        main.setState({
        infoStatus: 'loaded'
      });
      }, 300);
      return response.json();
    })
    .then( function(data) {
      main.setState({
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
    })
    .catch( function() {
      main.setState({
        infoStatus: 'error'
      });
    });


    return <h1>Heaaallo</h1>
  }
}
 
ReactDOM.render(<Hello/>, document.getElementById('hello'));
