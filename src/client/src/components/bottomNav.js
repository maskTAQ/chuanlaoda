import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FontIcon, Paper } from 'material-ui';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

import styles from 'src/index.css';

class BottomNav extends Component {
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
        const { selectedIndex,visible } = this.state;

        //如果不是map中定义的路径则隐藏nav
        if(visible){
            if (currentIndex === -1) {
                this.setState({
                    visible: false
                });
            } 
        }else{
            if (currentIndex > -1) {
                this.setState({
                    visible:true
                });
            } 
        }
        
        //同步nav的激活状态
        if (selectedIndex !== currentIndex) {
            this.setState({ selectedIndex: pathMap.indexOf(currentPath) });
        }

    }
    render() {
        const { visible } = this.state;
        const {isBottomNavVisible} = this.props;
        if (!visible || !isBottomNavVisible) {
            return null
        }
        return (
            <Paper zDepth={1} className={styles['bottom-nav']}>
                <BottomNavigation selectedIndex={this.state.selectedIndex}>
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
export default connect(mapStateToProps)(BottomNav)