import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import axios from 'axios';

import ChatRoom from 'page/chatRoom/chatRoom.js';
import Login from 'page/login/login.js';
import Home from 'page/home/home.js';
import Market from 'page/market/market.js';
import Me from 'page/me/me.js';
import Register from 'page/register/register.js';
import BottomNav from 'components/bottomNav/bottomNav.js';
import {Api} from 'src/config.js';
import './common/styles/reset.scss';
import styles from './index.css';
import initState from './store.js';
import reducer from 'reducer';

const store = createStore(reducer, initState);

class App extends Component {
  componentWillMount() {

    axios
      .get(`${Api}/getloginstatus`, {
      //当我们在发送跨域请求时，request 的 credentials属性表示是否允许其他域发送cookie，
      withCredentials: 'credentials'
    })
      .then(({data}) => {
        const {Status, Data} = data;
        if (Status) {
          this
            .props
            .set_userInfo(Data);

        }
      })

  }
  render() {
    return (
      <Router>
        <div className={styles.container}>
          <div className={styles['container-item']}>
            <Switch>
              <Route path="/home" component={Home}/>
              <Route path="/market" component={Market}/>
              <Route path="/me" component={Me}/>
              <Route path="/Login" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route path="/chat-room" component={ChatRoom}/>
              <Route
                path="/"
                render={({location}) => {
                return (<Redirect to="/home"/>)
              }}></Route>
            </Switch>
          </div>
          <Route component={BottomNav}></Route>

        </div>
      </Router>
    )
  }
}
function mapDispatchToProps(dispatch) {
  return {
    set_userInfo(userInfo) {
      dispatch({type: 'set_userInfo', data: userInfo});
    }
  }
}
let A = connect(null, mapDispatchToProps)(App);
class ReduxContainer extends Component {

  render() {
    return (
      <Provider store={store}>
        <A/>
      </Provider>
    );
  }

}

export default ReduxContainer;
