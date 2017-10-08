# set-cookie不生效
Q:
当我在服务端设置cookie时,浏览器并不能读到cookie或在下次请求时没有携带对应的cookie信息。服务端和网站在不同的域,之前只做了允许所有请求。
A:
当我们在发送跨域请求时，request 的 credentials属性表示是否允许其他域发送cookie，
该属性有3个值：
omit: 默认属性，不允许其他域发送cookie
same-origin: 只允许同域发送cookie
include: 总是允许发送cookie

所以必须在发送post请求时加上 credentials: include。

axios配置
```js
 axios
  .post(path, data,{
      //当我们在发送跨域请求时，request 的 credentials属性表示是否允许其他域发送cookie，
      withCredentials: 'credentials'
  })
```
同时需要在服务端配置域名白名单,不能设置'*'为报错
```js
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
```