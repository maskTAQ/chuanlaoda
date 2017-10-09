import React, { Component } from 'react';
import classnames from 'classnames';

import styles from './loading.scss';

export default class Loading extends Component {
    static defaultProps={
        size:60,
        label:'加载中'
    };

    render() {
        const {size,label} = this.props;
        return (
            <div className={styles['loading-container']}>
                <div className={styles['loading-box']} style={{width:`${size}px`,height:`${size}px`}}>
                    <div className={classnames(styles['loading-wrapper'], styles.wrapper1)}>
                        <div className={styles.circle1}></div>
                        <div className={styles.circle2}></div>
                        <div className={styles.circle3}></div>
                        <div className={styles.circle4}></div>
                    </div>
                    <div className={classnames(styles['loading-wrapper'], styles.wrapper2)}>
                        <div className={styles.circle1}></div>
                        <div className={styles.circle2}></div>
                        <div className={styles.circle3}></div>
                        <div className={styles.circle4}></div>
                    </div>
                    <div className={classnames(styles['loading-wrapper'], styles.wrapper3)}>
                        <div className={styles.circle1}></div>
                        <div className={styles.circle2}></div>
                        <div className={styles.circle3}></div>
                        <div className={styles.circle4}></div>
                    </div>
                </div>
                <p className={styles['loading-label']}>{label}</p>
            </div>
        )
    }
}