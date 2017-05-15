$(Document).ready(function(){
    
    //根据视窗高度自动判断半透明背景的高度  
    var bckcolorheight = $(window).height();
    $('.bck-color').css('padding-bottom', bckcolorheight)

    var num;
    var error;
    //添加注册页表单验证
    $(Document).on("blur",'#regInputName',function(){
        //进行用户名是否重复的验证==================================================
        $.get("/name",{name: $('#regInputName').val()}, function(result) {
            console.log(result);
            if (result != "null") {
                //!!!!!!!!切记这里不可以用this，因为this指的是jQuery对象!!!!!!!
                $('#regInputName').next().show(); 
                error = 1;
            }else {
                $('#regInputName').next().hide();
                error = 0;
            }
        });
        console.log(this.data);
        var val = this.value;
        console.log(val);
        if (val.length > 20) {
            $(this).next().next().show();
            $(this).data({"num":0});
        } else {
            $(this).next().next().hide();
            $(this).data({"num":1});
        }
    })
    console.log(num);
    $(Document).on("blur",'#regInputPassword',function(){
        var val = this.value;
        console.log(val);
        if (val.length < 6 || val.length >20) {
            $(this).next().show();
            $(this).data({"num":0});
        } else {
            $(this).next().hide();
            $(this).data({"num":1});
        }
    })
    $(Document).on("blur",'#regInputPasswordAgain',function(){
        var val1 =  $('#regInputPassword').val();
        var val2 = this.value;
        console.log(val1,val2);
        if (val1 != val2) {
            $(this).next().show();
            $(this).data({"num":0});
        } else {
            $(this).next().hide();
            $(this).data({"num":1});
        }
    })
    $(Document).on("blur",'#regInputEmail',function(){
        var val = this.value;
        console.log(val);
        if(!val.match(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/)) {
            $(this).next().show();
            $(this).data({"num":0});
        } else {
            $(this).next().hide();
            $(this).data({"num":1});
        }
    })

    //reg页面进行post提交===================================================================
    $(Document).on("click", "#regSubmit", function() {
        var tot = 0;
        $('.form-signin input').each(function() {
            $(this).blur();
            tot += $(this).data('num')
            console.log(tot);
        })
        console.log(tot);
        if(tot != 4 || error == 1){
            return false;
        } 
        var body = {
            "name":     $('#regInputName').val(),
            "password": $('#regInputPassword').val(),
            "email":    $('#regInputEmail').val()
        } 
        console.log(body);
        $.post("/regInformation",body ,function(data) {    //经过太多尝试，此处对应的服务器必须为res.send(req.body)，别问我为什么？我也没弄懂
                //注册完毕，隐藏注册页面
                // $('.reg').hide();
                console.log(data);
                $(".bodyPart").children().remove();
                //用历史中的URL重新加载bodyPart区
                console.log(history.state.url);
                $(".bodyPart").load(history.state.url);
                console.log($(".bodyPart").html());
                $(".bodyPart").children().hide().fadeIn(500);
        });
    });









    //添加返回页面顶部的图标及功能
    var winHeight = $(window).height() - 500;
    $(window).scroll(function(event) {
        //当滚动高度大于屏幕的显示高度时
        if($(window).scrollTop() > winHeight) {
            $('#comeBackTop').fadeIn(500);
        } else{
            $('#comeBackTop').fadeOut(500);
        }
    });
    $(Document).on("click", "#comeBackTop", function() {
        $('body,html').animate({ scrollTop: 0 }, 500);
        return false;
    })
});