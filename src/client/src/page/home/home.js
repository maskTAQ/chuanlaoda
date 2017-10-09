import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Dialog, FlatButton } from 'material-ui';

import Loading from 'components/loading/loading.js';
import List from 'components/list/list.js';
import { Api } from 'src/config.js';
import styles from './home.scss';

class Home extends Component {
    state = {
        //提示框的显示状态
        open: false,
        //页面所需数据的状态
        status: 'init',
        //页面所需数据
        data: null,
        //加载数据失败的原因
        message: ''
    };
    componentWillMount() {
        const { status } = this.props.orders;
        //如果store有数据就直接取 没有则获取
        if (status !== 'success') {
            this
                .props
                .getOrders();

        } else {
            this.setState({
                ...this.props.orders
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.orders.status === 'error') {
            this.handleOpen();
        }
        this.setState({
            ...nextProps.orders
        });
    }
    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    retryGetOrders() {
        this.handleClose();
        this
            .props
            .getOrders();
    }
    render() {
        const { status, data } = this.state;
        const actions = [(<FlatButton label="取消" primary={true} onClick={this.handleClose} />), (<FlatButton label="重试" primary={true} onClick={this.retryGetOrders} />)];
        switch (status) {
            case 'success':
                return (
                    <div className={styles.container} ref="containerList">
                        {/*
                        <Slide/>
                    */}
                        <List data={data} />
                    </div>
                );
            case 'init':
            case 'loading':
                return (
                    <Loading label={status} />
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

// Map Redux state to component props
function mapStateToProps(state) {
    const { orders } = state;
    return { orders }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        getOrders() {
            dispatch({
                type: 'getOrders',
                data: {
                    status: 'loading'
                }
            });
            axios
                .get(`${Api}/getOrders`)
                .then(res => {
                    const { Data, Status, Message } = res.data;
                    if (!Status) {
                        dispatch({
                            type: 'getOrders',
                            data: {
                                status: 'error',
                                message: Message
                            }
                        });
                        return
                    }
                    dispatch({
                        type: 'getOrders',
                        data: {
                            status: 'success',
                            data: Data
                        }
                    });
                })
                .catch(e => {

                    dispatch({
                        type: 'getOrders',
                        data: {
                            status: 'error',
                            message: e.toString()
                        }
                    });
                })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)