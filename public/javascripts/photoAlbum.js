$(Document).ready(function(){
    //定义加载后的初始值及变量；
    var pageNumber ;
    if($('.pictureBox').attr("currentPageNumber") >= 6) {
        pageNumber = 6
    }else {
        pageNumber = $('.pictureBox').attr("currentPageNumber")
    }
    var currentpage = $('.pictureBox').attr("currentpage");
    var total = $('.pictureBox').attr("total");
    if (currentpage == 1) {
        $(".lastPhotoPage").hide();
    }else {
        $(".lastPhotoPage").show();
    }
    if (currentpage == Math.ceil(total/6) || Math.ceil(total/6) == 1) {
        $(".nextPhotoPage").hide();
    }
    //!!!!!!!!!!!!!!!!!!!!!!!!此处顶一个全局变量，用于存储acive的缩略图的id!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    var activeId;
    var number;
    var lantern;
    
    var screenHeight = $(window).height();
    var screenWidth = $(window).width();
    console.log(screenHeight,screenWidth);
    //定义缩略图容器的高度
    $(".photoThumbnailBox").each(function() {
        $(this).css({"height":screenHeight/3});
    });
    //定义大图和小缩略图容器的高度。
    $('.pictureBox').css({"height":screenHeight, "width":screenWidth});
    //定义大图容器的宽度和高度
    $('.pictureViewer').css({"height":screenHeight*3/4});
    //定义theFooter容器的高度
    $('.theFooter').css({"height":screenHeight/5});
    //获取图片的宽度和高度，并设定最大值为100%
    var picturHeight = $('#thePicture')[0].height;
    var pictureWidth = $('#thePicture')[0].width;
    //获取高宽比，后面所有的图片高度或者宽度都必须严格计算而来
    var specificValue = picturHeight/pictureWidth;
    $('.thePicture').css({"height":screenHeight*3/4, "width":"auto"});
    //高大于宽或者图片的高宽比大于容器的高宽比时，则高为100%显示，否则宽为100%显示
    if (picturHeight > pictureWidth || picturHeight/pictureWidth > screenHeight*3/(4*screenWidth)) {
        var differenceWidthValue = (screenWidth - screenHeight*3/(4*specificValue))/2;
        $("#thePicture").css({"height":screenHeight*3/4, "width":"auto", "position": "absolute", "top": 0, "left":differenceWidthValue});
    } else {
        var differenceHeightValue = (screenHeight*3/4 - screenWidth*specificValue)/2;
        $("#thePicture").css({"width":screenWidth, "height":"auto", "position": "absolute", "top": differenceHeightValue, "left": 0});
    }
    $('.theSingleLittlePhotoThumbnailBox').css({"height":screenHeight/7});
    $('.theSingleLittlePhotoThumbnail').addClass("img-rounded");
    $('.AdjacentPage').css({"height":screenHeight/7});
    $('.AdjacentPage').css({"paddingTop":screenHeight/18});
    //小素略图的显示功能=================================================================================
    for (var i=1; i<=pageNumber; i++) {
    (function(k) {
            var idName = "#image" + i;
            $(idName).each(function() {
                var boxHeight = screenHeight/7;
                var boxWidth = screenWidth/12;
                var picturHeight = $('#thePicture')[0].height;
                var pictureWidth = $('#thePicture')[0].width;
                var specificValue = picturHeight/pictureWidth;
                console.log(boxHeight, boxWidth);
                if (picturHeight/pictureWidth > boxHeight/boxWidth) {
                    var differenceWidthValue = (boxWidth - boxHeight/specificValue)/2;
                    $(idName).css({"height":"100%", "width":"auto","position": "absolute","top":0, "left":differenceWidthValue});
                } else {
                    var differenceHeightValue = (boxHeight - boxWidth*specificValue)/2;
                    $(idName).css({"width":"100%", "height":"auto","position": "absolute","top":differenceHeightValue, "left":0});
                }
            })
        })(i);
    }

    //封装幻灯片样式=======================================================================================
    function Latren () {
        $('.pictureViewer').css({"height":screenHeight});
        $('.thePicture').css({"height":screenHeight});
        var pictureInformation = ".information" + number;
        $('#thePicture').each(function() {
            var picturHeight = $('#thePicture')[0].height;
            var pictureWidth = $('#thePicture')[0].width;
            var specificValue = picturHeight/pictureWidth;
            if (picturHeight/pictureWidth > screenHeight/screenWidth) {
                var differenceWidthValue = (screenWidth - screenHeight/specificValue)/2;
                $("#thePicture").css({"height":screenHeight, "width":"auto","top":0, "left":differenceWidthValue});
            } else {
                var differenceHeightValue = (screenHeight - screenWidth*specificValue)/2;
                $("#thePicture").css({"width":screenWidth, "height":"auto","top":differenceHeightValue, "left":0});
            }
        })
        $(pictureInformation).fadeOut(1);
        $(".theFooter").fadeOut(500);
    }
    //图片动画显示封装========================================================================================
    function Flash() {
        $("#thePicture").removeClass('animated zoomIn');
        $("#thePicture").addClass('animated zoomIn').show();
    }
    //封装一个函数，对图片显示进行自适应((((正常样式))))!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=====
    function PictureResponsive() {
        $('.pictureViewer').css({"height":screenHeight*3/4});
        $('.thePicture').css({"height":screenHeight*3/4, "width":"auto"});
        $("#thePicture").each(function() {
            var picturHeight = $('#thePicture')[0].height;
            var pictureWidth = $('#thePicture')[0].width;
            //获取高宽比，后面所有的图片高度或者宽度都必须严格计算而来
            var specificValue = picturHeight/pictureWidth;
            console.log(picturHeight, pictureWidth)
            //高大于宽或者图片的高宽比大于容器的高宽比时，则高为100%显示，否则宽为100%显示
            if (picturHeight/pictureWidth > screenHeight*3/(4*screenWidth)) {
                var differenceWidthValue = (screenWidth - screenHeight*3/(4*specificValue))/2;
                $("#thePicture").css({"height":screenHeight*3/4, "width":"auto", "position": "absolute", "top": 0, "left":differenceWidthValue});
            } else {
                var differenceHeightValue = (screenHeight*3/4 - screenWidth*specificValue)/2;
                $("#thePicture").css({"width":screenWidth, "height":"auto", "position": "absolute", "top": differenceHeightValue, "left": 0});
            }
            $("#thePicture").css({
                "-webkit-transform":"scale(1) rotate(0deg)",
                "-moz-transform":"scale(1) rotate(0deg)",
                "-o-transform":"scale(1) rotate(0deg)",
            });
        })
        var pictureInformation = ".information" + number;
        $(".informationDisplayNone").css({"display":"none"});
        $(pictureInformation).fadeIn(300);
        $(".theFooter").fadeIn(500);
    }
    //用于显示对应图片的信息====================但是放着这没用的，因为并不会跟随number自动赋值
    // var pictureInformation = ".information" + number;
    //绑定点击主页缩略图的点击事件=============================================================================
    for(var i=1; i <= pageNumber; i++) {
        //用立即执行函数进行封装，防止i一直为6
        (function(k) {
            var className = ".image" + i;
            var idName = "#image" + i;
            console.log(className);
            $(Document).on("click", className, function() {
                if($('.pictureBox').attr("currentPageNumber") >= 6) {
                    pageNumber = 6;
                }else {
                    pageNumber = $('.pictureBox').attr("currentPageNumber")
                }
                //这个样式只能放在显示图片功能的后面，为了下一次打开时，不会出现两个信息的情况。
                $(".informationDisplayNone").css({"display":"none"});
                $("#thePicture").hide();
                //一旦点击缩略图进入详图，则导航栏隐藏!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                $('.header').fadeOut(700);
                var pictureSrc = $(className).attr("src");
                $("#thePicture").attr("src",pictureSrc);
                $(".pictureBox").fadeIn(100, function() {
                    //offset是为了火狐浏览器的兼容性而不得不采取的措施!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注：offset只对可见元素有效!!!!!!这是个坑
                    $('.pictureBox').offset({ top: 0, left: 0 });
                    $(".theFooter").addClass("animated bounceInUp").show();
                    Flash();
                    $(idName).addClass("pictureThumbnailActive");
                    $(idName).addClass("img-thumbnail");
                    activeId = idName;
                    //用正则把遇到的非数字字符替换为空格，然后转化为数字!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    number = parseInt(idName.replace(/[^0-9]/ig,""));
                    //这个功能是后续控制的入口，这个显示函数必须放在number获得之后!!!!!!!!!!!!!!!!!!!!!
                    PictureResponsive();
                    console.log(number);
                });
            })
        })(i)
    }
    //关闭按钮功能===========================================================================================
    $(Document).on("click", ".closeIcon", function() {
        $(".pictureBox").fadeOut(500);
        $("#thePicture").removeClass('animated zoomIn');
        $(activeId).removeClass("pictureThumbnailActive");
        $(activeId).removeClass("img-thumbnail");
        $('.header').fadeIn(700);
        //关闭幻灯片切换功能!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=============
        clearInterval(lantern);
        PictureResponsive();
    })
    //绑定点击点击小缩略图功能=================================================================================
    for(var i=1; i<=pageNumber; i++) {
        //用立即执行函数进行封装，防止i一直为6
        (function(k) {
            var idName = "#image" + i;
            console.log(idName);
            $(Document).on("click", idName, function() {
                var pictureSrc = $(idName).attr("src");
                $("#thePicture").fadeOut(1, function() {
                    $("#thePicture").attr("src", pictureSrc);
                    $(activeId).removeClass("pictureThumbnailActive");
                    $(activeId).removeClass("img-thumbnail")
                    $(idName).addClass("pictureThumbnailActive");
                    $(idName).addClass("img-thumbnail");
                    activeId = idName;
                    number = parseInt(idName.replace(/[^0-9]/ig,""));
                    PictureResponsive();
                    Flash();
                });
            })
        })(i)
    }
    //图片放大功能============================================================================================
    $(Document).on("click", ".blowUp", function() {
        var idName = activeId;
        var pictureSrc = $(idName).attr("src");
        $("#thePicture").fadeOut(1, function() {
            $("#thePicture").attr("src",pictureSrc);
            PictureResponsive();
            $("#thePicture").css({
                "-webkit-transform":"scale(1.5)",
                "-moz-transform":"scale(1.5)",
                "-o-transform":"scale(1.5)",
            });
            Flash();
        })
    })
    //图片缩小功能============================================================================================
    $(Document).on("click", ".shrink", function() {
        var idName = activeId;
        var pictureSrc = $(idName).attr("src");
        $("#thePicture").fadeOut(1, function() {
            $("#thePicture").attr("src",pictureSrc);
            PictureResponsive();
            $("#thePicture").css({
                "-webkit-transform":"scale(0.5)",
                "-moz-transform":"scale(0.5)",
                "-o-transform":"scale(0.5)",
            });
            Flash();
        });
    })
    //上一页图片功能==========================================================================================
    $(Document).on("click", ".lastPage", function() {
        if (number > 1) {
            var idName = "#image" + (number - 1) ;
            console.log(idName);
            var pictureSrc = $(idName).attr("src");
            $("#thePicture").fadeOut(1, function() {
                $("#thePicture").attr("src",pictureSrc);
                $(activeId).removeClass("pictureThumbnailActive");
                $(activeId).removeClass("img-thumbnail")
                $(idName).addClass("pictureThumbnailActive");
                $(idName).addClass("img-thumbnail");
                activeId = idName;
                number--;
                PictureResponsive();
                Flash();
            });
        } else (
            alert ("已经是本页第一张~~~")
        )
    })
    //幻灯片功能==============================================================================================
    $(Document).on("click", ".lantern", function() {
        PictureResponsive();
        lantern = setInterval(function() {
            var idName = "#image" + number;
            console.log(idName);
            var pictureSrc = $(idName).attr("src");
            $("#thePicture").fadeOut(1, function() {
                $("#thePicture").attr("src",pictureSrc);
                Latren ();
                Flash();
                $(activeId).removeClass("pictureThumbnailActive");
                $(activeId).removeClass("img-thumbnail")
                $(idName).addClass("pictureThumbnailActive");
                $(idName).addClass("img-thumbnail");
                activeId = idName;
                number++;
                if (number > pageNumber || number>6) {
                    clearInterval(lantern);
                    PictureResponsive();
                    Flash();
                }
            });
        },1600);
    })
    //下一页图片功能==========================================================================================
    $(Document).on("click", ".nextPage", function() {
        if (number < pageNumber) {
            var idName = "#image" + (number + 1) ;
            console.log(idName);
            var pictureSrc = $(idName).attr("src");
            $("#thePicture").fadeOut(1, function() {
                $("#thePicture").attr("src",pictureSrc);
                $(activeId).removeClass("pictureThumbnailActive");
                $(activeId).removeClass("img-thumbnail")
                $(idName).addClass("pictureThumbnailActive");
                $(idName).addClass("img-thumbnail");
                activeId = idName;
                number++;
                PictureResponsive();
                Flash();
            });
        } else (
            alert ("已经是本页最后一张~~~")
        )
    })
    //原图显示功能============================================================================================
    $(Document).on("click", ".artwork", function() {
        var idName = activeId;
        var pictureSrc = $(idName).attr("src");
        $("#thePicture").fadeOut(1, function() {
            $("#thePicture").attr("src",pictureSrc);
            $("#thePicture").each(function() {
                var picturHeight = $('#thePicture')[0].height;
                var pictureWidth = $('#thePicture')[0].width;
                //高大于宽或者图片的高宽比大于容器的高宽比时，则高为100%显示，否则宽为100%显示
                if (picturHeight > pictureWidth) {
                    var differenceWidthValue = (screenWidth - pictureWidth)/2;
                    $("#thePicture").css({"height":"auto", "width":"auto","top": 0, "left":differenceWidthValue});
                } else {
                    var differenceHeightValue = (screenHeight - picturHeight)/2;
                    $("#thePicture").css({"width":"auto", "height":"auto", "top": differenceHeightValue, "left": 0});
                }
                $("#thePicture").css({
                    "-webkit-transform":"scale(1) rotate(0deg)",
                    "-moz-transform":"scale(1) rotate(0deg)",
                    "-o-transform":"scale(1) rotate(0deg)",
                });
            })
            $(".information").fadeIn(500);
            $(".theFooter").fadeIn(500);
            Flash();
        });
    })
    //向右旋转90°功能=========================================================================================
    $(Document).on("click", ".rotate", function() {
        var idName = activeId;
        var pictureSrc = $(idName).attr("src");
        $("#thePicture").fadeOut(1, function() {
            $("#thePicture").attr("src",pictureSrc);
            PictureResponsive();
            $("#thePicture").css({
                "-webkit-transform":"rotate(90deg)",
                "-moz-transform":"rotate(90deg)",
                "-o-transform":"rotate(90deg)",
            });
            Flash();
        });
    })
    //pictureBox内上一页=======================================================================================
    $(Document).on("click", ".lastPhotoPage", function() {
        currentpage--;
        var page = `p=${currentpage}`
        $.get('/photoCode', page, function(data) {
            $("#photoCode").html(data);
            //定义缩略图容器的高度
            $(".photoThumbnailBox").each(function() {
                $(this).css({"height":screenHeight/3});
            });
            //定义大图和小缩略图容器的高度。
            $('.pictureBox').css({"height":screenHeight, "width":screenWidth});
            //定义大图容器的宽度和高度
            $('.pictureViewer').css({"height":screenHeight*3/4, "width":screenWidth});
            //定义theFooter容器的高度
            $('.theFooter').css({"height":screenHeight/5, "width":screenWidth});
            if($('.pictureBox').attr("currentPageNumber") >= 6) {
                pageNumber = 6
            }else {
                pageNumber = $('.pictureBox').attr("currentPageNumber")
            }
            //这个样式只能放在显示图片功能的后面，为了下一次打开时，不会出现两个信息的情况。
            $(".informationDisplayNone").css({"display":"none"});
            $("#thePicture").hide();
            var pictureSrc = $(".image1").attr("src");
            $("#thePicture").attr("src",pictureSrc);
            $('.theSingleLittlePhotoThumbnailBox').css({"height":screenHeight/7});
            $('.theSingleLittlePhotoThumbnail').addClass("img-rounded");
            $('.AdjacentPage').css({"height":screenHeight/7});
            $('.AdjacentPage').css({"paddingTop":screenHeight/18});
            //小素略图的显示功能=================================================================================
            for (var i=1; i<=pageNumber; i++) {
            (function(k) {
                    var idName = "#image" + i;
                    $(idName).each(function() {
                        var boxHeight = screenHeight/7;
                        var boxWidth = screenWidth/12;
                        var picturHeight = $('#thePicture')[0].height;
                        var pictureWidth = $('#thePicture')[0].width;
                        var specificValue = picturHeight/pictureWidth;
                        console.log(boxHeight, boxWidth);
                        if (picturHeight/pictureWidth > boxHeight/boxWidth) {
                            var differenceWidthValue = (boxWidth - boxHeight/specificValue)/2;
                            $(idName).css({"height":"100%", "width":"auto","position": "absolute","top":0, "left":differenceWidthValue});
                        } else {
                            var differenceHeightValue = (boxHeight - boxWidth*specificValue)/2;
                            $(idName).css({"width":"100%", "height":"auto","position": "absolute","top":differenceHeightValue, "left":0});
                        }
                    })
                })(i);
            }
            currentpage = $('.pictureBox').attr("currentpage");
            total = $('.pictureBox').attr("total");
            console.log(currentpage, total)
            if (currentpage == 1) {
                $(".lastPhotoPage").hide();
            }else {
                $(".lastPhotoPage").show();
            }
            if (currentpage == Math.ceil(total/6) || Math.ceil(total/6) == 1) {
                $(".nextPhotoPage").hide();
            } else {
                $(".nextPhotoPage").show();
            }
            $(".pictureBox").fadeIn(100, function() {
                //offset是为了火狐浏览器的兼容性而不得不采取的措施!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注：offset只对可见元素有效!!!!!!这是个坑
                $('.pictureBox').offset({ top: 0, left: 0 });
                $(".theFooter").addClass("animated bounceInUp").show();
                Flash();
                $("#image1").addClass("pictureThumbnailActive");
                $("#image1").addClass("img-thumbnail");
                activeId = "#image1";
                //用正则把遇到的非数字字符替换为空格，然后转化为数字!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                number = 1;
                //这个功能是后续控制的入口，这个显示函数必须放在number获得之后!!!!!!!!!!!!!!!!!!!!!
                PictureResponsive();
                console.log(number);
            });
            //图片拖动功能=============================================================================================
            var thePicture = $("#thePicture")
            drag(thePicture);
            function drag(thePicture) {
                //绑定点击事件，和对应的触发函数 !!!!!!!!!!!!!!!!!!!!!此处最好不用on来绑定，因为on会导致点击Document的任何位置都会影响图片位置
                $(Document).on("mousedown", start);
                //定义start功能函数
                function start(event) {
                    //取出点击位置相对于对象左上角的坐标
                    deltaX = event.clientX - thePicture.offset().left;
                    deltaY = event.clientY - thePicture.offset().top;
                    thePicture.css({
                        "cursor":"move"
                    })
                    //绑定事件
                    $(Document).on("mousemove", move);
                    $(Document).on("mouseup", stop);
                    return false; //可以去掉很多无用的默认反应
                }
            }
            //定义move功能函数
            function move(event) {
                //定义对象的css坐标
                thePicture.css({
                    "left":(event.clientX - deltaX) + "px", //此处必须用逗号，我曹坑啊
                    "top" :(event.clientY - deltaY) + "px",
                })
                return false; //可以去掉很多无用的默认反应
            }
            //定义 stop功能函数
            function stop (event) {
                //解除事件绑定
                $(Document).off("mousemove", move);
                $(Document).off("mouseup", stop);
            }
            var state = {
                url:"/photo",
            }
            history.pushState(state,document.title,"/photoAlbum");
        })
    })
    //pictureBox内下一页=======================================================================================
    $(Document).on("click", ".nextPhotoPage", function() {
        currentpage++;
        var page = `p=${currentpage}`
        $.get('/photoCode', page, function(data) {
            $("#photoCode").html(data);
            //定义缩略图容器的高度
            $(".photoThumbnailBox").each(function() {
                $(this).css({"height":screenHeight/3});
            });
            //定义大图和小缩略图容器的高度。
            $('.pictureBox').css({"height":screenHeight, "width":screenWidth});
            //定义大图容器的宽度和高度
            $('.pictureViewer').css({"height":screenHeight*3/4, "width":screenWidth});
            //定义theFooter容器的高度
            $('.theFooter').css({"height":screenHeight/5, "width":screenWidth});
            if($('.pictureBox').attr("currentPageNumber") >= 6) {
                pageNumber = 6
            }else {
                pageNumber = $('.pictureBox').attr("currentPageNumber")
            }
            //这个样式只能放在显示图片功能的后面，为了下一次打开时，不会出现两个信息的情况。
            $(".informationDisplayNone").css({"display":"none"});
            $("#thePicture").hide();
            var pictureSrc = $(".image1").attr("src");
            $("#thePicture").attr("src",pictureSrc);
            $('.theSingleLittlePhotoThumbnailBox').css({"height":screenHeight/7});
            $('.theSingleLittlePhotoThumbnail').addClass("img-rounded");
            $('.AdjacentPage').css({"height":screenHeight/7});
            $('.AdjacentPage').css({"paddingTop":screenHeight/18});
            //小素略图的显示功能=================================================================================
            for (var i=1; i<=pageNumber; i++) {
            (function(k) {
                    var idName = "#image" + i;
                    $(idName).each(function() {
                        var boxHeight = screenHeight/7;
                        var boxWidth = screenWidth/12;
                        var picturHeight = $('#thePicture')[0].height;
                        var pictureWidth = $('#thePicture')[0].width;
                        var specificValue = picturHeight/pictureWidth;
                        console.log(boxHeight, boxWidth);
                        if (picturHeight/pictureWidth > boxHeight/boxWidth) {
                            var differenceWidthValue = (boxWidth - boxHeight/specificValue)/2;
                            $(idName).css({"height":"100%", "width":"auto","position": "absolute","top":0, "left":differenceWidthValue});
                        } else {
                            var differenceHeightValue = (boxHeight - boxWidth*specificValue)/2;
                            $(idName).css({"width":"100%", "height":"auto","position": "absolute","top":differenceHeightValue, "left":0});
                        }
                    })
                })(i);
            }
            currentpage = $('.pictureBox').attr("currentpage");
            total = $('.pictureBox').attr("total");
            console.log(currentpage, total)
            if (currentpage == 1) {
                $(".lastPhotoPage").hide();
            }else {
                $(".lastPhotoPage").show();
            }
            if (currentpage == Math.ceil(total/6) || Math.ceil(total/6) == 1) {
                $(".nextPhotoPage").hide();
            } else {
                $(".nextPhotoPage").show();
            }
            $(".pictureBox").fadeIn(100, function() {
                //offset是为了火狐浏览器的兼容性而不得不采取的措施!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注：offset只对可见元素有效!!!!!!这是个坑
                $('.pictureBox').offset({ top: 0, left: 0 });
                $(".theFooter").addClass("animated bounceInUp").show();
                Flash();
                $("#image1").addClass("pictureThumbnailActive");
                $("#image1").addClass("img-thumbnail");
                activeId = "#image1";
                //用正则把遇到的非数字字符替换为空格，然后转化为数字!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                number = 1;
                //这个功能是后续控制的入口，这个显示函数必须放在number获得之后!!!!!!!!!!!!!!!!!!!!!
                PictureResponsive();
                console.log(number);
            });
            //图片拖动功能=============================================================================================
            var thePicture = $("#thePicture")
            drag(thePicture);
            function drag(thePicture) {
                //绑定点击事件，和对应的触发函数 !!!!!!!!!!!!!!!!!!!!!此处最好不用on来绑定，因为on会导致点击Document的任何位置都会影响图片位置
                $(Document).on("mousedown","#thePicture", start);
                //定义start功能函数
                function start(event) {
                    //取出点击位置相对于对象左上角的坐标
                    deltaX = event.clientX - thePicture.offset().left;
                    deltaY = event.clientY - thePicture.offset().top;
                    thePicture.css({
                        "cursor":"move"
                    })
                    //绑定事件
                    $(Document).on("mousemove", move);
                    $(Document).on("mouseup", stop);
                    return false; //可以去掉很多无用的默认反应
                }
            }
            //定义move功能函数
            function move(event) {
                //定义对象的css坐标
                thePicture.css({
                    "left":(event.clientX - deltaX) + "px", //此处必须用逗号，我曹坑啊
                    "top" :(event.clientY - deltaY) + "px",
                })
                return false; //可以去掉很多无用的默认反应
            }
            //定义 stop功能函数
            function stop (event) {
                //解除事件绑定
                $(Document).off("mousemove", move);
                $(Document).off("mouseup", stop);
            }
            var state = {
                url:"/photo",
            }
            history.pushState(state,document.title,"/photoAlbum");

        })
    })
    //图片拖动功能=============================================================================================
    var thePicture = $("#thePicture")
    drag(thePicture);
    function drag(thePicture) {
        //绑定点击事件，和对应的触发函数 !!!!!!!!!!!!!!!!!!!!!此处最好不用on来绑定，因为on会导致点击Document的任何位置都会影响图片位置
        $(Document).on("mousedown","#thePicture", start);
        //定义start功能函数
        function start(event) {
            //取出点击位置相对于对象左上角的坐标
            deltaX = event.clientX - thePicture.offset().left;
            deltaY = event.clientY - thePicture.offset().top;
            thePicture.css({
                "cursor":"move"
            })
            //绑定事件
            $(Document).on("mousemove", move);
            $(Document).on("mouseup", stop);
            return false; //可以去掉很多无用的默认反应
        }
    }
    //定义move功能函数
    function move(event) {
        //定义对象的css坐标
        thePicture.css({
            "left":(event.clientX - deltaX) + "px", //此处必须用逗号，我曹坑啊
            "top" :(event.clientY - deltaY) + "px",
        })
        return false; //可以去掉很多无用的默认反应
    }
    //定义 stop功能函数
    function stop (event) {
        //解除事件绑定
        $(Document).off("mousemove", move);
        $(Document).off("mouseup", stop);
    }


})








































