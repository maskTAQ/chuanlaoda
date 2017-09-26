import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import BScroll from 'better-scroll';
import axios from 'axios';
import { Dialog, FlatButton, FontIcon } from 'material-ui';
import moment from 'moment';

import List from 'components/list/list.js';
import { Api } from 'src/config.js';
import styles from './home.scss';

export default class Home extends Component {
    componentDidMount() {
        this.getData();
    }
    state = {
        open: false,
        status: 'init',
        data: null
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    getData() {
        this.setState({ status: 'loading' });
        axios
            .get(`${Api}/getOrders`)
            .then(res => {
                const { Data, Status, Message } = res.data;
                if (!Status) {
                    return this.handleOpen();
                }
                this.setState({ status: 'success', data: Data });
            })
            .catch(e => {
                this.handleOpen();
                this.setState({ status: 'error' });
            })
    }
    render() {
        const { status, data } = this.state;
        const actions = [(<FlatButton label="取消" primary={true} onClick={this.handleClose} />), (<FlatButton label="重试" primary={true} onClick={this.handleClose} />)];
        switch (status) {
            case 'success':
                return (
                    <div className={styles.container} ref="containerList">
                        <List data={data} />
                    </div>
                );
            case 'init':
                return (
                    <p>{status}</p>
                );
            default:
                return (
                    <div className={styles.container} ref="containerList">
                        <Dialog
                            actions={actions}
                            modal={false}
                            open={this.state.open}
                            onRequestClose={this.handleClose}>
                            数据加载失败,是否重试?
                         </Dialog>
                    </div>
                )
        }

    }
}
