import React, {Component} from 'react';
import classNames from 'classNames';
import {TextField, RaisedButton} from 'material-ui';
import {Link} from 'react-router-dom';
import axios from 'axios';

import paramStringify from 'utils/paramStringify.js';
import {Api} from 'src/config.js';
import styles from './register.scss';

class Tab extends Component {
    static defaultProps = {
        selectIndex: 0,
        onTabChange() {}
    };
    render() {
        const tabs = ['船主', '货主'];
        const {selectIndex} = this.props;
        const boundary = (i) => {
            if (i === 1) {
                return (
                    <i className={styles.boundary}>/</i>
                )
            } else {
                return null
            }
        }
        return (
            <div className={styles.tab}>
                {tabs.map((item, i) => {
                    return (
                        <div
                            className={classNames(styles['tab-item'], {
                            [styles.active]: i === selectIndex
                        })}
                            onClick={() => {
                            this
                                .props
                                .onTabChange(i)
                        }}
                            key={item}>{boundary(i)}{item}</div>
                    )
                })
}

            </div>
        )
    }
}

export default class Register extends Component {
    state = {
        tabIndex: 0,
        username: '邰爱强',
        usernameErrorText: '',
        password: '123456',
        email: '50889574@qq.com',
        phone: '13696526122',
        wxId: '',
        //船号
        shipNumber: '',
        //船载重
        shipTonnage: ''
    };
    constructor(){
        super();

        //提交给后端的数据
        this.postUserData = {};
    }
    onTabChange = (tabIndex) => {
        this.setState({tabIndex});
    }
    register = () => {
        const verifyResult = this.verifyValue();
        if (verifyResult) {
            axios
                .post(`${Api}/register`, paramStringify(this.postUserData))
                .then(({data}) => {
                    const {Status, Message} = data;
                    console.log(data);
                    return
                    if (Status) {
                        this
                            .props
                            .history
                            .push('/home');
                    } else {
                        alert(Message)
                    }
                })
                .catch(e => {
                    alert('注册失败')
                });
        }
    }
    verifyValue(values) {
        const {
            username,
            password,
            email,
            phone,
            shipNumber,
            shipTonnage
        } = this.state;
        const {tabIndex} = this.state;
        values = Object.assign({
            username,
            password,
            email,
            phone,
            shipNumber,
            shipTonnage
        }, values);
        let stayVerifyValues = values;

        if(tabIndex === 1 ){
            stayVerifyValues = {
                username,
                password,
                email,
                phone,
            }
        }

        let result = true;
        for (let item in stayVerifyValues) {
            if (stayVerifyValues[item]) {
                this.setState({
                    [`${item}ErrorText`]: ''
                });

            } else {
                //邮箱可不填
                if (item === 'email') {
                    continue;
                }
                this.setState({
                    [`${item}ErrorText`]: '请填写此项'
                });
                result = false;
            }
        }
        stayVerifyValues.userType = tabIndex;
        this.postUserData = stayVerifyValues;
        return result;
    }
    render() {
        const {tabIndex} = this.state;
        return (
            <div className={styles['container-register']}>
                <Tab selectIndex={tabIndex} onTabChange={this.onTabChange}/> {this.renderContent()}
                <div className={styles.login}>
                    <Link to="/login">已有账号?点我登录</Link>
                </div>
                <RaisedButton label="注册" className={styles.button} onClick={this.register}/>
            </div>
        )
    }
    onValueChange(type, value) {
        this.setState({[type]: value});
        this.verifyValue({[type]: value});
    }
    renderContent() {
        const {
            tabIndex,
            username,
            usernameErrorText,
            password,
            passwordErrorText,
            email,
            phone,
            phoneErrorText,
            shipNumber,
            shipNumberErrorText,
            shipTonnage,
            shipTonnageErrorText
        } = this.state;

        switch (String(tabIndex)) {
            case '0':
                return (
                    <div className={styles.content}>
                        <TextField
                            floatingLabelText="用户名"
                            hintText="请输入您的真实姓名"
                            errorText={usernameErrorText}
                            value={username}
                            onChange={(proxy, v) => {
                            this.onValueChange('username', v)
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
                        <TextField
                            floatingLabelText="邮箱"
                            hintText="请输入邮箱,此项不是必须的！"
                            value={email}
                            onChange={(proxy, v) => {
                            this.onValueChange('email', v)
                        }}/>
                        <TextField
                            floatingLabelText="手机"
                            hintText="请输入您的手机号"
                            value={phone}
                            errorText={phoneErrorText}
                            onChange={(proxy, v) => {
                            this.onValueChange('phone', v)
                        }}/>
                        <TextField
                            floatingLabelText="载重"
                            hintText="请输入您船的载重吨数"
                            value={shipNumber}
                            errorText={shipNumberErrorText}
                            onChange={(proxy, v) => {
                            this.onValueChange('shipNumber', v)
                        }}/>
                        <TextField
                            floatingLabelText="船号"
                            hintText="请输入您的船号"
                            value={shipTonnage}
                            errorText={shipTonnageErrorText}
                            onChange={(proxy, v) => {
                            this.onValueChange('shipTonnage', v)
                        }}/>
                    </div>
                )
            case '1':
            default:
                return (
                    <div className={styles.content}>
                        <TextField
                            floatingLabelText="用户名"
                            hintText="请输入您的真实姓名"
                            value={username}
                            onChange={(proxy, v) => {
                            this.onValueChange('username', v)
                        }}/>
                        <TextField
                            floatingLabelText="密码"
                            hintText="请输入密码"
                            type="password"
                            value={password}
                            onChange={(proxy, v) => {
                            this.onValueChange('password', v)
                        }}/>
                        <TextField
                            floatingLabelText="邮箱"
                            hintText="请输入邮箱,此项不是必须的！"
                            value={email}
                            onChange={(proxy, v) => {
                            this.onValueChange('email', v)
                        }}/>
                        <TextField
                            floatingLabelText="手机"
                            hintText="请输入您的手机号"
                            value={phone}
                            onChange={(proxy, v) => {
                            this.onValueChange('phone', v)
                        }}/>
                    </div>
                )
        }
    }
}