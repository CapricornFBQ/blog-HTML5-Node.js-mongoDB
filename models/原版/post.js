var mongodb = require('./db');
var markdown = require('markdown').markdown;
var ObjectId = require('mongodb').ObjectId;  // 这里及其重要，主要用于后面查_id时，用于解析前面传过来对应文章的id字符串！！！！！
function Post(name, head, title, tag,  post) {
    this.name = name;
    this.head = head;
    this.title = title;
    this.tag = tag;
    this.post = post;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
    var date = new Date();
    //存储各种时间格式， 方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-"+ (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    }
    //要存入数据库的文档
    var post = {
        name: this.name,
        head: this.head,
        time: time,
        title: this.title,
        tag: this.tag,
        post: this.post,
        comments: [],
        pv: 0
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if(err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts', function(err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            //将文档插入posts集合
            collection.insert(post, {
                safe: true
            }, function(err) {
                mongodb.close();
                if(err) {
                    return callback(err); 失败返回err
                }
                callback(null); //返回err 为null
            });
        }) ;
    });
};
 
 //读取文章列表及其相关信息，并以“五个”为单位进行分组,!!!!!初步决定：这里为实现分类查询的功能，需用tag来作为coding life record的检索手段
 Post.getFive = function(tag, currentpage, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (tag) {
                query = {tag};
            //     //！！！这里利用单独搜索文章和搜索所有文章时的不同，
            //     //如果有id，就是单独搜索文章，就需要对pv进行计数，单独计数  //次计数功能移到getOne方法中
            //     collection.update(query, {$inc: {"pv": 1}
            // }, function (err) {
            //     mongodb.close();
            //     if (err) {
            //         return callback(err);
            //     }
            //   });
            }
            //使用count返回特定查询的文档数total
            collection.count(query, function(err, total) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                //根据query对象查询文章, 并跳过前（page-1）*5个结果，返回之后的5个结果
                collection.find(query, {
                    skip: (currentpage - 1) * 5,
                    limit: 5
                }).sort({
                    time: -1
                }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err); //失败返回err
                    }
                    //通过markdown对posts数据库中的单个文档中的post对象内容进行html化
                    //同时用markdown对单个文档中的comments数组中的comment对象进行html化
                    //其他的所有对象都以形式传到前端
                    docs.forEach(function(doc) {
                        if (doc) {
                            doc.post = markdown.toHTML(doc.post);
                            // if (doc.comments) {                        
                            //     doc.comments.forEach (function(comment) {
                            //     console.log(comment.name);
                            //     console.log(comment.time.minute);
                            //     console.log(comment.comment);
                            //     comment.comment = markdown.toHTML(comment.comment); //取消文章列表提取时对评论区的处理方法
                            //     console.log(comment.comment);
                            //     console.log(typeof(doc));
                            //     console.log(typeof(comment));
                            //     });
                            // }
                        }
                    });
                    console.log(docs);
                    console.log(total);
                    callback(null, docs, total); // 成功 以数组的形式返回查询结果  这里的参数必须与路由中对应的回调函数相对应!!!!!!!!!!!!
                });
            })
        });
    });
 };
//定义查询一篇文章的方法,这个只需要两个参数就可以，比上面的方法少一个当前页码的参数
 Post.getOne = function(id, callback) {
     //打开数据库
     mongodb.open(function(err, db) {
         if(err) {
             mongodb.close();
             return callback(err);
         }
         //对去posts集合
         db.collection('posts', function(err, collection) {
             if(err) {
                 mongodb.close();
                 return callback(err);
             }
             //某一篇文章的id肯定存在，所以直接进行赋值就可以, 定义查询条件
             var query = {"_id": ObjectId(id)};
             //对查询到的响应posts的文档的pv属性进行加1处理，用以计数
             collection.update(query, {$inc:{"pv":1}}, function(err) {
                 if(err) {
                    mongodb.close();
                    return callback(err);
                }
                console.log(collection);
                //根据查询条件进行查询，对查询结果数组化处理
                collection.find(query).toArray(function(err, docs) {  //什么时候需要加err情况？ 什么时候不需要加？
                    mongodb.close();
                    if(err) {
                        return callback(err);
                    }
                    //取数组中的第一个对象
                    var doc = docs[0];
                    //对对象中的post部分进行markdown处理
                    doc.post = markdown.toHTML(doc.post);
                    //如果文章下面有评论，那么对评论的文章进行markdown处理
                    if(doc.comments) {
                        doc.comments.forEach(function(comment) {
                            comment.comment = markdown.toHTML(comment.comment);
                        })
                     }
                     //返回err为null，和处理后的doc对象(而非数组)
                     console.log(doc);
                     callback(null, doc);
                 });
             });   
         });
     });
 }
 
 Post.remove = function (id, callback) {
     //打开数据库
     mongodb.open(function (err, db) {
         if(err) {
             return callback(err);
         }
         //读取post集合
         db.collection('posts', function (err, collection) {
             if (err) {
                 mongodb.close();
                 return callback(err);
             }
             //定义查询条件
             var query = {"_id":ObjectId(id)};
             collection.remove(query, {w: 1}, function (err) {
                 mongodb.close();
                 if (err) {
                     return callback(err);
                 }
                 callback(null);
             });
         });
     });
 }