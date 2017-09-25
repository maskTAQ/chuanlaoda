# 介绍mongoose
    $ yarn add koa mongoose
在这之前重温了一下mongoose文档，大体上概念为建一个模板(schema),将模板绑定到模型(modal)上,操作模型。下面的代码展示了如果新建一个用户,用户建好之后就可以插入到数据库中了,当然再次之前要检测此用户是否被注册。
```node
const Koa = require('koa');
const mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost/chuanlaoda');
const db = mongoose.connection
db.on('error', (e) => {
  console.error(`connection error : ${e}`)
});
db.once('open', () => {
  console.log(`connected`)
});


const Schema = mongoose.Schema;
//初始化用户模板 包含三个field
const userSchema = new Schema({name: String, password: String, email: String, wxId: String});
//为模板绑定方法 检查用户是否可以注册
userSchema.methods.canRegister = function () {
  return new Promise((resolve, reject) => {
    this
      .model('User')
      .find({
        name: this.name
      }, (e, users) => {
        if (e) {
          return reject(e);
        }
        if (users.length === 0) {
          return resolve('can register');
        } else {
          return reject('user name already exists')
        }
      });
  })
};
//用用户模板实例化用户模型
const User = mongoose.model('User', userSchema);

//实例化用户
const u = new User({name: 'test'});

//检测用户是否能注册
u
  .canRegister()
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.error(res)
  })
  const app = new Koa();


app.use(async(ctx) => {
  ctx.body ='hello 船老大';
})

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000')
```
# 注册接口
引入路由和bodyparser中间件
```node
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost/chuanlaoda');
const db = mongoose.connection
db.on('error', (e) => {
  console.error(`connection error : ${e}`)
});
db.once('open', () => {
  console.log(`connected`)
});

const Schema = mongoose.Schema;
//初始化用户模板 包含三个field
const userSchema = new Schema({username: String, password: String, email: String, wxId: String});
//为模板绑定方法 检查用户是否可以注册
userSchema.methods.canRegister = function () {
  return new Promise((resolve, reject) => {
    this
      .model('User')
      .find({
        name: this.name
      }, (e, users) => {
        if (e) {
          return reject(e);
        }
        if (users.length === 0) {
          return resolve('can register');
        } else {
          return reject('user name already exists')
        }
      });
  })
};
//用用户模板实例化用户模型
const User = mongoose.model('User', userSchema);

const app = new Koa();

const Api = new Router();
const router = new Router();
Api.post('/register', async(ctx) => {
  const {username, password, email, wxId} = ctx.request.body;

  if (!username || !password || !email) {
    return ctx.body = {
      Status: 0,
      Message: '请完整填写注册信息'
    };
  }
  //实例化用户
  const u = new User(ctx.request.body);

  //检测用户是否能注册
  return u
    .canRegister()
    .then(res => {
      u.save((e, res) => {
        if (e) {
          return ctx.body = {
            Status: 0,
            Message: `注册失败${e}`
          };
        }
        ctx.body = {
          Status: 1,
          Message: '注册成功'
        };
      })
    })
    .catch(e => {
      return ctx.body = {
        Status: 0,
        Message: `注册失败${e}`
      };
    });
})

// 使用ctx.body解析中间件
app.use(bodyParser());
//挂载路由
router.use('/api/v1', Api.routes(), Api.allowedMethods());
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000')
```