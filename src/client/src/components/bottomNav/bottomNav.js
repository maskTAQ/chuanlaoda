import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontIcon, Paper } from 'material-ui';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

import styles from './bottomNav.scss';

class BottomNav extends Component {
    link(path, index) {
        this.props.history.push({ pathname: `/${path}` })
    }
    render() {
        const {isBottomNavVisible,location:{pathname:currentPath}} = this.props;
        const bottom = isBottomNavVisible
            ? 0
            : -56;
        const isPlaceholder =currentPath === '/market';
        const pathMap = ['/home', '/market', '/me'];

        if (pathMap.indexOf(currentPath) === -1) {
            return null
        }
        
        //在market页面时 此组件脱离文档流 这样列表就能渲染整个高度了
        return (
            <Paper zDepth={1} className={styles['bottom-nav']} style={{bottom:`${bottom}px`,position:isPlaceholder ?'absolute':'relative'}}>
            <BottomNavigation selectedIndex={pathMap.indexOf(currentPath)}>
                <BottomNavigationItem
                    label="首页"
                    icon={<FontIcon className="material-icons">&#xE88A;</FontIcon>}
                    onClick={() => this.link('home', 0)} />
                <BottomNavigationItem
                    label="市场"
                    icon={<FontIcon className="material-icons">&#xE8CC;</FontIcon>}
                    onClick={() => this.link('market', 1)} />
                <BottomNavigationItem
                    label="我"
                    icon={<FontIcon className="material-icons">&#xE87C;</FontIcon>}
                    onClick={() => this.link('me', 2)} />
            </BottomNavigation>
            </Paper>
            
        )
    }
}

// Map Redux state to component props
function mapStateToProps(state) {
    const {  isBottomNavVisible } = state;
    return { isBottomNavVisible }
}
export default connect(mapStateToProps,null)(BottomNav)