import React, { Component, PropTypes } from 'react';

import { FontIcon, Paper } from 'material-ui';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

import styles from 'src/index.css';

export default class BottomNav extends Component {
    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired,
                createHref: PropTypes.func.isRequired
            }).isRequired
        }).isRequired
    }
    state = {
        selectedIndex: 0,
        //组件是否显示
        visible: true
    };
    componentWillUpdate() {
        this.judgeVisible();
    }
    componentWillMount() {
        this.judgeVisible();
    }
    link(path, index) {
        this.setState({ selectedIndex: index });
        this.context.router.history.push({ pathname: `/${path}` })
    }
    judgeVisible() {
        const pathMap = ['/home', '/market', '/me'],
            //这里的路径再按返回键的时候不准确
            // currentPath = this.context.router.route.location.pathname,
            currentPath = window.location.pathname,
            currentIndex = pathMap.indexOf(currentPath);
        const { selectedIndex } = this.state;
        //如果不是map中定义的路径则隐藏nav
        if (currentIndex === -1) {
            this.setState({
                visible: false
            });
        }
        console.log(selectedIndex, currentIndex, this.context.router, window.location.pathname)
        if (selectedIndex !== currentIndex) {
            this.setState({ selectedIndex: pathMap.indexOf(currentPath) });
        }

    }
    render() {
        const { visible } = this.state;
        if (!visible) {
            return null
        }
        return (
            <Paper zDepth={1} className={styles['bottom-nav']}>
                <BottomNavigation selectedIndex={this.state.selectedIndex}>
                    <BottomNavigationItem
                        label="首页"
                        icon={<FontIcon className="material-icons">home</FontIcon>}
                        onClick={() => this.link('home', 0)} />
                    <BottomNavigationItem
                        label="市场"
                        icon={<FontIcon className="material-icons">shopping_cart</FontIcon>}
                        onClick={() => this.link('market', 1)} />
                    <BottomNavigationItem
                        label="我"
                        icon={<FontIcon className="material-icons">face</FontIcon>}
                        onClick={() => this.link('me', 2)} />
                </BottomNavigation>
            </Paper>
        )
    }
}