$(Document).ready(function() {
    //浏览器刷新事件/////浏览器刷新事件/////浏览器刷新事件/////浏览器刷新事件/////浏览器刷新事件/////浏览器刷新事件/////浏览器刷新事件/////浏览器刷新事件/


    //index//////////////////index//////////////////index//////////////////index//////////////////index//////////////////index//////////////////
    //加载首页========================================================================
    $.get("/index",function(data) {
        $('.nabarNoStyle').removeClass('active');
        $("#index").parents("li").addClass('active');
        $(".bodyPart").hide();
        $(".bodyPart").html(data);
        //根据视窗高度自动使文字高度在视窗居中；
        var height = $(window).height()/3 + "px";
        $('#myCarousel').css("margin-top",height);
        $(".bodyPart").show().children().addClass('animated zoomIn').show();
        var state = {
            url:"/index"
        }
        history.pushState(state,document.title,"/");
        console.log(history.state.url);
    });
    //index===========================================================================
    $("#index").click(function() {
        $('.nabarNoStyle').each(function() {
            $(this).removeClass('active');
        })
        $(this).parents("li").addClass('active');
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/index",function(data) {
                $(".bodyPart").children().remove();
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                //根据视窗高度自动使文字高度在视窗居中；
                var height = $(window).height()/3 + "px";
                $('#myCarousel').css("margin-top",height);
                $(".bodyPart").show().children().addClass('animated zoomIn').show();
                var state = {
                    url:"/index"
                }
                history.pushState(state,document.title,"/");
            });
        });

    })
    //logo=============================================================================
    $("#logo").click(function() {
        $('.nabarNoStyle').each(function() {
            $(this).removeClass('active');
        })
        $("#index").parents("li").addClass('active');
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/index",function(data) {
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                //根据视窗高度自动使文字高度在视窗居中；
                var height = $(window).height()/3 + "px";
                $('#myCarousel').css("margin-top",height);
                $(".bodyPart").show().children().addClass('animated zoomIn').show();
                var state = {
                    url:"/index",
                }
                history.pushState(state,document.title,"/");
            });
        });

    });
    //coding//////////coding//////////coding//////////coding//////////coding//////////coding//////////coding//////////coding//////////coding//////////
    //coding============================================================================
    $('#coding').click(function() {
        $('.nabarNoStyle').each(function() {
            $(this).removeClass('active');
        })
        $(this).parents("li").addClass('active');
        // window.location.pathname = "/coding";
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/coding",function(data) {
                console.log(data);
                $(".bodyPart").children().remove();
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                var state = {
                    url:"/coding",
                }
                history.pushState(state,document.title,"/loveCoding");
            });
        })

    });
    //coding的页码翻页点击事件
    //点击login事件=======================================================================
    //!!!!!注意此处on对新增元素的用法!!!!
    $(Document).on("click","#login",function() {
        // window.location.pathname = "/login";
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/login",function(data) {
                $(".bodyPart").children().remove();
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                //根据视窗高度自动使文字高度在视窗居中；
                var height = $(window).height()/4 + "px";
                $('.login').css("margin-top",height);
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
            });
        })
    });
    //发送login的登录信息==================================================================
    $(Document).on("click", "#loginSubmit", function() {
        $(".bodyPart").children().fadeOut(300, function() {
            var body = {
                "name":     $('#loginInputName').val(),
                "password": $('#loginInputPassword').val()
            }
            $.post("/loginInformation", body, function(data) {
                if(data) {
                    $(".bodyPart").children().remove();
                    console.log(history.state.url)
                    $(".bodyPart").load(history.state.url, function() {
                        $(".bodyPart").children().hide().addClass('animated bounceInDown').show();
                    });
                    
                }
            })
        })

    })
    //点击reg页面==========================================================================
    $(Document).on("click","#reg",function() {
        // window.location.pathname = "/reg";
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/reg",function(data) {
                // history.replaceState(null,document.title,"/reg");
                $(".bodyPart").children().remove();
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                //根据视窗高度自动使文字高度在视窗居中；
                var height = $(window).height()/5 + "px";
                $('.reg').css("margin-top",height);
                //添加animate css3动画库里的类，进行动画设定
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
            });
        })

    });
    //logout=================================================================================
    $(Document).on("click","#logout",function() {
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/logout", function() {
                console.log(history.state.url);
                $(".bodyPart").children().remove();
                $(".bodyPart").load(history.state.url, function() {
                    $(".bodyPart").children().hide().addClass('animated bounceInDown').show();
                });

            });
        })

    });
    //postArticle页面=========================================================================
    $(Document).on("click", '#postArticle', function() {
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/postArticle", function(data) {
                console.log(data);
                $(".bodyPart").children().remove();
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                //根据视窗高度自动使文字高度在视窗居中；
                var height = $(window).height()/5 + "px";
                $('.articlePost').css("margin-top",height);
            });
        })

    });
    //articleInformation=====================================================================
    $(Document).on("click", "#articleSubmit", function() {
        $(".bodyPart").children().fadeOut(300, function() {
            var data = {
                "title": $('#articleTitle').val(),
                "tag":   $('.articleForm input:radio:checked').val(),
                "post":  $('#articlePost').val()
            } 
            //此处的难点在于：一次事件触发两个函数，相当于同时对数据库进行存和读的行为，导致错误
            //同步的情况下，后面的函数控制的元素，无法加载样式
            $.post("/articleInformation", data, function(result) {
                $(".bodyPart").children().remove();
                $(".bodyPart").load(history.state.url, function() {
                    $(".bodyPart").children().hide().fadeIn(500);
                });

            });
        })

    });
    //head portrait 获取头像页面================================================================
    $(Document).on("click", '#headPortrait', function() {
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/headPortrait", function(data) {
                $(".bodyPart").children().remove();
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                var state = {
                    url:"/headPortrait",
                }
                history.pushState(state,document.title,"/myHeadPortrait");
                
            })
        })
    })
    //上传头像文件==============================================================================
    $(Document).on("click", '#headPortraitSubmit', function() {
        $(".bodyPart").children().fadeOut(300, function() {
            //新建一个表单文件对象
            var formData = new FormData();
            //对象中放入二进制文件   // 参数分别是：1.name  2.value  3.filename(可选)  
            formData.append("portrait", $('#headPortraitFile').get(0).files[0])
            console.log(typeof(formData));
            //这里上传的为二进制文件，所以必须用Ajax方法
            $.ajax({ 
                url : "/headPortraitSubmit", 
                type : 'POST', 
                data : formData, 
                // 告诉jQuery不要去处理发送的数据.processData不设为false,jquery就会对请求数据进行序列化,
                //contentType不设为false,默认是："application/x-www-form-urlencoded"
                processData : false, 
                // 告诉jQuery不要去设置Content-Type请求头
                contentType : false, //"multipart/form-data",
                beforeSend:function(){
                    console.log("正在进行，请稍候");
                },
                success : function(data) { 
                    if (data = "success") {
                        $(".bodyPart").children().remove();
                        $(".bodyPart").load(history.state.url, function() {
                            $(".bodyPart").children().hide().addClass('animated bounceInDown').show();
                            $('.headPortrait').css("margin-top",height);
                        });

                    }
                }, 
            });
        })
    })
    //remove Article操作===========================================================================
    for(var i=1; i<=5; i++) {
    (function(k) {       //!!!!此处为闭包的经典案例，使函数内的i不受外部i的影响
    var id = "#removeArticle" + i;
    console.log(id);
        $(Document).on("click", id, function(i) {
            $(".bodyPart").children().fadeOut(300, function() {
            //此处用id,必须使用遍历。因为每个页面只能有一个id，而此处对应的元素有多个!!!!!!!!!!!!!!!!!!!
                console.log(id);
                var article = $(id).attr("postId");
                $.post('/removeArticle', article, function(data) {
                    if(data = "success") {
                        $(".bodyPart").children().remove();
                        $(".bodyPart").load(history.state.url, function() {
                            $(".bodyPart").children().hide().fadeIn(500);
                        });
                    }
                })
            })
 
        })
    })(i);
    }
    //获取coding的选定页面==========================================================================
    for(var i=1; i<=20; i++) {
    (function(k) {       //!!!!此处为闭包的经典案例，使函数内的i不受外部i的影响
    var theClass =  ".codingPage" + i;
    console.log(theClass);
        $(Document).on("click", theClass, function(i) {
            $(".bodyPart").children().fadeOut(300, function() {
                //此处用theClass,必须使用遍历。此处对应的元素有多个!!!!!!!!!!!!!!!!!!!
                console.log(theClass);
                var page = $(theClass).attr("p");
                $.get('/coding', page, function(data) {
                    $(".bodyPart").children().remove();
                    $(".bodyPart").hide();
                    $(".bodyPart").html(data);
                    $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                    var state = {
                        url:"/coding",
                    }
                    history.pushState(state,document.title,"/loveCoding");
                })
            })

        })
    })(i)
    }
    //get Article 页面=============================================================================
    for(var i=1; i<=5; i++) {
    (function(k) {       //!!!!此处为闭包的经典案例，使函数内的i不受外部i的影响
    var id = "#articleTitle" + i;
    console.log(id);
        $(Document).on("click", id, function(i) {
            $(".bodyPart").children().fadeOut(300, function() {
                //此处用id,必须使用遍历。因为每个页面只能有一个id，而此处对应的元素有多个!!!!!!!!!!!!!!!!!!!
                console.log(id);
                var body = {
                    articleId: $(id).attr("postId")
                }
                $.post('/article', body, function(data) {
                    $(".bodyPart").children().remove();
                    $(".bodyPart").hide();
                    $(".bodyPart").html(data);
                    $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                    var state = {
                        url:"/article",
                        articleId: $("#articleId").attr("articleId")
                    }
                    history.pushState(state,document.title,"/Article");
                })
            })

        })
    })(i)
    } 
    /////////Article////////Article////////Article////////Article////////Article////////Article///////
    //postComments功能================================================================================
    $(Document).on("click", '#commentSubmit', function() {
        $(".bodyPart").children().fadeOut(300, function() {
            var data = {
                "articleId":$('#commentContent').attr('articleId'),
                "comment": $('#commentContent').val(),
            } 
            //此处的难点在于：一次事件触发两个函数，相当于同时对数据库进行存和读的行为，导致错误
            //同步的情况下，后面的函数控制的元素，无法加载样式
            $.post("/commentSubmit", data, function(result) {
                console.log(result.success, result.articleId);
                if (result.success = "success") {
                    $(".bodyPart").children().remove();
                    $(".bodyPart").load(history.state.url, {"articleId" : result.articleId}, function() {
                        $(".bodyPart").children().hide().fadeIn(500);
                    });
                    
                }
            });
        })

    });
    //removeComments===================================================================================
    for(var i=1; i<=50; i++) {
    (function(k) {       //!!!!此处为闭包的经典案例，使函数内的i不受外部i的影响
    var id =  "#removeComment" + i;
    console.log(id);
        $(Document).on("click", id, function(i) {
            $(".bodyPart").children().fadeOut(300, function() {
                //此处用id,必须使用遍历。此处对应的元素有多个!!!!!!!!!!!!!!!!!!!
                console.log(id);
                var data = {
                    articleId : $(id).attr("articleId"),
                    commentFloor : $(id).attr("commentFloor")
                }
                console.log(data);
                $.post('/removeComment', data, function(data) {
                    if(data.success = "success") {
                        $(".bodyPart").children().remove();
                        $(".bodyPart").load(history.state.url, {"articleId": data.articleId}, function() {
                            $(".bodyPart").children().hide().fadeIn(500);
                        });
                        
                    }
                })
            })

        })
    })(i)
    }
    //life////////life////////life////////life////////life////////life////////life////////life////////life////////life////////life////////
    //life===================================================================================
    $('#life').click(function() {
        $('.nabarNoStyle').each(function() {
            $(this).removeClass('active');
        });
        $(this).parents("li").addClass('active');
        // window.location.pathname = "/life";
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/life",function(data) {
                console.log(data);
                $(".bodyPart").children().remove();
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                var state = {
                    url:"/life",
                }
                history.pushState(state,document.title,"/beYourself");
            });
        })

    });
    //获取life的选定页面==========================================================================
    for(var i=1; i<=20; i++) {
    (function(k) {       //!!!!此处为闭包的经典案例，使函数内的i不受外部i的影响
    var theClass =  ".lifePage" + i;
    console.log(theClass);
        $(Document).on("click", theClass, function(i) {
            $(".bodyPart").children().fadeOut(300, function() {
                //此处用theClass,必须使用遍历。此处对应的元素有多个!!!!!!!!!!!!!!!!!!!
                console.log(theClass);
                var page = $(theClass).attr("p");
                $.get('/life', page, function(data) {
                    $(".bodyPart").children().remove();
                    $(".bodyPart").hide();
                    $(".bodyPart").html(data);
                    $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                    var state = {
                        url:"/life",
                    }
                    history.pushState(state,document.title,"/beYourself");
                })
            })
        })
    })(i)
    }
    //novel/////////novel/////////novel/////////novel/////////novel/////////novel/////////novel/////////novel/////////novel/////////novel//
    //novel==================================================================================
    $('#novel').click(function() {
        $('.nabarNoStyle').each(function() {
            $(this).removeClass('active');
        })
        $(this).parents("li").addClass('active');
        $(".bodyPart").children().fadeOut(300, function() {
            $(".bodyPart").children().remove();
            $(".bodyPart").html('<img class="center-block" style="margin-top:100px;" src="/images/ajax-loader.gif">')
            $.get("/novel",function(data) {
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                //根据视窗高度自动判断目录是否需要折行
                var dropdown = $('.dropdown-menu').height();
                if (dropdown > $(window).height()) {
                    $('.dropdown-menu').css({'height':'200%','overflow-y':'scroll'});
                }
                var state = {
                    url:"/novel",
                }
                history.pushState(state,document.title,"/beautifulNovel");
            });
        })
    });
    //novel目录点击翻页事件=====================================================================
    for(var i=1; i<=30; i++) {
    (function(k) {       //!!!!此处为闭包的经典案例，使函数内的i不受外部i的影响
    var id =  "#chapter" + i;
    console.log(id);
        $(Document).on("click", id, function(i) {
            //此处用id,必须使用遍历。此处对应的元素有多个!!!!!!!!!!!!!!!!!!!
            console.log(id);
            //得到对应id的属性值
            var name = $(id).attr("name");
            console.log(name);
            //此处属性名不可以加引号！！！！后面传入变量必须使用拼接字符串的形式
            $("body").animate({scrollTop:$("#story p a[name=" + name + "]").offset().top - 100},500);
            console.log($("a[name="+name+"]").offset())
        })
    })(i)
    }
    //photo///////////photo///////////photo///////////photo///////////photo///////////photo//////
    //photo页面获取显示功能=======================================================================
    $('#photo').click(function() {
        $('.nabarNoStyle').each(function() {
            $(this).removeClass('active');
        })
        $(this).parents("li").addClass('active');
        $(".bodyPart").children().fadeOut(300, function() {
            $(".bodyPart").children().remove();
            $(".bodyPart").html('<img class="center-block" style="margin-top:100px;" src="/images/ajax-loader.gif">')
            $.get("/photo",function(data) {
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                var state = {
                    url:"/photo",
                }
                history.pushState(state,document.title,"/photoAlbum");
            });
        })
    });
    //获取photo的选定页面==========================================================================
    for(var i=1; i<=20; i++) {
    (function(k) {       //!!!!此处为闭包的经典案例，使函数内的i不受外部i的影响
    var theClass =  ".photoPage" + i;
    console.log(theClass);
        $(Document).on("click", theClass, function(i) {
            $(".bodyPart").children().fadeOut(300, function() {
                //此处用theClass,必须使用遍历。此处对应的元素有多个!!!!!!!!!!!!!!!!!!!
                console.log(theClass);
                var page = $(theClass).attr("p");
                $.get('/photo', page, function(data) {
                    $(".bodyPart").children().remove();
                    $(".bodyPart").hide();
                    $(".bodyPart").html(data);
                    $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                    var state = {
                        url:"/photo",
                    }
                    history.pushState(state,document.title,"/photoAlbum");
                })
            })
        })
    })(i)
    }
    //获取上传图片的页面================================================================
    $(Document).on("click", '#postPicture', function() {
        $(".bodyPart").children().fadeOut(300, function() {
            $.get("/postPicture", function(data) {
                $(".bodyPart").children().remove();
                $(".bodyPart").hide();
                $(".bodyPart").html(data);
                $(".bodyPart").show().children().addClass('animated bounceInDown').show();
                var state = {
                    url:"/postPicture",
                }
                history.pushState(state,document.title,"/uploadPicture");
                
            })
        })
    })
    //上传图片文件==============================================================================
    $(Document).on("click", '#postPictureSubmit', function() {
        $(".bodyPart").children().fadeOut(300, function() {
            //新建一个表单文件对象
            var formData = new FormData();
            //对象中放入二进制文件   // 参数分别是：1.name  2.value  3.filename(可选)  
            formData.append("postPicture", $('#postPictureFile').get(0).files[0])
            console.log(typeof(formData));
            //这里上传的为二进制文件，所以必须用Ajax方法
            $.ajax({ 
                url : "/postPictureSubmit", 
                type : 'POST', 
                data : formData, 
                // 告诉jQuery不要去处理发送的数据.processData不设为false,jquery就会对请求数据进行序列化,
                //contentType不设为false,默认是："application/x-www-form-urlencoded"
                processData : false, 
                // 告诉jQuery不要去设置Content-Type请求头
                contentType : false, //"multipart/form-data",
                beforeSend:function(){
                    console.log("正在进行，请稍候");
                },
                success : function(data) { 
                    if (data = "success") {
                        $(".bodyPart").children().fadeOut(300, function() {
                            $(".bodyPart").children().remove();
                            $(".bodyPart").load(history.state.url, function() {
                                $(".bodyPart").children().hide().addClass('animated bounceInDown').show();
                                $('.headPortrait').css("margin-top","15px");
                            });
                        })
                    }
                }, 
            });
        })
    })

















    //onpopstate事件绑定========================================================================
    //通过pushState来储存有关的数据，包括pathname作为URL，后面浏览器前进后退时，直接用URL进行重新加载
    $(window).on('popstate', function() {
        $(".bodyPart").children().fadeOut(300, function() {
            $(".bodyPart").children().remove();
            if (history.state.url == "/article") {
                //因为Article页面调用时必须有文章id，所以此处必须使用load的post方法，带有key-value的键值对。而此处调用保存的值，必须使用当时保存的对象history.state。此处是一个小坑
                $(".bodyPart").hide();
                $(".bodyPart").load(history.state.url,{"articleId":history.state.articleId},function() {
                    $(".bodyPart").show().children().addClass('animated zoomIn').show();
                });
            }
            $(".bodyPart").load(history.state.url,function() {
                $(".bodyPart").hide();
                $(".bodyPart").show().children().addClass('animated zoomIn').show();
                //添加一层判断，是为了优化代码，选择性执行
                if (history.state.url == "/index") {
                    //如果不加后处理函数，这里无法加载样式，所以只能这样做!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    var height = $(window).height()/3 + "px";
                    $('#myCarousel').css("margin-top",height);
                }
            });
        })
        //导航栏动画和bodyPart一块进行
        $('.header').removeClass("animated bounceInDown").fadeOut(300, function() {
            //关于导航栏是否显示，除了图片页面picturebox显示时，其他的时候都必须显示
            $('.header').addClass("animated bounceInDown").show();
        });
    });
});












