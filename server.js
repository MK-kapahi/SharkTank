var express=require("express");
var app=express();
var fileupload = require('express-fileupload');
var mysql = require('mysql');
var nodemailer = require("nodemailer");

app.listen("2002",function(){
    console.log("server Started");
})

app.use(express.static("p_html"));
app.use(express.urlencoded('extended:true'));
app.use(fileupload());
//********************************************************************* *
// Database Connectivity
var Dbconfig=
{
    host:"localhost",
    user:"root",
    passsword:"",
    database:"pitchline",
}

var Dbctrl = mysql.createConnection(Dbconfig);

Dbctrl.connect(function(err)
{
    if(err)
    {
        console.log(err);
    }

    else
    {
        console.log("Conection created");
    }
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'muskankapahi123@gmail.com',
      pass: 'Prince123@'
    }
  });
 app.get("/shark",function(req,resp){
    resp.sendFile(process.cwd()+"/p_html/shark.html");
 })

 app.get("/profile",function(req,resp){
    resp.sendFile(process.cwd()+"/p_html/shark_profile.html");
 })
 //********************************************************************************* */
 // SignUp
app.get("/ajaxsignin",function(req,resp){
    console.log("abcsd");
    var dataAry = [req.query.mail,req.query.pwd,req.query.use];
    //console.log(req.query.use);
    console.log(dataAry);
    Dbctrl.query("insert into users values(?,?,?,current_date(),1)",dataAry,function(err){
        if(err)
        resp.send(err);
        
        else
        {
           if(req.query.use=="Shark")
          {
              resp.send("Shark");
          }
  
          else if(req.query.use=="Pitcher")
          {
              resp.send("Pitcher");
          }

          else
          {
              resp.send("No u type");
          }
        }
    var mailOptions = {
        from: 'muskankapahi123@gmail.com',
        to: req.query.mail,
        subject: 'Welcome To sharktank.com',
        text: "Hi User"
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    })
})

//********************************************************************************* */
 //Availability Check
app.get("/ajaxuser",function(req,resp){
    Dbctrl.query("select * from users where Email=?",[req.query.mail],function(err,result){
        if(err)
        resp.send(err);
        else
        {
           if(result.length==0)
           resp.send("Available");

           else
           resp.send("The user id already exist please login");
        }
    })
})

//********************************************************************************* */
 // Login
app.get("/ajaxlogin",function(req,resp){

    var dataary =[req.query.ema,req.query.pdd]
    Dbctrl.query("select Type from users where Email=? and Password=? and status=1",dataary,function(err,result){
        console.log(result[0].Type);
        if(err)
        resp.send(err);
        else if(result.length==0)
        resp.send("Invalid id /Blocled id");
        else
       // resp.send(result);
       resp.send(result[0].Type);
    })
})

//********************************************************************************* */
 // Ajax profile submit
app.get("/ajaxprofilesubmit",function(req,resp){
    var newPic="sers.jpg";
    var Adpic="usser.jpg";
     
    if(req.files!=null)
    {
      newPic=req.body.mail+" - "+req.files.pic1.name;
      var des= process.cwd()+"/p_html/upload/"+newPic;

      req.files.pic1.mv(des, function(err)
        {
         if(err)
               console.log(err);
          else
                console.log("File Uploaded Successfully");
        });
    }

    if(req.files!=null)
    {
        Adpic=req.body.mail+"-"+req.files.pic2.name;
        var Des=process.cwd()+"/p_html/Acardupload/"+Adpic;

        req.files.pic2.mv(Des,function(err){
            if(err)
            resp.send(err);
            else
                console.log("File Uploaded Successfully");
        })
    }
    grp=[req.body.group];
    var catte="" 
    for(var i=0;i<grp.length;i++)
    {
        catte=catte+grp[i]+" ";
    }
    var DataArt=[req.body.mail, req.body.name,req.body.num,req.body.add,req.body.occu,req.body.city,newPic,Adpic,
                          catte,req.body.comp,req.body.amnt,req.body.txt];
    Dbctrl.query("insert into sprofile values(?,?,?,?,?,?,?,?,?,?,?,?)",DataArt,function(err,result){
        // console.log(result);
        if(err)
        resp.send(err);
        else
        resp.send("Data Submitted successfully")
    })


})

//********************************************************************************* */
 // Form action Profile signup
app.post("/shark-submit",function(req,resp){
    console.log("Done");
    var newPic="sers.jpg";
    var Adpic="usser.jpg";
     
    if(req.files!=null)
    {
    //   newPic=req.body.mail+" - "+req.files.propic.name;
    newPic= req.body.mail+"-"+req.files.pic1.name;
      var des= process.cwd()+"/p_html/upload/"+newPic;

      req.files.pic1.mv(des,function(err)
        {
         if(err)
               console.log(err);
          else
                console.log("File Uploaded Successfully");
        });
    }

    if(req.files!=null)
    {
        Adpic=req.body.mail+"-"+req.files.pic2.name;
        var Des=process.cwd()+"/p_html/Acardupload/"+Adpic;

        req.files.pic2.mv(Des,function(err){
            if(err)
            resp.send(err);
            else
                console.log("File Uploaded Successfully");
        })
    }
    var grp=[req.body.group];
    var val="";
    for(var i=0;i<grp.length;i++)
    {
        val =val+req.body.group+",";
    }

    
    console.log(val);
    var DataArt=[req.body.mail, req.body.name,req.body.num,req.body.add,req.body.occu,req.body.city,newPic,Adpic,
                          val,req.body.comp,req.body.amnt,req.body.area];
    Dbctrl.query("insert into sprofile values(?,?,?,?,?,?,?,?,?,?,?,?)",DataArt,function(err){
        // console.log(result);
        if(err)
        resp.send(err);
        else
        resp.send("Data Submitted successfully")
    })
     req.body.oldpic =newPic;
     req.body.oldpic1 =Adpic;
})

app.post("/shark-update",function(req,resp){
   var newppic;
   var newadpic;

   if(req.files!=null)
   {
       newppic =req.body.mail+"-"+req.files.pic1.name;
       var des= process.cwd()+"/p_html/upload/"+newppic;
       
       req.files.pic1.mv(des,function(err){
           if(err)
           console.log(err);
           else
           resp.send("File Updated Successfully");

        })
    }
    
    else
    {
       newppic=req.body.oldpic;
   }

   if(req.files!=null)
   {
       newadpic=req.body.mail+"-"+req.files.pic2.name;
       var Des =process.cwd()+"/p_html/Acardupload/"+newadpic;
       req.files.pic2.mv(Des,function(err)
       {
        if(err)
        console.log(err);
        else
        resp.send("File Updated Successfully"); 
       })
   }

   else
   {
    newadpic=req.body.oldpic1;
   }
   var val=[req.body.group];
//    var gro=[req.body.group];
//    var val="";
//    for(var i=0;i<gro.length;i++)
//    {
//        val=val+gro[i]+",";
//    }
   var dataArry=[req.body.name,req.body.num,req.body.add,req.body.occu,req.body.city,newppic,newadpic,
    val,req.body.comp,req.body.amnt,req.body.area,req.body.mail];
   Dbctrl.query("update sprofile set name= ?,contact= ?,address=? ,occupation=? , city= ?,propic=?, acardpic=?, categories=?, compcount=?, amount=?, info=? where emailid=?",dataArry,function(err){
       if(err)
       console.log(err);
       else
       resp.send("Data Updated Sucessfully");
   })
})

app.get("/JSONfetchdata",function(req,resp)
{
console.log("");
  Dbctrl.query("select * from sprofile where emailid=?",[req.query.mail],function(err,result){
      if(err)
      resp.send(err);
      else
      resp.send(result);
  })
})
app.get("/JSONfetchpic",function(req,resp)
{
console.log("");
  Dbctrl.query("select propic,acardpic from sprofile where emailid=?",[req.query.mail],function(err,result){
      if(err)
      resp.send(err);
      else
      resp.send(result);
  })
})
/*************************Pitcher data */
app.post("/founder-submit",function(req,resp){
    console.log("Done");
    var newPic="sers.jpg";
     
    if(req.files!=null)
    {
    //   newPic=req.body.mail+" - "+req.files.propic.name;
    newPic= req.body.fmail+"-"+req.files.pic3.name;
      var des= process.cwd()+"/p_html/upload/"+newPic;

      req.files.pic3.mv(des,function(err)
        {
         if(err)
               console.log(err);
          else
                console.log("File Uploaded Successfully");
        });
    }
    
    var DataArt=[req.body.fmail, req.body.fname,req.body.fnum,req.body.fadd,req.body.fcity,newPic,req.body.group,
        req.body.fcomp,req.body.festb,req.body.fsale,req.body.fpart,req.body.feval,req.body.ftxt];
    Dbctrl.query("insert into funderprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)",DataArt,function(err){
        // console.log(result);
        if(err)
        resp.send(err);
        else
        resp.send("Data Submitted successfully")
    })
})

app.get("/angular",function(req,resp){
 resp.sendFile(process.cwd()+"/p_html/admin-angular.html");
})

app.get("/showall",function(req,resp)
{
    Dbctrl.query("select * from sprofile",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})
app.get("/showallpitcher",function(req,resp)
{
    Dbctrl.query("select * from funderprofile ",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})
app.get("/funder",function(req,resp)
{
    resp.sendFile(process.cwd()+"/p_html/funder_profile.html");
})

app.get("/google",function(req,resp)
{
    resp.sendFile(process.cwd()+"/p_html/sharks-google.html");
})

app.post("/founder-update",function(req,resp){
    console.log("Done");
    var newpPic="sers.jpg";
     
    if(req.files!=null)
    {
    newPic= req.body.fmail+"-"+req.files.pic3.name;
      var des= process.cwd()+"/p_html/upload/"+newpPic;

      req.files.pic3.mv(des,function(err)
        {
         if(err)
               console.log(err);
          else
                console.log("File Uploaded Successfully");
        });
    }
    
    var DataArtt=[req.body.fname,req.body.fnum,req.body.fadd,req.body.fcity,newpPic,req.body.group,
        req.body.fcomp,req.body.festb,req.body.fsale,req.body.fpart,req.body.feval,req.body.ftxt,req.body.fmail];
    Dbctrl.query("update funderprofile set name= ?,contact= ?,address=? , city= ?,adhpic=?, Category=?,company=?, estabin=?, sales=?, partners=?,evaluation=?,otherinfo=? where Email=?",DataArtt,function(err){
        if(err)
        resp.send(err);
        else
        resp.send("Data Submitted successfully")
    })
})
app.get("/JSONfetchfunder",function(req,resp){
    Dbctrl.query("select * from funderprofile where Email=?",[req.query.fmail],function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})


app.get("/delete",function(req,resp){
    Dbctrl.query("delete * from sprofile where emailid=? ",[req.query.mail],function(err,result){
        if(err)
            resp.send(err);
        else
            if(result.affectedRows==0)
            resp.send("Invalid id");
            else
            resp.send("Deleted");
    })
})

app.get("/deletepitcher",function(req,resp){
    Dbctrl.query("delete * from funderprofile where Email=? ",[req.query.mail],function(err,result){
        if(err)
            resp.send(err);
        else
            if(result.affectedRows==0)
            resp.send("Invalid id");
            else
            resp.send("Deleted");
    })
})
// user angular ***********************

app.get("/showuser",function(req,resp)
{
    Dbctrl.query("select * from users",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/deleteuser",function(req,resp){
    Dbctrl.query("delete * from users where Email=? ",[req.query.mail],function(err,result){
        if(err)
            resp.send(err);
        else
            if(result.affectedRows==0)
            resp.send("Invalid id");
            else
            resp.send("Deleted");
    })
})


app.get("/blockuser",function(req,resp){
    console.log(req.query.Email);
    Dbctrl.query("update users set status=0 where Email=?",[req.query.Email],function(err,result){
        if(err)
           console.log(err);
        else
            resp.send("Blocked");
    })
})

app.get("/resumeuser",function(req,resp){
    Dbctrl.query(" update users set status=1 where Email=? ",[req.query.Email],function(err,result){
        if(err)
            resp.send(err);
        else
            resp.send("Resumed user");
    })
})

app.get("/getcate",function(req,resp){
    Dbctrl.query("select DISTINCT categories from sprofile ",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/getcity",function(req,resp){
    Dbctrl.query("select DISTINCT city from sprofile ",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/dofetching",function(req,resp){
    Dbctrl.query("select * from sprofile where categories like ? && city=?",[req.query.categories ,req.query.city],function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/dogetinfo",function(req,resp){
    Dbctrl.query(" select * from sprofile where emailid=?",[req.query.emailId],function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/getcategory",function(req,resp){
    Dbctrl.query("select DISTINCT Category from funderprofile",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/geteval",function(req,resp){
    Dbctrl.query("select DISTINCT evaluation from funderprofile",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/dofetch",function(req,resp){
    Dbctrl.query("select * from funderprofile where Category =? && evaluation>=?",[req.query.Category ,req.query.evaluation],function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/dogetinfo",function(req,resp){
    Dbctrl.query(" select * from funderprofile where Email=?",[req.query.emailId],function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/ajaxsubmitinvester",function(req,resp){
    Dbctrl.query("insert into investments value(?,?,?)",[req.query.mailin,req.query.compin,req.query.amntin],function(err,result){
        if(err)
        resp.send(err);
        else
        console.log("Data submitted successfully");
    })
})

app.get("/useradmin",function(req,resp)
{
    resp.sendFile(process.cwd()+"/p_html/angular-user.html");
})

app.get("/fonder",function(req,resp)
{
    resp.sendFile(process.cwd()+"/p_html/pitchergoogle.html");
})