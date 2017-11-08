import React, {Component} from 'react';
import {TextField, RaisedButton} from 'material-ui';
import {Link} from 'react-router-dom';
import axios from 'axios';

import paramStringify from 'utils/paramStringify.js';
import {Api} from 'src/config.js';
import styles from './login.scss';

export default class Login extends Component {
    state = {
        phoneOrEmail: '',
        phoneOrEmailErrorText: '',
        password: '',
        phone: '',
        email: '',
        passwordErrorText: ''
    };
    login = () => {
        const verifyResult = this.verifyValue();
        if (verifyResult) {
            axios.post(`${Api}/login`, paramStringify(this.state), {
                //当我们在发送跨域请求时，request 的 credentials属性表示是否允许其他域发送cookie，
                withCredentials: 'credentials'
            }).then(({data}) => {
                const {Status, Message} = data;
                console.log(data);
                if (Status) {
                    //this.props.history.push('/home');
                } else {
                    alert(Message)
                }
            }).catch(e => {
                console.log(e)
                alert('登录失败')
            });
        }
    }
    verifyValue(values) {
        const {password, phoneOrEmail} = Object.assign(this.state, values),
            phoneReg = /^1[3|4|5|7|8][0-9]{9}$/, //验证手机
            emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/; //验证邮箱

        if (phoneReg.test(phoneOrEmail)) {
            this.setState({phoneOrEmailErrorText: '', phone: phoneOrEmail});
        } else if (emailReg.test(phoneOrEmail)) {
            this.setState({phoneOrEmailErrorText: '', email: phoneOrEmail});
        } else {
            this.setState({phoneOrEmailErrorText: '手机号或邮箱输入错误'});
            return false;

        }
        if (password.length >= 6) {
            this.setState({passwordErrorText: ''});
        } else {

            this.setState({passwordErrorText: '密码必须大于六位'});
            return false;
        }

        return true;
    }
    onValueChange(type, value) {
        this.setState({[type]: value});
        this.verifyValue({[type]: value});
    }
    render() {
        const {password, passwordErrorText, phoneOrEmail, phoneOrEmailErrorText} = this.state;

        return (
            <div className={styles['container-login']}>
                <div className={styles['title']}>
                    登录
                </div>
                <div className={styles.content}>
                    <TextField
                        floatingLabelText="手机号或邮箱"
                        hintText="请输入您的手机号或邮箱"
                        errorText={phoneOrEmailErrorText}
                        value={phoneOrEmail}
                        onChange={(proxy, v) => {
                        this.onValueChange('phoneOrEmail', v)
                    }}/>
                    <TextField
                        floatingLabelText="密码"
                        hintText="请输入密码"
                        type="password"
                        value={password}
                        errorText={passwordErrorText}
                        onChange={(proxy, v) => {
                        this.onValueChange('password', v)
                    }}/>
                </div>
                <div className={styles.register}>
                    <Link to="/register">没有账号?点我注册</Link>
                </div>
                <RaisedButton label="登录" className={styles.button} onClick={this.login}/>
            </div>
        )
    }

}