import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import BScroll from 'better-scroll';
import axios from 'axios';
import { Dialog, FlatButton, FontIcon } from 'material-ui';
import moment from 'moment';

import { Api } from 'src/config.js';
import styles from './home.scss';

export default class Home extends Component {
    componentDidMount() {
        this.getData();
    }
    componentDidUpdate() {
        const { status } = this.state;
        if (status === 'success') {
            const dom = findDOMNode(this.refs.containerList);
            let scroll = new BScroll(dom);
        }

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
        const actions = [(<FlatButton label="Cancel" primary={true} onClick={this.handleClose} />), (<FlatButton label="Discard" primary={true} onClick={this.handleClose} />)];

        const typeMap = ['找货', '找船'];

        switch (status) {
            case 'success':
                return (
                    <div className={styles.container} ref="containerList">
                        <ul className={styles.list} ref="list">
                            {data.map((item, i) => {
                                let {
                                    origin,
                                    destination,
                                    cargoType,
                                    shipmentTime,
                                    createTime,
                                    cargoTonnage,
                                    type,
                                    _id
                                } = item;
                                shipmentTime = moment(createTime).format('M月D号');
                                return (
                                    <li className={styles['list-item']} key={_id}>
                                        <div className={styles.title}>
                                            <i className={styles.origin}>{origin}</i>
                                            <FontIcon className="material-icons" style={{ color: '#56e8f7', lineHeight: '20px', fontSize: '18px' }}>chevron_right</FontIcon>
                                            <i className={styles.destination}>{destination}</i>
                                            <i className={[styles.tag, styles['cargot-type']].join(' ')}>{cargoType}</i>
                                            <i className={[styles.tag, styles.type].join(' ')}>{typeMap[type]}</i>
                                            <i className={[styles.tag, styles['cargo-tonnage']].join(' ')}>{cargoTonnage}吨</i>
                                        </div>
                                        <div className={styles.detail}>
                                            <span>
                                                <i className={styles.label}>装货日期: </i>
                                                <i className={styles.valu}>{shipmentTime}</i>
                                            </span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>

                    </div>
                );
            case 'init':
                return (
                    <p>{status}</p>
                );
            default:
                return (
                    <Dialog
                        actions={actions}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}>
                        数据加载失败点我重试
                    </Dialog>
                )
        }

    }
}
