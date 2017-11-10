import React, {Component} from 'react';
import {TextField, RaisedButton} from 'material-ui';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';

import paramStringify from 'utils/paramStringify.js';
import {Api} from 'src/config.js';
import styles from './login.scss';
import Validator from 'utils/formVerify.js';

class Login extends Component {
    state = {
        phoneOrEmail: '13696526122',
        phoneOrEmailErrorText: '',
        password: '123456',
        phone: '13696526122',
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
                const {Status, Message, Data} = data;
                if (Status) {
                    this
                        .props
                        .set_userInfo(Data);
                    this
                        .props
                        .history
                        .push('/home', {
                            from: '/login',
                            to: '/home'
                        });
                } else {
                    alert(Message)
                }
            }).catch(e => {
                alert('登录失败')
            });
        }
    }
    verifyValue(values) {
        const {password, phoneOrEmail} = Object.assign(this.state, values);
        let result = true;

        const validator = new Validator();
        validator.add(phoneOrEmail, [
            {
                strategy: 'isPhone',
                errorMsg: '请输入手机号'
            }, {
                strategy: 'isEmail',
                errorMsg: '请输入邮箱'
            }
        ], (e) => {
            if (e.length === 2) {
                result = false;
                this.setState({phoneOrEmailErrorText: e[0]});
            } else {
                if (e[0] === '请输入手机号') {
                    this.setState({email: phoneOrEmail, phoneOrEmailErrorText: ''});
                } else {
                    this.setState({phone: phoneOrEmail, phoneOrEmailErrorText: ''});
                }
            }
        });
        validator.add(password, [
            {
                strategy: 'isNoEmpty',
                errorMsg: '密码不可为空'
            }, {
                strategy: 'minLength:6',
                errorMsg: '密码不能小于6位'
            }
        ], (e) => {
            result = false;
            this.setState({
                passwordErrorText: e.join()
            });
        });
        if (result) {
            this.setState({passwordErrorText: ''});
        }

        validator.start();

        return result;
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

function mapStateToProps(state) {
    const {userInfo} = state;

    return {userInfo}
}
function mapDispatchToProps(dispatch) {
    return {
        set_userInfo(userInfo) {
            dispatch({type: 'set_userInfo', data: userInfo});
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)