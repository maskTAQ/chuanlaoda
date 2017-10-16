import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, FlatButton } from 'material-ui';
import classnames from 'classnames';

import styles from './searchBar.scss';

class SearchBar extends Component {
    state = {
        //激活的项
        activeItem: '',
        origin: '',
        //终点
        destination: '',
        cargo: '',
        type: '',
        tunnage: ''
    };
    static defaultProps = {
        onConditionChange() {

        }
    }
    onConditionChange = () => {
        console.log(this.state);
        this.props.onConditionChange(this.state);
    }
    onHandleActiveItemChange(itemName) {
        if (this.state.activeItem === itemName) {
             this.setState({
                activeItem: ''
            });
        } else {
            this.setState({
                activeItem: itemName
            });
        }

    }
    onValueChange(key, value) {
        this.setState({
            [key]: value
        });
    }
    onHandleCargoChange(cargo) {
        if (this.state.cargo === cargo) {
            this.setState({
                cargo: ''
            });
        } else {
            this.setState({
                cargo
            });
        }
    }
    onHandleTypeChange(type) {
        if (this.state.type === type) {
            this.setState({
                type: ''
            });
        } else {
            this.setState({
                type
            });
        }
    }
    renderDropDown() {
        const { activeItem, origin, destination, cargo, type, tunnage } = this.state;
        const data = ['砂', '石子', '集装箱', '其他'];

        switch (activeItem) {
            case 'lane':
                return (
                    <div className={styles['choose-lane-container']}>
                        <div className={styles.line}>
                            <i className={styles.lable}>起点<hr className={styles.border} /></i>
                            <i className={styles.value}><TextField name="origin" value={origin} onChange={(e) => { this.onValueChange('origin', e.target.value) }} /></i>
                        </div>
                        <div className={styles.line}>
                            <i className={styles.lable}>终点<hr className={styles.border} /></i>
                            <i className={styles.value}><TextField name="destination" value={destination} onChange={(e) => { this.onValueChange('destination', e.target.value) }} /></i>
                        </div>
                    </div>
                );
            case 'cargo':
                return (
                    <div className={styles['choose-cargo-container']}>
                        <ul>
                            {
                                data.map((item, i) => {
                                    const isActive = item === cargo;
                                    return (
                                        <li key={item} onClick={() => { this.onHandleCargoChange(item) }} className={classnames({
                                            [styles.active]: isActive
                                        })}>{item}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                );
            case 'type':
                return (
                    <div className={styles['choose-type-container']}>
                        <ul>
                            {
                                ['找船', '找货'].map((item, i) => {
                                    const isActive = item === type;
                                    return (
                                        <li key={item} onClick={() => { this.onHandleTypeChange(item) }} className={classnames({
                                            [styles.active]: isActive
                                        })}>{item}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                );
            case 'tunnage':
                return (
                    <div className={styles['choose-tunnage-container']}>
                        <div className={styles.line}>
                            <i className={styles.lable}>吨数<hr className={styles.border} /></i>
                            <i className={styles.value}><TextField name="tunnage" value={tunnage} onChange={(e) => { this.onValueChange('tunnage', e.target.value) }} /></i>
                        </div>

                    </div>
                );
            //没有激活的项则不渲染
            case '':
            default:
                return null
        }
    }
    renderContent() {
        const { isVisible } = this.props;
        const { activeItem} = this.state;

        if (!isVisible || !activeItem) {
            return null;
        }
        return (
            <div className={classnames(styles.content, 'clearfix')}>
                {this.renderDropDown()}
                <FlatButton label="搜索" onClick={this.onConditionChange} primary={true} style={{ float: 'right' }} />
            </div>
        )
    }
    render() {
        const { isVisible } = this.props;
        const { activeItem } = this.state;
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
                    <li onClick={() => { this.onHandleActiveItemChange('lane') }} className={classnames({
                        [styles.active]: activeItem === 'lane'
                    })}>航线 <i className="fa fa-sort-desc"></i></li>
                    <li onClick={() => { this.onHandleActiveItemChange('cargo') }} className={classnames({
                        [styles.active]: activeItem === 'cargo'
                    })}>货物 <i className="fa fa-sort-desc"></i></li>
                    <li onClick={() => { this.onHandleActiveItemChange('type') }} className={classnames({
                        [styles.active]: activeItem === 'type'
                    })}>类型 <i className="fa fa-sort-desc"></i></li>
                    <li onClick={() => { this.onHandleActiveItemChange('tunnage') }} className={classnames({
                        [styles.active]: activeItem === 'tunnage'
                    })}>吨数 <i className="fa fa-sort-desc"></i></li>
                </ul>
                {this.renderContent()}
            </div>
        )
    }
}
// Map Redux state to component props
function mapStateToProps(state) {
    const { orders } = state;
    return { orders }
}
export default connect(mapStateToProps)(SearchBar)