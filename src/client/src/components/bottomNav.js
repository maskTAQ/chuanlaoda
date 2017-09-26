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
        selectedIndex: 0
    };
    componentWillMount() {
        //链接进来校准路由
        const pathMap = ['/home', '/market', '/me'];
        this.setState({ selectedIndex: pathMap.indexOf(this.context.router.route.location.pathname) });
    }
    link(path, index) {
        this.setState({ selectedIndex: index });
        this.context.router.history.push({ pathname: `/${path}` })
    }
    render() {
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