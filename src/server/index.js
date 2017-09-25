const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

//连接数据库
const db = mongoose.createConnection('mongodb://localhost/chuanlaoda');
db.on('error', (e) => {
  console.error(`connection error : ${e}`)
});
db.once('open', () => {
  console.log(`connected`)
});

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
//初始化用户模板 包含三个field
const userSchema = new Schema({ username: String, password: String, email: String, wxId: String });

const freightOrderSchema = new Schema({
  username: String,
  //['找货','找船']
  type: Number,
  //['dealing','dealed','cancel']
  status: Number,
  //订单创建时间
  createTime: {
    type: Date,
    default: Date.now
  },
  //出发地
  origin: String,
  //终点
  destination: String,
  //订单结算时间
  dealedTime: String,
  //货物类型
  cargoType: String,
  //货物重量/货船吨位
  cargoTonnage: String,
  //装货日期
  shipmentTime: Date,
  //备注
  remarks: String,
});

//为模板绑定方法 检查用户是否可以注册
userSchema.methods.canRegister = function () {
  return new Promise((resolve, reject) => {
    this
      .model('User')
      .find({
        $or: [
          {
            'email': this.email
          }, {
            'username': this.username
          }
        ]
      })
      .exec((e, users) => {
        if (e) {
          return reject(e);
        }
        if (users.length === 0) {
          return resolve('can register');
        } else {
          return reject('username or email already exists')
        }
      });
  })
};
//用户模板实例化用户模型
const User = db.model('User', userSchema);

const FreightOrder = db.model('FreightOrder', freightOrderSchema);
const app = new Koa();

const Api = new Router();
const router = new Router();

Api.post('/register', async (ctx) => {
  const { username, password, email, wxId } = ctx.request.body;

  if (!username || !password || !email) {
    ctx.body = {
      Status: 0,
      Message: '请完整填写注册信息',
      data: ctx.request.body
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
      ctx.body = {
        Status: 1,
        Message: '注册成功'
      };
    })
    .catch(e => {
      ctx.body = {
        Status: 0,
        Message: '注册失败',
        data: e
      };
    })
});

Api.post('/login', async (ctx) => {
  const { username, password, email, wxId } = ctx.request.body;
  if (!username || !password || !email) {
    ctx.body = {
      Status: 0,
      Message: '请完整填写登录信息',
      data: ctx.request.body
    };
    return
  }

  await User
    .findOne({ username: String(username) })
    .then((res) => {
      if (!res) {
        return ctx.body = {
          Status: 0,
          Message: '用户名不存在'
        };
      }
      if (res.password != password) {
        return ctx.body = {
          Status: 0,
          Message: '用户名或密码错误'
        };
      }
      return ctx.body = {
        Status: 1,
        Message: '登录成功'
      };

    })
    .catch(e => {
      ctx.body = {
        Status: 0,
        Message: '登录失败',
        data: e
      };
    })

});

Api.post('/pubulishCargo', async (ctx) => {
  const { username, origin, destination, cargoType, cargoTonnage, shipmentTime, remarks } = ctx.request.body;

  if (!username || !origin || !destination || !cargoType || !cargoTonnage || !shipmentTime) {
    ctx.body = {
      Status: 0,
      Message: '请完整填写货物信息',
      data: ctx.request.body
    };
    return
  }

  const freightOrderInfo = Object.assign(ctx.request.body, {
    type: 1,//找船
    status: 0,//发布
    createTime: Date.now(),
  });

  const f = new FreightOrder(freightOrderInfo)
  await f.save()
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
        data: e
      };
    })
});

// 使用ctx.body解析中间件
app.use(bodyParser());
//挂载路由
router.use('/api/v1', Api.routes(), Api.allowedMethods());
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080);
console.log('[demo] start-quick is starting at port 3000')