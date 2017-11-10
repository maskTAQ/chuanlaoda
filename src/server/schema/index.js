const {Schema} = require('mongoose');
const userSchema = new Schema({
    userType: Number, //['船主','货主']
    username: String,
    password: String,
    email: String,
    phone: String,
    wxId: String,
    //船号
    shipNumber: String,
    //船载重
    shipTonnage: Number
  });
  

//为模板绑定方法 检查用户是否可以注册
userSchema.methods.canRegister = function () {
    return new Promise((resolve, reject) => {
      const filtCondition = [
        {
          'username': this.username
        }
      ];
      if (this.email) {
        filtCondition.push({'email': this.email});
      }
  
      this
        .model('User')
        .find({$or: filtCondition})
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
    remarks: String
  });

  module.exports = {
    userSchema,
    freightOrderSchema
  }