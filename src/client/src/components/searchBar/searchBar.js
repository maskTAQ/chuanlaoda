import React, {Component} from 'react';
import {connect} from 'react-redux';

import styles from './searchBar.scss';

class SearchBar extends Component {
    render() {
        const {isVisible} = this.props;
        const top = isVisible
            ? 0
            : -40;
        return (
            <div
                className={styles['search-bar-container']}
                style={{
                top: `${top}px`
            }}>
                <ul>
                    <li>线路 <i className="fa fa-sort-desc" aria-hidden="true"></i></li>
                    <li>货物 <i className="fa fa-sort-desc" aria-hidden="true"></i></li>
                    <li>类型 <i className="fa fa-sort-desc" aria-hidden="true"></i></li>
                    <li>吨数 <i className="fa fa-sort-desc" aria-hidden="true"></i></li>
                </ul>
            </div>
        )
    }
}
// Map Redux state to component props
function mapStateToProps(state) {
    const {orders} = state;
    return {orders}
}
export default connect(mapStateToProps)(SearchBar)