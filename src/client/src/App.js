import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'


import styles from './index.css';

import Home from 'page/home//home.js';
import BottomNav from 'components/bottomNav.js';


class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles.container}>
          <Route exact path="/home" component={Home} />
          <Route path="/market" component={Home} />
          <Route path="/me" component={Home} />

          <BottomNav />
        </div>
      </Router>
    );
  }

}

export default App;
