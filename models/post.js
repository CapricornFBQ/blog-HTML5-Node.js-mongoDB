var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//声明一个数据库 对象
var postsSchema = new Schema({
    name: String,
    head: String,
    time: {
        date:String,
        year:Number,
        month:String,
        day:String,
        minute:String
    },
    title: String,
    tag: String,
    post:String,
    comments:[{
        name:String,
        head:String,
        time:{
            minute:String
        },
        comment:String,
        floor:Number
    }],
    pv: Number
});
//暴露数据模型
module.exports = mongoose.model('posts', postsSchema);