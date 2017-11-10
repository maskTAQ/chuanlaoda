const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const {router} = require('./api');

const app = new Koa();

// 使用ctx.body解析中间件
app.use(bodyParser());
//允许跨域
app.use(cors({
  origin: function (ctx) {
    return 'http://localhost:3000'; // 这样就能只允许 http://localhost:3000 这个域名的请求了
  },
  exposeHeaders: [
    'WWW-Authenticate', 'Server-Authorization'
  ],
  maxAge: 5,
  credentials: true,
  allowMethods: [
    'GET', 'POST', 'DELETE'
  ],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080);
console.log('[demo] start-quick is starting at port 8080')