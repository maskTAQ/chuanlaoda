import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';

import Loading from 'components/loading/loading.js';
import styles from './me.scss';

moment.locale('zh-cn');
class Me extends Component {
    static defaultProps = {
        unreadMessages: [
            {
                username: '游客',
                time: moment("20171005", "YYYYMMDD").fromNow(),
                message: '查看了你发布的消息!'
            }, {
                username: '李先生',
                time: moment("20170905", "YYYYMMDD").fromNow(),
                message: '关注了你发布的消息!'
            }
        ]
    };
    componentWillMount() {
        const { status } = this.props.userInfo;
        if (status === 'error') {
            this
                .props
                .history
                .push('/login', {
                    form: 'me',
                    to: 'login'
                });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfo.status === 'error') {
            this
                .props
                .history
                .push('/login', {
                    form: 'me',
                    to: 'login'
                });
        }
    }
    render() {
        const { status, data } = this.props.userInfo;
        switch (status) {
            case 'init':
                return (<Loading />);
            case 'success':
            default:
                return (
                    <div className={styles['me-container']}>
                        <div className={styles.header}>
                            <h2 className={styles.welcome}>你好,{data.username}!</h2>
                            <div className={styles.avatar}></div>
                        </div>
                        {this.renderList()
                        }
                    </div>
                );
        }

    }
    renderList() {
        const { unreadMessages } = this.props;
        const l = unreadMessages.length;
        if (l) {
            return (
                <div className={styles.list}>
                    <p className={styles.title}>{l}条与您有关的消息!</p>
                    {unreadMessages.map(item => {
                        const { username, time, message } = item;
                        return (
                            <div className={styles.item} key={time + username}>
                                <div className={styles.border}></div>
                                <div className={styles.content}>
                                    <div className={styles.top}>
                                        <i className={styles.username}>{username}</i>
                                        <i className={styles.time}>{time}</i>
                                    </div>
                                    <div className={styles.bottom}>{message}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <p>暂未有与您相关的消息哦!</p>
            )
        }
    }
}

function mapStateToProps(state) {
    const { userInfo } = state;
    return { userInfo };
}

export default connect(mapStateToProps, null)(Me)