var mongodb = require('./db');

//对于头像的传入 可以直接查询响应的user然后remove 之后insert
//但是为了练习update，这里采用update方法对原有的user文档进行更改
function Portrait (name, head) {
    this.name = name;
    this.head = head;
}

module.exports = Portrait;

//查找对应用户的头像，进行更改
Portrait.prototype.change = function(callback) {
    var name = this.name;
    var head = this.head;
    // var portrait = {
    //     head: head
    // }
    //打开数据库
    console.log(name);
    console.log(head);
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合，对users进行更改
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                callback(err);
            }
            //此时mongodb还没有关闭，继续读取posts集合对其中的文档和文档中的comments对象进行更改
            db.collection('posts', function (err, collectionofposts) {
                if (err) {
                    mongodb.close();
                    callback(err);
                }
            //根据name查询对应的文档，进行更改
            console.log(collection);
            collection.update({"name": name}, {$set: {"head": head}}, function(err) {
                // mongodb.close();
                if (err) {
                    return callback(err);
                }
                // callback(null);  //返回err为null
                //根据name查询对应的文档，进行更改
                console.log(collectionofposts);                                                                  //这里为打开两个集合，对两个集合进行操作！
                collectionofposts.update({"name": name}, {$set: {"head": head}}, {multi: true}, function(err) {  //此处的multi： true的语法困扰我好几天，这里不可以带引号!!!!!!
                    // mongodb.close();
                    if(err) {
                        return callback(err);
                    }
                    collectionofposts.find().forEach( function(doc) {
                        console.log(doc);
                        //此处若想改变评论区的头像，必须先找到所有的文档，然后用forEach方法对所有的文档进行处理，
                        //一次对所有的文档，对数组中的元素进行查询更改!!!!!思路为： 对应文档 搜索评论区对应的名字，然后对对应名字的head进行赋值!!!!!!
                        collectionofposts.update({_id: doc._id, "comments.name": name},
                                        {$set: {"comments.$.head": head}}, {multi: true});
                        }, function(err) {
                            if(err) {
                                return callback(err);
                                }
                            mongodb.close();
                            callback(null);
                        });
                    });
                });
            });
        });
    });
}




