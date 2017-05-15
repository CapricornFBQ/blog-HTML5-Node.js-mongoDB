var mongodb = require('./db');
var ObjectId = require('mongodb').ObjectId;  // 这里及其重要，主要用于后面查_id时，用于解析前面传过来对应文章的id字符串！！！！！
function Comment(name, head, comment) {
    this.name = name;
    this.head = head;
    this.comment = comment;
}

module.exports = Comment;


//根据 id找到相关文章，然后对应文档的文章后面插入评论,这里用的同样是存放文章的posts集合
 Comment.prototype.add = function(id, callback) {
    //存储时间
    var date = new Date();
    var time = {
        minute: date.getFullYear() + "-"+ (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    }
    //为了防止this的污染必须在此处进行赋值！！！！！
    //要存入数据库的文档
    var comments = {
        name: this.name,
        head: this.head,
        time: time,
        comment: this.comment,
    };
    //打开数据库
    mongodb.open(function (err, db) {
    if (err) {
        return callback(err);
    }
    //读取posts集合
    db.collection('posts', function (err, collection) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //根据条件查找对应的对象
        collection.find({"_id":ObjectId(id)}).toArray(function (err, docs) {
            // mongodb.close();
            if (err) {
                return callback(err); //失败返回err
        }
        // 成功 以数组的形式返回查询结果,!!!!!!!!!此处实验多次，
        //其他形式不知返回的是什么东西，只能以数组形式返回，同时取数组中的第一对象即可，
        //!!!!!!!!由于异步的原因这里只能把所有的逻辑嵌套入这个函数中！！目前对我来说来说别无他法
        if (docs[0].comments.length > 0) { //这里不论数组内有没有对象，都会转化为true，数组本身就是对象，所以需要用length属性来做判断条件
                console.log(docs);
                //本来想用数组的length属性，但是考虑到有可能删除数组元素，
                //导致数值不准，所以改用倒序取首值的方法。
                var floor = docs[0].comments.slice(-1)[0].floor + 1;
                console.log(floor);
        } else {
                var floor = 1;
        }
            
        //要存入数据库的文档
        comments.floor = floor
        console.log(this);
        console.log(comments);
        //根据_id为查询条件更改文章!!!!!!!!数据库还没有关闭，继刚才的查询后  可以继续进行更改功能
        collection.update({"_id":ObjectId(id)}, {
            //comments为数组形式，可以直接用push来添加项
            $push: {'comments': comments}
        } , function (err) {
            mongodb.close() ;
            if (err) {
                return callback(err);
            }
            callback(null); // err返回null
            });
            });
        });
    });
};

Comment.remove = function (id, floor, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts', function(err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            //定义查询条件
            var query = {"_id": ObjectId(id)};
            // //查询对应id的文章
            // collection.find(query).toArray(function(err, docs) { //所有的回调函数第一个参数都必须是err
            //     if(err) {
            //         return callback(err);
            //     }
            //     mongodb.close();
            //     console.log(docs);
            //     var doc = docs[0];
            //     //待删除项在数组中的数值为floor减1
            //     var removeFloor = floor - 1;
            //     //用数组的splice方法，操作带删除项                     !!!!!!此处必须用mongodb的命令来操作数据库，而splice不属于mongodb的命令!!!!!!这里又是一个坑
            //     doc.comments.splice(removeFloor, 1); //直接删除，因为参数等原因，这里就不再考虑err情况了
            //     console.log(doc);
            //     callback(null);
            // });
            console.log(query, floor);//这里floor为字符串形式，但是数据库中为number类型  囧
            floor =  parseInt(floor); //这里又是一个坑   此处不可以用"var"
            console.log(floor);
            //对数组中的对应楼层进行更改
            collection.update(query, {$pull: {"comments": {"floor": floor}}});
            mongodb.close();
            callback(null);
        });
    });
}

 
