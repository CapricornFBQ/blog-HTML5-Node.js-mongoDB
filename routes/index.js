var crypto = require('crypto'),
  fs = require('fs'),
  User = require('../models/user.js'),
  Post = require('../models/post.js'),
  Photo = require('../models/photo.js'),
  ObjectId = require('mongodb').ObjectId,  // 这里及其重要，主要用于后面查_id时，用于解析前面传过来对应文章的id字符串！！！！！
  multer = require('multer'); //添加multer模块用以导入图片等文件


//!!!!!!!!!!!!!!!!!!!对于没有Ajax的访问借口都必须有这个判断条件!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// if(req.query.key == 4444) {
// }else {
//   res.render('404');
// }

//定义一个全局变量储存photoTitle
var photoTitle;
//对文件导入模块进行配置===================================================================================================================
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images')  //定义图片的存储位置
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    photoTitle = file.originalname
    console.log(photoTitle);
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
//定义一个带有文件导入参数的变量，以便在路由中调用!!!!!!!!
var upload = multer({storage: storage});
// upload如果在app.js中定义，在index.js中无法调用!!!!!!!!

//定义模块==================================================================================================================================
module.exports = function(app) {
  //默认网址输出============================================================================================================================
  app.get('/', function(req, res) {
    res.render('index', {
      user: req.session.user,
    });
  }); 
  //index网址输出===========================================================================================================================
  app.get('/index', function(req, res) {
    console.log(req);
    res.render('introduction', {
    user: req.session.user,
    });
  });
  //注册页面输出============================================================================================================================
  app.get('/reg', checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('reg', {
      user: req.session.user,
    }); 
  });
  //注册页输入===============================================================================================================================
  app.post('/regInformation', checkNotLogin);
  app.post('/regInformation', function(req, res) {
        //获得全球公认头像,！！！！这个获取头像只能在放在注册路由处：原因有两个1.注册处定义session中的user对象，这样可以防止刚刚注册的用户没有头像 
        //2.这个头像只是在存入数据库时要用到，其他时候再用的话都是在数据库中进行提取。   
        //{以上这两点是以前的思路，但是如果用户换头像，那么就不灵了，会导致用户的头像无法统一更改，
        //所以有两种方案：1.后面的文章和评论的读取，需要实时的查询头像数据 2.每次更改头像后，实时更改user数据库内容和session内容。 经权衡，选择后者}
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'), //将email转化为小写，然后进行加密编码
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48"; //增加head头像链接，以便后面使用
        console.log(req.body);
     var name = req.body.name,
        password = req.body.password;
        //生成密码的md5值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
          name: name,
          head: head,
          password: password,
          email: req.body.email
        });
        //检查用户名是否已经存在
        User.findOne({"name":newUser.name}, function(err, user) {
          if (user) {
            req.flash('error', '用户已经存在！请更换其他用户名');
            return res.send('用户已经存在'); //返回注册页
          } else {
            //如果不存在则新增用户
            User.create(newUser,function (err, user) {
              if (err) {
                throw err;
              }
              req.session.user = newUser; //用户信息存入session
              req.flash('success', '注册成功！');
              res.send(req.body); //注册成功后进入编程页
            });
          }
      });
  });
  //关于name的Ajax验证=======================================================================================================================
  app.get('/name', checkNotLogin);
  app.get('/name', function(req, res) {
    var name = req.query.name;
    console.log(name);
    User.findOne({"name":name}, function(err, user) {
      console.log(user);
      if (user) {
        return res.send("exist"); //如果有该用户名，返回值为："exist"；
      }else {
        return res.send("null"); //如果user为null 则返回null
      }
    });
  })
  //登录页输出===============================================================================================================================
  app.get('/login', checkNotLogin);
  app.get('/login', function(req, res) {
      res.render('login', {
        user: req.session.user,
      });
  });
  //登录页输入================================================================================================================================
  app.post('/loginInformation', checkNotLogin)
  app.post('/loginInformation', function(req, res) {
    //生成密码的md5值
    var md5 = crypto.createHash('md5'),
       password = md5.update(req.body.password).digest('hex');
       //检查用户是否存在
       User.findOne({
         name:req.body.name,
         password:password
        }, function(err, user) {
         if (err) {
           throw err;
         }
         if(user) {
          //用户名密码都匹配后，将用户信息存入session,这个用户信息包含所有的储存在数据库中的user相关的信息
          req.session.user = user;        //包含用户的name、密码、头像、email
          req.flash('success', '登录成功！');
          res.send("success");
         }else {
            req.flash('error', '密码错误！');
            res.send("null"); //对于Ajax的反馈，必须为此
         }
      });
  });
  //用户头像页输出===============================================================================================================================
  app.get('/headPortrait', checkLogin);
  app.get('/headPortrait', function(req, res) {   //进入用户页面，可以更换密码 头像和邮箱
    res.render('headPortrait', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  //用于头像存入数据库================================================================================================================================
  app.post('/headPortraitSubmit', checkLogin);
  app.post('/headPortraitSubmit', upload.single("portrait"), function(req, res) {   //post 新的头像,!!!!!!!!这里的upload.single()里面的参数
    //必须和前端文件中的form的name属性值相同!!!!!也就是说这里的fieldname就是form的name属性值。
    //这里存入的同时，需要把上传的文件的名称和路径存入数据库
    console.log(req.file);
    var file = req.file;
    console.log(file.filename);
    var currentUser = req.session.user;
    var filepath = "/images/" + file.filename;

    User.update({"name":currentUser.name}, {$set:{"head": filepath}}, {multi: true}, function(err, user) {
      console.log(user);
      if (err) {throw err};
      Post.update({"name":currentUser.name}, {$set:{"head": filepath}}, {multi: true}, function(err, post) { 
        console.log(post);
        if (err) {throw err};
        Post.update({"comments.name": currentUser.name}, {$set:{"comments":{"head": filepath}}}, {multi: true}, function(err, comment) {
            console.log(comment);
            if (err) {throw err};
            //把头像的路径引入到session中 !!!!!!!!注意根据err内容：在fs中必须添加public来开始路径!!!!!!!!!!!
            var oldfilepath = `public${req.session.user.head}`;
            //删除原有的头像
            console.log(oldfilepath);
            fs.chmod(oldfilepath, 0777, function(err) {
              if(err) {
                console.log(err + '权限修改失败')
              }
              fs.unlink(oldfilepath, function(err) {
              if(err) {
                console.log(err + '注意：旧头像未删除')
                req.flash('error', '注意：旧头像未删除')
                req.session.user.head = filepath;
                res.send('error')
              }else{
                req.session.user.head = filepath;
                console.log(filepath);
                req.flash('success', '资料更改成功！');
                res.send('success');
              }
            })
          })
        })
      })
    })
  });
  //单篇文章页输出=================================================================================================================================
  app.post('/article', function(req, res) {   //单独查看文章以及添加删除评论
    var id = req.body.articleId;
    console.log(id);
    //这里使用getOne方法，返回的doc为一个对象，不是数组
    Post.findOne({"_id": ObjectId(id)}, function(err, doc) {
      console.log(doc);
      if (err) {throw err;}
      //每访问一次，对pv加“1”；
      Post.update({"_id": ObjectId(id)}, {$inc:{"pv":1}}, function(err, data) {
        if (err) {
          throw err;
        }else {
          console.log(data)
          res.render('article', {
          user: req.session.user,
          doc : doc,
          articleId:id,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
          });
        }
     });
   });
});
  //添加评论=========================================================================================================================================
  app.post('/commentSubmit', checkLogin);
  app.post('/commentSubmit', function(req, res) {  //发表评论
      var id = req.body.articleId;
      console.log(id)
      var currentUser = req.session.user;
      var floor;
      Post.findOne({"_id": ObjectId(id)}, function(err, post) {

        if (err) {throw err};
        if (post.comments.length > 0){
          //取出最高层评论楼层的楼层数
          floor = post.comments.slice(-1)[0].floor + 1;
          console.log(floor);
        } else {
          floor = 1;
        }
        var date = new Date();
        var time = {
            minute: date.getFullYear() + "-"+ (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        }
        console.log(floor)
        var comments = {
              name:currentUser.name, 
              head:currentUser.head, 
              time:time,
              comment:req.body.comment,
              floor:floor
            };
        Post.update({"_id": ObjectId(id)},{$push: {'comments': comments}}, function(err, comments) {
          if(err) {
              req.flash('error' ,err);
          }
            req.flash('success', '留言成功！');
            res.send({"success":"success","articleId":id})
        });
      })
  }); 
  //发表文章页输出=====================================================================================================================================
  app.get('/postArticle', checkLogin);
  app.get('/postArticle', function(req, res) {    //进入发表文章页
    res.render('postArticle', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  //发表文章!!!!!!!!这个为发表文章总的接口，根据用户选择来定义存入的tag标签=================================================================================
  app.post('/articleInformation', checkLogin);     
  app.post('/articleInformation', function(req, res) {   //发表文章
    var currentUser = req.session.user,  //调取session中的用户对象
    tag = req.body.tag,     //在路由加入标签的形式，对存入的文章进行分类
    title = req.body.title, 
    article = req.body.post,
    date = new Date();
    //存储各种时间格式， 方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-"+ (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    }
    post = {
      name:currentUser.name, 
      head:currentUser.head,
      time:time,
      title:title, 
      tag:tag, 
      post:article,
      comments:[],
      pv:0
    }    //1.用户名以及头像需要跟随存入文章，后面提取文章时方便，不需要再次调用user数据库
    Post.create(post, function(err) {
      if(err) {
        req.flash('error' ,err);
        return res.send("error");
      };
      req.flash('success', '发布成功！');
      res.send("success");
    });
  }); 
  //coding页面输出，默认每页5篇文章=======================================================================================================================
  app.get('/coding', function(req, res) {
    //需要先判断是否为第一页，并把请求的页数转化为number类型
    console.log(req.query.p)
    //如果req.query.p未定义，则page=1
    var currentpage = req.query.p ? parseInt(req.query.p) : 1;
    //定义查询条件tag为“coding”
    var tag = "coding";
    var skip = 5 * (currentpage - 1);
    Post.count({"tag":tag}, function(err, total) {
      if (err) {
        posts = [];
      }
      //查询并返回第page页的五篇文章 !!!!!同时只显示coding标签的内容
      Post.find({"tag": tag}).skip(skip).limit(5).sort({"-createtime": -1}).exec(function (err, posts) {
        if (err) {
          posts = [];
        }
        var pagesize = 5;
        // if (!req.session.user) {var name = null} else {var name = req.session.user.name};//一旦user为null，则user.name就会出现bug，所以这里对用户名进行定义
        console.log(total, pagesize, currentpage);
        console.log(posts);
        var time = posts.forEach(function (post) {
          console.log(post.time);  //.minute
        })
        res.render('coding', {
          currentpage: currentpage, //当前页码
          pagesize: pagesize,       //每一页的显示数
          total: total,             //总文档数
          user: req.session.user,
          // displayusername: name, //这里为了在页面显示用户名，所以添加了这个name属性，但是这为后面的检测user是否存在，添加了难度，一旦user为null，就会出现bug，   被注释掉的哲四行，是为了在前台页面显示用户名时用的，
          posts: posts,                                                                                                                                   //最后选在直接让前台来控制，更科学，更简便
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
          });
      });
    });
  });
 //life页面输出===========================================================================================================================================
  app.get('/life', function(req, res) {
    // if (!req.session.user) {var name = null} else {var name = req.session.user.name};//一旦user为null，则user.name就会出现bug，所以这里对用户名进行定义
    //为分页做准备，先判断是否为第一页？ 如果req.query.p未定义，则page默认为1
    var currentpage = req.query.p ? parseInt(req.query.p) : 1;
    //定义查询条件，tag为“life”
    var tag = "life";
    var skip = 5 * (currentpage - 1);
    Post.count({"tag":tag}, function(err, total) {
      if (err) {
        posts = [];
      }
      //查询并返回第page页的五篇文章 !!!!!同时只显示coding标签的内容
      Post.find({"tag": tag}).skip(skip).limit(5).sort({"-createtime": -1}).exec(function (err, posts) {
        if (err) {
          posts = [];
        }
        var pagesize = 5;
        // if (!req.session.user) {var name = null} else {var name = req.session.user.name};//一旦user为null，则user.name就会出现bug，所以这里对用户名进行定义
        console.log(posts, total, pagesize, currentpage);
        res.render('life', {
          currentpage: currentpage, //当前页码
          pagesize: pagesize,       //每一页的显示数
          total: total,             //总文档数
          user: req.session.user,
          // displayusername: name, //这里为了在页面显示用户名，所以添加了这个name属性，但是这为后面的检测user是否存在，添加了难度，一旦user为null，就会出现bug，   被注释掉的哲四行，是为了在前台页面显示用户名时用的，
          posts: posts,                                                                                                                                   //最后选在直接让前台来控制，更科学，更简便
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
          });
        console.log(posts);
      });
    });
  });
  //删除文章及其评论区的路由==================================================================================================================================
  app.post('/removeArticle', checkLogin);
  app.post('/removeArticle', function(req, res) {
    var id = req.body.id;
    //调用post.js的删除方法
    Post.remove({"_id": ObjectId(id)}, function(err) {
      if(err) {
        console.log(err);
      }
      req.flash('success','删除成功!');  //这个用法？？？？？？？？？？？？仔细看看研究一下
      res.send('success');
    });
  });
  //以前这里用的是get方法!!!!!!最近使用的是post方法，因为使用形式的原因，这里是个坑~~~~~ =========================================================================
  app.post('/removeComment', checkLogin);
  app.post('/removeComment', function(req, res) {
    //得到从前端传过来的文章id和评论区的楼层
    var id = req.body.articleId;
    var floor = req.body.commentFloor;
    console.log(id, floor);
    Post.update({"_id": ObjectId(id)},{$pull:{"comments":{"floor":floor}}}, function (err, data) {
      console.log(data);
      if (err) {throw err};
      req.flash('success', '成功删除评论！');
      res.send({"success": "success", "articleId": id});
    })
  })
  //novel页面输出=============================================================================================================================================
  app.get('/novel', function(req, res) {
    res.render('novel', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  //photo页面输出=============================================================================================================================================
  app.get('/photo', function(req, res) {
    //需要先判断是否为第一页，并把请求的页数转化为number类型
    console.log(req.query.p)
    //如果req.query.p未定义，则page=1
    var currentpage = req.query.p ? parseInt(req.query.p) : 1;
    var skip = 6 * (currentpage - 1);
    Photo.count(null, function(err, total) {
      if (err) {
        photos = [];
      }
      //查询并返回第page页的五篇文章 !!!!!同时只显示coding标签的内容
      Photo.find().skip(skip).limit(6).sort({"-createtime": -1}).exec(function (err, photos) {
        if (err) {
          photos = [];
        }
        console.log(total, photos);
        var pagesize = 6;
        res.render('photo', {
          currentpage: currentpage, //当前页码
          pagesize: pagesize,       //每一页的显示数
          total: total,             //总文档数
          user: req.session.user,
          // displayusername: name, //这里为了在页面显示用户名，所以添加了这个name属性，但是这为后面的检测user是否存在，添加了难度，一旦user为null，就会出现bug，   被注释掉的哲四行，是为了在前台页面显示用户名时用的，
          photos: photos,                                                                                                                                   //最后选在直接让前台来控制，更科学，更简便
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
      });
    });
  });
  //photo的pictureBox内的代码Ajax输出============================================================================================================================
  app.get('/photoCode', function(req, res) {
    //需要先判断是否为第一页，并把请求的页数转化为number类型
    console.log(req.query.p)
    //如果req.query.p未定义，则page=1
    var currentpage = req.query.p ? parseInt(req.query.p) : 1;
    var skip = 6 * (currentpage - 1);
    Photo.count(null, function(err, total) {
      if (err) {
        photos = [];
      }
      //查询并返回第page页的五篇文章 !!!!!同时只显示coding标签的内容
      Photo.find().skip(skip).limit(6).sort({"-createtime": -1}).exec(function (err, photos) {
        if (err) {
          photos = [];
        }
        console.log(total, photos);
        var pagesize = 6;
        res.render('photoBoxCode', {
          currentpage: currentpage, //当前页码
          pagesize: pagesize,       //每一页的显示数
          total: total,             //总文档数
          user: req.session.user,
          // displayusername: name, //这里为了在页面显示用户名，所以添加了这个name属性，但是这为后面的检测user是否存在，添加了难度，一旦user为null，就会出现bug，   被注释掉的哲四行，是为了在前台页面显示用户名时用的，
          photos: photos,                                                                                                                                   //最后选在直接让前台来控制，更科学，更简便
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
      });
    });
  });
  //上传图片的页面输出==========================================================================================================================================
  app.get('/postPicture', checkLogin);
  app.get('/postPicture', function(req, res) {   //进入用户页面，可以更换密码 头像和邮箱
    res.render('postPicture', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  //用于图片存入数据库==========================================================================================================================================
  app.post('/postPictureSubmit', checkLogin);
  app.post('/postPictureSubmit', upload.single("postPicture"), function(req, res) {   //post 新的图片,!!!!!!!!这里的upload.single()里面的参数
    //必须和前端文件中的form的name属性值相同!!!!!也就是说这里的fieldname就是form的name属性值。
    //这里存入的同时，需要把上传的文件的名称和路径存入数据库
    console.log(req.file);
    var file = req.file;
    console.log(file.filename);
    var currentUser = req.session.user;
    var filepath = "/images/" + file.filename;
    var currentUser = req.session.user,  //调取session中的用户对象
    date = new Date();
    //存储时间格式， 方便以后扩展
    var time = {
        minute: date.getFullYear() + "-"+ (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    }
    photo = {
      name:currentUser.name, 
      time:time,
      title:photoTitle, 
      filePath:filepath,
    } 
    console.log(photo);
    Photo.create(photo, function(err) {
      if(err) {
        req.flash('error' ,err);
        return res.send("error");
      };
      req.flash('success', '发布成功！');
      res.send("success");
    });
  });
  //record页面输出============================================================================================================================================
  app.get('/record', function(req, res) {
    res.render('record', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  //thanks页面输出============================================================================================================================================
  app.get('/thanks', function(req, res) {
    res.render('thanks', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  //退出页面输出===============================================================================================================================================
  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '成功退出~');
    res.send(req.body);
  });
  // 对用户是否登录做出权限分类，登录的用户不可 打开注册和登录页面 =================================================================================================
  //未登录的用户不可打开发表文章的页面
  // 先检测用户是否登录：
  function checkLogin(req, res, next) {
    if(!req.session.user) {                   
      req.flash('error', '未登录！');
      res.redirect('./');
    }
    next();
  }
  //检测用户是否为未登录，只有未登录的用户可以打开登录页和注册页====================================================================================================
  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '不要闹，您已登录！');
      res.redirect('back'); //返回之前的页面
    }
    next();
  }

};