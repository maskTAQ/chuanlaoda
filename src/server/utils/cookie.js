const Hashes = require('jshashes');
var SHA1 = new Hashes.SHA1;
const setCookie = (ctx, phone, password) => {
    ctx
        .cookies
        .set('user_phone', phone, {
            maxAge: 10 * 60 * 1000, // cookie有效时长
            httpOnly: false, // 是否只用于http请求中获取
            overwrite: false // 是否允许重写
        });
    ctx
        .cookies
        .set('login_sign',
        //Hexadecimal hash with HMAC salt key(_id).
        new Hashes.SHA1().hex_hmac('taiaiqiang', `phone=${phone}&password=${password}`), {
            maxAge: 10 * 60 * 1000, // cookie有效时长
            httpOnly: false, // 是否只用于http请求中获取
            overwrite: false // 是否允许重写
        });

}

const getCookie = (ctx, key) => {
    return ctx
        .cookies
        .get(key);
}

module.exports = {
    setCookie,
    getCookie
}