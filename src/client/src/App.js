import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import Login from 'page/login/login.js';
import Home from 'page/home/home.js';
import Market from 'page/market/market.js';
import BottomNav from 'components/bottomNav.js';

//import AddOrder from 'components/addOrder/addOrder.js';

import './common/styles/reset.scss';
import styles from './index.css';

import initState from './store.js';
import reducer from 'reducer';

const store = createStore(reducer, initState);
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className={styles.container}>
            <div className={styles['container-item']}>
              <Route exact path="/Login" component={Login}/>
              <Route exact path="/home" component={Home}/>
              <Route path="/market" component={Market}/>
              <Route path="/me" component={Home}/>
            </div>
            <BottomNav/>
          </div>
        </Router>
      </Provider>
    );
  }

}

export default App;
