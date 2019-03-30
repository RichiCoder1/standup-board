import React, { Component } from 'react';
import '@atlaskit/css-reset';
import './App.css';
import { Route } from 'react-router';
import Home from './pages/Home';
import StandupBoard from './pages/StandupBoard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/standup-board" component={StandupBoard} />
      </div>
    );
  }
}

export default App;
