import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import BScroll from 'better-scroll';

import { FontIcon } from 'material-ui';
import moment from 'moment';

import styles from './list.scss';

export default class List extends Component {
    static defaultProps = {
        //滑动方向改变
        scrollUp(scroll) { console.log('up') },
        scrollDown(scroll) { console.log('down') }
    };

    store = {
        direction: ''
    };
    componentDidMount() {
        const dom = findDOMNode(this.refs.listContainer);
        this.scroll = new BScroll(dom);
        this.scroll.on('scrollStart', (...r) => {
            const { distY } = this.scroll;
            const { direction } = this.store;
            if (distY < 0 && direction !== 'up') {
                this.props.scrollUp();
                this.store.direction = 'up';
            } else if (distY > 0 && direction !== 'down') {
                this.props.scrollDown();
                this.store.direction = 'down';
            }
        });

    }
    render() {
        const { data } = this.props;
        return (
            <div ref="listContainer" style={{
                height: '100%'
            }}>
                <ul className={styles.list}>
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
                        const typeMap = ['找货', '找船'];
                        return (
                            <li className={styles['list-item']} key={_id}>
                                <div className={styles.title}>
                                    <i className={styles.origin}>| {origin}</i>
                                    <FontIcon
                                        className="material-icons"
                                        style={{
                                            color: '#56e8f7',
                                            lineHeight: '20px',
                                            fontSize: '18px'
                                        }}>&#xE5CC;</FontIcon>
                                    <i className={styles.destination}>{destination}</i>
                                    <i className={[styles.tag, styles['cargot-type']].join(' ')}>{cargoType}</i>
                                    <i className={[styles.tag, styles.type].join(' ')}>{typeMap[type]}</i>
                                    <i className={[styles.tag, styles['cargo-tonnage']].join(' ')}>{cargoTonnage}吨</i>
                                </div>
                                <div className={styles.detail}>
                                    <span>
                                        <i className={styles.label}>装货日期:
                                        </i>
                                        <i className={styles.valu}>{shipmentTime}</i>
                                    </span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}