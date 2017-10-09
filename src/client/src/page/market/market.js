import React, { Component } from 'react';
import { connect } from 'react-redux';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import axios from 'axios';
import { Dialog, FlatButton, IconButton, FontIcon } from 'material-ui';

import paramStringify from 'utils/paramStringify.js';
import Loading from 'components/loading/loading.js';
import List from 'components/list/list.js';
import AddOrder from 'components/addOrder/addOrder.js';
import { Api } from 'src/config.js';
import styles from './market.scss';

class MarKet extends Component {
    state = {
        //对话框的状态
        isDialogVisible: true,
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
    componentDidMount() {
        this.removeModal();
    }
    componentWillReceiveProps(nextProps) {
        const { status } = nextProps.orders;
        //数据获取失败 提醒用户
        if (status === 'error') {
            this.setState({ isDialogVisible: true });
        }

        this.setState({
            ...nextProps.orders
        });
    }
    handleClose = () => {
        this.setState({ isDialogVisible: false });
    };
    retryGetOrders = () => {
        this.handleClose();
        this
            .props
            .getOrders();
    }
    showAddOrderModal = () => {
        this.renderModal((<AddOrder onClose={this.removeModal} onFinish={this.addOrder} />));
    }
    addOrder = (data) => {
        axios
            .post(`${Api}/pubulishCargo`, paramStringify(Object.assign(data, { username: '1' })))
            .then(res => {
                const { Status, Message } = res.data;
                if (Status) {
                    this.removeModal();
                    this.props.getOrders();
                } else {
                    alert(Message)
                }
            })
            .catch(e => {
                alert('发布失败')
            });


    }
    render() {
        const { status, data } = this.state;
        switch (status) {
            case 'success':
                return (
                    <div className={styles.container} ref="containerList">
                        <List data={data} scrollDown={() => { this.props.toggleBottomNav('show') }} scrollUp={() => { this.props.toggleBottomNav('hide') }} />
                        <IconButton
                            className={styles['add-order']}
                            iconStyle={{
                                color: '#fff'
                            }}
                            onClick={this.showAddOrderModal}>
                            <FontIcon className="material-icons">&#xE145;</FontIcon>
                        </IconButton>
                    </div>
                );
            case 'init':
            case 'loading':
                return (
                    <Loading label={status} />
                );
            default:
                return this.renderDialog();
        }

    }
    renderModal(child) {
        /*
        @param {parentComponent} 父组件
        @param {nextElement} 要插入到DOM中的组件
        @param{container} 要插入到的容器
        @param {callback} 第一次渲染为null
        */
        if (!this.layerContainer) {
            this.layerContainer = document.createElement('div');
            this.layerContainer.id = 'layer';
            Object.assign(this.layerContainer.style, {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)'
            });
            document
                .body
                .appendChild(this.layerContainer);
        }
        unstable_renderSubtreeIntoContainer(this, child, this.layerContainer);
    }
    removeModal = () => {
        if (this.layerContainer) {
            document
                .body
                .removeChild(this.layerContainer);
            this.layerContainer = null;
        }

    }
    renderDialog() {
        const actions = [(<FlatButton label="取消" primary={true} onClick={this.handleClose} />), (<FlatButton label="重试" primary={true} onClick={this.retryGetOrders} />)];

        return (
            <Dialog
                actions={actions}
                modal={true}
                open={this.state.isDialogVisible}
                onRequestClose={this.handleClose}>
                数据加载失败,是否重试?
            </Dialog>
        );
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
        },
        toggleBottomNav(type) {
            dispatch({
                type: 'toggleBottomNav', 
                data:type
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarKet)