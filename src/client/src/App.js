import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Home from 'page/home//home.js';
import BottomNav from 'components/bottomNav.js';

import './common/styles/reset.scss';
import styles from './index.css';
class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles.container}>
          <div className={styles['container-item']}>
            <Route exact path="/home" component={Home}/>
            <Route path="/market" component={Home}/>
            <Route path="/me" component={Home}/>
          </div>
          <BottomNav/>
        </div>
      </Router>
    );
  }

}

export default App;
