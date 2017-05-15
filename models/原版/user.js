var mongodb = require('./db');
//var crypto = require('crypto');//引入加密模块，用于后面加密邮箱，取出对应邮箱的全球公认头像。(此处不再使用，移至路由处)

function User(user) {
    this.name = user.name;
    this.head = user.head;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

//储存用户信息
User.prototype.save = function(callback) {

    //要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        head: this.head     //用户头像
    };
    //打开数据库
    mongodb.open(function(err, db) {
        if(err) {
            return callback(err); //错误，返回err信息
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err); // 错误，返回err信息
            }
            console.log(user);
            //将用户数据插入users集合
            collection.insert(user, {
            safe: true
        },function (err, user) {
            mongodb.close();
            if (err) {
                return callback(err); //错误， 返回err信息
             }
             callback(null, user);//成功！ err为null， 并返回存储后的用户文档
             });
        });
    });
};

//读取用户信息
User.get = function(name, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err); //错误， 返回err 信息
        }
        //读取users集合
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err); //错误，返回err信息
            }
            //查找用户名（name键）值为name 一个文档
            collection.findOne({
                name: name
            }, function(err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回err信息
                }
                callback(null, user);//成功！ 返回查询用户的信息
            });
        });
    });
};