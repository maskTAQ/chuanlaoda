import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import BScroll from 'better-scroll';

import styles from './slide.scss';
export default class Slide extends Component {
    static defaultProps = {
        data: [{ title: 1, url: '' }, { title: 1, url: '' }, { title: 1, url: '' }, { title: 1, url: '' }],
        loop: true
    }
    componentDidMount() {
        this._setSlideWidth();
    }
    _setSlideWidth(isResize) {
        const { loop } = this.props;
        const dom = findDOMNode(this.refs.slideWrapper);
        const children = dom.children;

        let width = 0
        let slideWidth = dom.clientWidth
        for (let i = 0; i < children.length; i++) {
            let child = children[i]
            child.style.width = slideWidth + 'px'
            width += slideWidth
        }
        if (loop) {
            width += 2 * slideWidth
        }
        dom.style.width = width + 'px';
        setTimeout(()=>{
            this.scroll = new BScroll(dom, {
                scrollX: true,
                momentum: false,
                snap: {
                    loop,
                    threshold: 0.3,
                    speed: 400
                }
            });
        },200)
    }
    render() {
        const { data } = this.props;
        return (
            <div className={styles['slide-container']} ref="slideContainer">
                <ul className={styles['slide-wrapper']} ref="slideWrapper">
                    {data.map(item => {
                        return (
                            <li className={styles['slide-item']}>{item.title}</li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}