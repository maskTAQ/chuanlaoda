import React, { Component } from 'react';
import axios from 'axios';
import { Dialog, FlatButton, IconButton, FontIcon } from 'material-ui';
import List from 'components/list/list.js';
import { Api } from 'src/config.js';
import styles from './market.scss';

export default class MarKet extends Component {
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
    addOrder=()=>{
       console.log('add')
    }
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
                    <div className={styles.container}>
                        <List data={data} />
                        <IconButton className={styles['add-order']} iconStyle={{ color: '#fff' }} onClick={this.addOrder}>
                            <FontIcon className={`material-icons`}>add</FontIcon>
                        </IconButton>
                    </div>
                );
            case 'init':
                return (
                    <p>{status}</p>
                );
            default:
                return (
                    <div className={styles.container}>
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
