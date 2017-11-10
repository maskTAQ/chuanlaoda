import React, {Component} from 'react';
import classNames from 'classNames';
import {TextField, RaisedButton} from 'material-ui';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';

import paramStringify from 'utils/paramStringify.js';
import {Api} from 'src/config.js';
import styles from './register.scss';
import Validator from 'utils/formVerify.js';

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

class Register extends Component {
    state = {
        tabIndex: 0,
        username: '',
        usernameErrorText: '',
        password: '',
        passwordErrorText: '',
        email: '',
        phone: '',
        phoneErrorText: '',
        wxId: '',
        //船号
        shipNumber: '',
        shipNumberErrorText: '',
        //船载重
        shipTonnage: '',
        shipTonnageErrorText: ''
    };
    onTabChange = (tabIndex) => {
        this.setState({tabIndex});
    }
    register = () => {
        const verifyResult = this.verifyValue();
        const {
            username,
            password,
            email,
            phone,
            shipNumber,
            shipTonnage,
            tabIndex
        } = this.state;

        if (verifyResult) {
            axios.post(`${Api}/register`, paramStringify({
                username,
                password,
                email,
                phone,
                shipNumber,
                shipTonnage,
                userType: tabIndex
            }), {
                //当我们在发送跨域请求时，request 的 credentials属性表示是否允许其他域发送cookie，
                withCredentials: 'credentials'
            }).then(({data}) => {
                const {Status, Message,Data} = data;
                if (Status) {
                    this
                    .props
                    .set_userInfo(Data);
                    this
                        .props
                        .history
                        .push('/home', {
                            form: 'register',
                            to: 'home'
                        });
                } else {
                    alert(Message)
                }
            }).catch(e => {
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
            shipTonnage,
            tabIndex
        } = Object.assign(this.state, values);

        const validator = new Validator();
        this.setState({usernameErrorText: '', passwordErrorText: '', phoneErrorText: '', shipNumberErrorText: '', shipTonnageErrorText: ''})

        validator.add(username, [
            {
                strategy: 'minLength:2',
                errorMsg: '用户名不能少于二位数'
            }
        ], (e) => {
            this.setState({usernameErrorText: e[0]});
        });
        validator.add(password, [
            {
                strategy: 'minLength:6',
                errorMsg: '密码不能少于六位数'
            }
        ], (e) => {
            this.setState({passwordErrorText: e[0]});
        });

        validator.add(phone, [
            {
                strategy: 'isPhone',
                errorMsg: '请输入正确的手机号'
            }
        ], (e) => {
            this.setState({phoneErrorText: e[0]});
        });
        if (tabIndex === 0) {
            validator.add(shipNumber, [
                {
                    strategy: 'isNoEmpty',
                    errorMsg: '请输入船号'
                }
            ], (e) => {
                this.setState({shipNumberErrorText: e[0]});
            });
            validator.add(shipTonnage, [
                {
                    strategy: 'isNoEmpty',
                    errorMsg: '请输入船载重吨数'
                }
            ], (e) => {
                this.setState({shipTonnageErrorText: e[0]});
            });
        }
        //邮箱不是强制需要的
        if (email) {
            validator.add(email, [
                {
                    strategy: 'isEmail',
                    errorMsg: '请输入正确的邮箱'
                }
            ], (e) => {
                this.setState({emailErrorText: e[0]});
            });
        }

        let result = validator.start();
        return result.length === 0;
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
                    </div>
                )
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_userInfo(userInfo) {
            dispatch({type: 'set_userInfo', data: userInfo});
        }
    }
}

export default connect(null,mapDispatchToProps)(Register)