import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {createStore} from 'redux';
import PropTypes from 'prop-types';
import {Provider, connect} from 'react-redux';
import axios from 'axios';

import ChatRoom from 'page/chatRoom/chatRoom.js';
import Login from 'page/login/login.js';
import Home from 'page/home/home.js';
import Market from 'page/market/market.js';
import Detail from 'page/detail/detail.js';
import Me from 'page/me/me.js';
import Register from 'page/register/register.js';
import BottomNav from 'components/bottomNav/bottomNav.js';
import {Api} from 'src/config.js';
import './common/styles/reset.scss';
import styles from './index.css';
import initState from './store.js';
import reducer from 'reducer';
import paramStringify from 'utils/paramStringify.js';

const store = createStore(reducer, initState);

class App extends Component {
  componentWillMount() {
    this
      .props
      .login()
      .catch(e => {
        console.log('app no logined');
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
              <Route path="/detail" component={Detail}/>
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
let AppWrapper = connect(null, mapDispatchToProps)(App);

function mapDispatchToProps(dispatch) {
  return {
    login(data) {
      let axiosInfo = {
        type: 'get',
        url: `${Api}/getloginstatus`,
        data: ''
      };
      if (data) {
        axiosInfo = {
          type: 'post',
          url: `${Api}/login`,
          data: paramStringify(data)
        };

      }
      return axios({
        method: axiosInfo.type, url: axiosInfo.url, data: axiosInfo.data,
        //当我们在发送跨域请求时，request 的 credentials属性表示是否允许其他域发送cookie，
        withCredentials: 'credentials'
      }).then(({data}) => {
        const {Status, Data, Message} = data;
        if (Status) {
          dispatch({
            type: 'set_userInfo',
            data: {
              status: 'success',
              data: Data
            }
          });
          return Promise.resolve();

        } else {
          dispatch({
            type: 'set_userInfo',
            data: {
              status: 'error',
              data: Message
            }
          });
          return Promise.reject(Message);
        }
      }).catch(e => {
        dispatch({
          type: 'set_userInfo',
          data: {
            status: 'error',
            data: e.toString()
          }
        });
        return Promise.reject(e.toString());
      })
    }
  }
}

class ReduxContainer extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppWrapper/>
      </Provider>
    );
  }

}

export default ReduxContainer;
