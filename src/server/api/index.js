const Router = require('koa-router');
const Hashes = require('jshashes');
const axios = require('axios');
const mongoose = require('mongoose');

const Api = new Router();
const router = new Router();
const {userSchema, freightOrderSchema} = require('../schema');
const {setCookie} = require('../utils/setCookie.js');

//连接数据库
const db = mongoose.createConnection('mongodb://localhost/chuanlaoda');
db.on('error', (e) => {
    console.error(`connection error : ${e}`)
});
db.once('open', () => {
    console.log(`connected`)
});

mongoose.Promise = global.Promise;
//用户模板实例化用户模型
const User = db.model('User', userSchema);
const FreightOrder = db.model('FreightOrder', freightOrderSchema);

Api.post('/register', async(ctx) => {
    const {username, password, phone, userType,email} = ctx.request.body;
    if (!username || !password || !phone) {
        ctx.body = {
            Status: 0,
            Message: '请完整填写注册信息',
            Data: ctx.request.body
        };
        return
    }

    //实例化用户
    const u = new User(ctx.request.body);
    await u
    //检测用户是否能注册
        .canRegister()
        .then(u.save())
        .then(() => {
            setCookie(ctx, phone, password);
            ctx.body = {
                Status: 1,
                Message: '注册成功',
                Data:{username, email, phone, userType}
            };
        })
        .catch(e => {
            setCookie(ctx, phone, password);
            ctx.body = {
                Status: 0,
                Message: e,
                Data: e
            };
        })
});

Api.post('/login', async(ctx) => {
    const {phone, password, email} = ctx.request.body;
    const searchCondition = {};
    if (phone && password) {
        searchCondition.phone = phone;
    } else if (email && password) {
        searchCondition.email = email;
    } else {
        ctx.body = {
            Status: 0,
            Message: '请完整填写登录信息',
            Data: ctx.request.body
        };
        return
    }

    await User
        .findOne(searchCondition)
        .then((res) => {
            if (!res) {
                return ctx.body = {
                    Status: 0,
                    Message: '用户不存在'
                };
            }
            if (res.password != password) {
                return ctx.body = {
                    Status: 0,
                    Message: '用户名或密码错误'
                };
            }
            setCookie(ctx, phone, password);
            delete res.password;
            return ctx.body = {
                Status: 1,
                Message: '登录成功',
                Data: res
            };

        })
        .catch(e => {
            ctx.body = {
                Status: 0,
                Message: '登录失败',
                Data: e
            };
        })

});

Api.post('/pubulishCargo', async(ctx) => {
    const {
        username,
        origin,
        destination,
        cargoType,
        cargoTonnage,
        shipmentTime,
        remarks
    } = ctx.request.body;

    if (!username || !origin || !destination || !cargoType || !cargoTonnage || !shipmentTime) {
        ctx.body = {
            Status: 0,
            Message: '请完整填写货运信息',
            Data: ctx.request.body
        };
        return
    }

    const freightOrderInfo = Object.assign(ctx.request.body, {
        status: 0, //发布
        createTime: Date.now()
    });

    const f = new FreightOrder(freightOrderInfo)
    await f
        .save()
        .then(res => {
            ctx.body = {
                Status: 1,
                Message: '发布成功'
            };
        })
        .catch(e => {
            ctx.body = {
                Status: 0,
                Message: '发布失败',
                Data: e
            };
        })
});

Api.get('/getOrders', async(ctx) => {
    await FreightOrder
        .find()
        .then(orders => {
            ctx.body = {
                Status: 1,
                Message: '',
                Data: orders || []
            };
        })
        .catch(e => {
            ctx.body = {
                Status: 0,
                Message: '获取失败',
                Data: e
            };
        })
});

const imConfig = {
    AppKey: '07a2803dfb55990e11cabe61b768c8e7',
    AppSecret: 'e938e3bed7d8',
    Nonce: 'test'
}
var SHA1 = new Hashes.SHA1;
const paramStringify = (data) => {
    let url = '';
    for (let k in data) {
        let value = data[k] !== undefined
            ? data[k]
            : '';
        url += `&${k}=${encodeURIComponent(value)}`
    }

    //去掉第一个参数的&符号
    return url
        ? url.substring(1)
        : ''
}
const createHeaders = () => {
    let {AppKey, AppSecret, Nonce} = imConfig,
        CurTime = (Date.now() / 1000).toFixed(0),
        CheckSum = SHA1.hex(AppSecret + Nonce + CurTime);
    return {AppKey, Nonce, CurTime, CheckSum}
}

const user = {
    test: 'e1a798af33cac26c284e4f2344be251e',
    test1: '3e562f60c6ebc35df8fcc352737fc73f',
    "chatroom": {
        "roomid": 17985963,
        "valid": true,
        "announcement": null,
        "muted": false,
        "name": "测试聊天室",
        "broadcasturl": null,
        "ext": "",
        "creator": "test",
        addr: ["weblink04.netease.im:443"]
    }
}
Api.post('/createImUser', async(ctx) => {
    let {username} = ctx.request.body;

    await axios.post('https://api.netease.im/nimserver/user/create.action', paramStringify({accid: username}), {headers: createHeaders()}).then(res => {
        ctx.body = res.data
    })

});
Api.post('/refreshImUserToken', async(ctx) => {
    let {username} = ctx.request.body;
    await axios.post('https://api.netease.im/nimserver/user/refreshToken.action', paramStringify({accid: username}), {headers: createHeaders()}).then(res => {
        ctx.body = res.data
    })

});
Api.post('/createChatroom', async(ctx) => {
    let {username} = ctx.request.body;
    await axios.post('https://api.netease.im/nimserver/chatroom/create.action', paramStringify({creator: 'test', name: '测试聊天室'}), {headers: createHeaders()}).then(res => {
        ctx.body = res.data
    })

});
Api.post('/requestChatroomAddr', async(ctx) => {
    await axios.post('https://api.netease.im/nimserver/chatroom/requestAddr.action ', paramStringify({accid: 'test', roomid: '17985963'}), {headers: createHeaders()}).then(res => {
        ctx.body = res.data
    })

});

//挂载路由
router.use('/api/v1', function (ctx, next) {
    return next();
}).use('/api/v1', Api.routes(), Api.allowedMethods());

module.exports = {
    router
}