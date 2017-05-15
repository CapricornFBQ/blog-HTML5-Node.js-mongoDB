var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//声明一个数据库 对象
var photoSchema = new Schema({
    name: String,
    time: {
        minute:String
    },
    title: String,
    filePath: String,
});
//暴露数据模型
module.exports = mongoose.model('photos', photoSchema);