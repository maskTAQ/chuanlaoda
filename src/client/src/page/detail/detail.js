import React, {Component} from 'react';

export default class Detail extends Component {
    render() {
        return (
            <div>详情组件-用户名：{this.props.location.state.data.username}</div>
        )
    }
}