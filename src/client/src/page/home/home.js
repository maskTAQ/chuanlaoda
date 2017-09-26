import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import BScroll from 'better-scroll';
import axios from 'axios';
import {Dialog, FlatButton} from 'material-ui';
import {Api} from 'src/config.js';
import styles from './home.scss';

console.log(Api)
export default class Home extends Component {
    static defaultProps = {
        data: [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        ]
    };
    componentDidMount() {
        this.getData();
    }
    componentDidUpdate() {
        const {status} = this.state;
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
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };
    getData() {
        this.setState({status: 'loading'});
        axios
            .get(`${Api}/getOrders`)
            .then(res => {
                const {Data, Status, Message} = res.data;
                if (!Status) {
                    return this.handleOpen();
                }
                this.setState({status: 'success', data: Data});
            })
            .catch(e => {
                this.handleOpen();
                this.setState({status: 'error'});
            })
    }
    render() {
        const {status, data} = this.state;
        const actions = [(<FlatButton label="Cancel" primary={true} onClick={this.handleClose}/>), (<FlatButton label="Discard" primary={true} onClick={this.handleClose}/>)];

        switch (status) {
            case 'success':
                return (
                    <div className={styles.container} ref="containerList">
                        <ul className={styles.list} ref="list">
                            {data.map((item, i) => {
                                const {
                                    origin,
                                    destination,
                                    cargoType,
                                    shipmentTime,
                                    type,
                                    _id
                                } = item;
                                console.log(item)
                                return (
                                    <li className={styles['list-item']} key={_id}>
                                        <p className="title">
                                            <i className="origin">{origin}</i>
                                            <i className="destination">{destination}</i>
                                            <i className="cargo">{shipmentTime}</i>
                                        </p>
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