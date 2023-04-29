$(document).ready(function()
    {
      alert("");
      $("#exampleInputEmail1").blur(function(){
        var exp= /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        var email= $(this).val();
        if(exp.test(email)==true)
        {
          $("#exampleInputEmail1").css("border-color","green");
        }
        else
        {
          $("#exampleInputEmail1").css("border-color","red");
          alert("Please enter a valid email id");
        }
      })

      $("#exampleInputPassword1").blur(function(){
        var exp= /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        var pwd= $(this).val();
        if(exp.test(pwd)==true)
        {
          $("#exampleInputPassword1").css("border-color","green");
        }
        else
        {
          $("#exampleInputPassword1").css("border-color","red");
          alert("Please enter a valid email id");
          $("#box").css("display","inline");

        }
      })
       
      $("#floatingInput").blur(function(){
        var res= /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        var e_mail= $(this).val();
        if(res.test(e_mail)==true)
        {
          $("#floatingInput").css("border-color","green");
        }
        else
        {
          $("#floatingInput").css("border-color","red");
          alert("Please enter a valid email id");
        }
        var urlWithData="/ajaxuser?ema"=+e_mail;
        $.get(urlWithData,function(response){
          alert(response);
        })
      })
      $(document).ajaxStart(function(){
        $("#wait").css("display","inline");//show
    });

    $(document).ajaxStop(function(){
        $("#wait").css("display","none");//hide
    });
    })