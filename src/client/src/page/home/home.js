import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import BScroll from 'better-scroll';
import axios from 'axios';

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
        const dom = findDOMNode(this.refs.containerList);
        let scroll = new BScroll(dom);
        this.getData();
    }
    getData(){
        console.log(`${Api}/getOrders`)
        axios.get(`${Api}/getOrders`)
        .then(res=>{
            console.log(res);
        })
        .catch(e=>{
            console.log(e)
        })
    }
    render() {
        const {data} = this.props;
        return (
            <div className={styles.container} ref="containerList">
                <ul className={styles.list} ref="list">
                    {data.map((item, i) => {
                        return (
                            <li className={styles['list-item']} key={i}>
                                {item}
                            </li>
                        )
                    })
}
                </ul>
            </div>
        )
    }
}