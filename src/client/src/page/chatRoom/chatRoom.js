import React, { Component } from 'react';

const config = {
    appKey: '07a2803dfb55990e11cabe61b768c8e7',
    chatroomId: 17985963,
    chatroomAddresses: [
        "weblink04.netease.im:443"
    ],
    account: 'test',
    token: 'e1a798af33cac26c284e4f2344be251e',
}
export default class ChatRoom extends Component {
    state = {
        user: 'test',
        message:'-'
    };
    componentDidMount() {
        // setTimeout(()=>{
        //     this.initChatroom()
        // },1000)
    }
    initChatroom = () => {
        const { appKey, chatroomId, chatroomAddresses, account, token } = config;
        const { user } = this.state;
        const users = {
            test: 'e1a798af33cac26c284e4f2344be251e',
            test1: '3e562f60c6ebc35df8fcc352737fc73f',
        };
        if (!users[user]) {
            return alert('no one');
        }
        this.chatroom = new window.Chatroom({
            appKey,
            account: user,
            token:users[user],
            chatroomId,
            chatroomAddresses,
            onconnect: this.join,
            // onerror: onChatroomError,
            // onwillreconnect: onChatroomWillReconnect,
            // ondisconnect: onChatroomDisconnect,
            // 消息
            onmsgs: this.onmsgs
        });
    }
    join(res) {
        console.log(res, '进入聊天室')
    }
    sendMessage=()=>{
        const {message} = this.state;
        this.chatroom.sendText({
            text: message,
            done(error, msg) {
                console.log('发送聊天室' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient, error, msg);
            }
        });
    }
    onmsgs(res) {
        console.log(res, '接收到消息')
    }
    onUsernameChange=(e)=> {
        this.setState({
            user:e.target.value
        })
    }
    onmessageChange=(e)=> {
        this.setState({
            message:e.target.value
        })
    }
    render() {
        const { user ,message} = this.state;
        return (
            <div>
                <input type="text" value={user} onChange={this.onUsernameChange} />
                <button onClick={this.initChatroom}>进入</button>


                <input type="text" value={message} onChange={this.onmessageChange} />
                <button onClick={this.sendMessage}>发送</button>
            </div>
        )
    }
}