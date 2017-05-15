var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//声明一个数据库 对象
var userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    head: String
});
//暴露数据模型
module.exports = mongoose.model('users', userSchema);