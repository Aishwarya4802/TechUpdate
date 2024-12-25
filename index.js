const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const session = require('express-session');
const moment=require('moment');
require('moment-duration-format');
const mysql=require('mysql');

// var loginSta=false;
// var isAdmin=0;

//Database of login and reg
var name=['Admin das','Ash','aashi','tim','joy'];
var email=['admin@admin.com','aishwarya@aishwarya.com','user@user.com','tim@tim.com','joy@joy.com'];
var Acc =['admin','Aishwarya','user','abhiral','pookie'];
var Pwd=['admin','2908','user','2606','1907'];
var admin=[1,1,0,0,0];
var sta=[1,1,1,1,1];


// var Search=['','',''];

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root', /* MySQL User */
    password: '', /* MySQL Password */
    database: 'tw_data' /* MySQL Database */
  });
  

//   conn.connect((err)=>{
//     if(err) throw err;
//     console.log('Mysql Connected with App...'
//     )
//   })

//Database of posts
var posts=['This is my first post as an user','This is my first post as an admin','test'];
var postedby=['user','admin','user'];
var PostedT=['','',''];
var Like=['10','140',''];
var likedBy=['','',''];
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//use ejs
app.set('view engine', 'ejs');

 
//middleware to parse json ki body
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

//del a user
app.get("/delUser/:id",function(req,res){
    
    // Acc.splice(req.params.id,1);
    // console.log(Acc);
    conn.query('DELETE FROM users_data where sn0='+req.params.id+';', function(error, results, fields) {
        if (error) throw error;


    res.redirect("/users")
    })
})

// welcome page request 
app.get("/",function(req,res){
    req.session.destroy();
    res.render("login");
})

//likes backend

app.get("/like/:id",function(req,res){
    console.log(req.params.id);
    Like[req.params.id]=Number(Like[req.params.id]+1);
    res.redirect("/home")
    
});

//naye post krne ke liye by user
app.get("/profile",function(req,res){
    if(req.session.loginSta==true){
        var newpost=[];
        for (var i=0;i<=postedby.length;i++){
        if(req.session.user==postedby[i])
                newpost.push(posts[i])
        }
        
        res.render('profile',{uname:req.session.user,post:newpost});
    }
            
});
 
app.get("/banUser/:id",function(req,res){
    const userId = req.params.id;

    // Fetch current ban status
    conn.query('SELECT status FROM users_data WHERE sn0 = ?', [userId], function(error1, results) {
      if (error1) {
        console.error('Error fetching user status:', error1);
        return res.status(500).send('Internal Server Error');
      }
  
      if (results.length === 0) {
        // User not found
        return res.status(404).send('User not found');
      }
  
      const currentStatus = results[0].status;
      const newStatus = currentStatus === 0 ? 1 : 0; // Toggle ban status
  
      // Update user ban status
      conn.query('UPDATE users_data SET status = ? WHERE sn0 = ?', [newStatus, userId], function(error2) {
        if (error2) {
          console.error('Error updating user status:', error2);
          return res.status(500).send('Internal Server Error');
        }
  
        // Redirect to the admin dashboard
        res.redirect('/adash');
      });
    });
  });
//signup or regestration page
app.get("/reg",function(req,res){     //change
    res.render('signup');
})

//logout page
app.get('/logout',function(req,res){
    req.session.destroy();
    res.redirect("/");
})


//post of /reg
app.post("/reg",function(req,res){
    var username=req.body.uname;
    var password=req.body.pwd;
    var fname=req.body.name;
    var remail=req.body.email;
    var cpassword=req.body.cpwd;
    if(cpassword=password){
        // name.push(fname);
        // email.push(remail);
        // Pwd.push(password);
        // Acc.push(username);
        // admin.push(0);
        let data = {name: fname, username: username, email: remail, pwd: password, is_admin: 0, status: 1};

        let sqlQuery = "INSERT INTO users_data (name, username, email, pwd, is_admin, status) VALUES (?, ?, ?, ?, ?, ?)";
        
        let query = conn.query(sqlQuery, [data.name, data.username, data.email, data.pwd, data.is_admin, data.status], function(err, results) { 
            if (err) throw err;
            else {
                res.redirect("/");
            }
        });
        
}
})

//get of landing page

app.get("/home",function(req,res){
    // var agoStamp=[]
    // for(var i=0;i<posts.length;i++){
    //     const timestamp=moment(PostedT[i],'D/M/YYYY,h:mm:ss a');

    //     //calculate the duration between the timestamp and now
    //     const duration=moment.duration(moment().diff(timestamp));

    //     //format the duration into  a human-readable relative time
    //    const FormattedTimeAgo=duration.format();
    //     agoStamp.push(FormattedTimeAgo);
    // }
    conn.query('SELECT * FROM users_posts ;', function(error, results, fields) {
        if (error) throw error;

    res.render("landingpage",{results:results});
    console.log(results);
})
});
//post create krne ke liye
app.post("/post",function(req,res){
    var post=req.body.post;
    var timestamp=new Date().toLocaleString();
    // posts.push(post);
    // PostedT.push(timestamp);
    // postedby.push(req.session.user);
    // Like.push(0)
    //let data = {posts:post, username: username, email: remail, pwd: password, is_admin: 0, status: 1};
 
        let sqlQuery = "INSERT INTO users_posts (posts,postedby,likes,likedby) VALUES (?, ?, ?, ?)";
        
        let query = conn.query(sqlQuery, [post,req.session.user,0,''], function(err, results) { 
            if (err) throw err;
           });
    res.redirect("/home");
})

//get req of adash
app.get("/adash",function(req,res){
    if(req.session.loginSta==true && req.session.isAdmin==1 && req.session.banned==1){

        conn.query('SELECT * FROM users_posts ;', function(error, results, fields) {
            if (error) throw error;




            conn.query('SELECT * FROM users_data ;', function(error1, results1, fields) {
                if (error1) throw error1;
    
            res.render("dashboardAdmin",{results:results,results1:results1});
        console.log(results);
    })
})


    }
    else{
        res.redirect("/");
    }
});

//getting udash 
app.get("/udash",function(req,res){
  if(req.session.loginSta==true && req.session.banned==1){

    var currUser=req.session.user;
    res.render("dashboard",{posts:posts,postedby:postedby,user:currUser});
  }
  else
    res.redirect("/");
})

app.post("/search",function(req,res){

        var item=req.body.text;
        var newa=[]
        for(var i=0;i<Acc.length;i=i+1){
        if(item==Acc[i]){
            
            newa.push(Acc[i]);
        }
    }
    res.render('se',{acc:newa});
});
//for getting username password
//backend of login

// app.get("/signup",function(req,res){
//     res.render('signup');
// });

app.post("/login", function(req, res) {
    var username = req.body.uname;
    var pwd = req.body.pwd;
    
    if (username && pwd) {
        conn.query('SELECT * FROM users_data WHERE username = ? AND pwd = ?', [username, pwd], function(error, results, fields) {
            if (error) throw error;

            if (results.length > 0) {
                req.session.loginSta = true;
                req.session.isAdmin = results[0].is_admin;
                req.session.user = username;
                req.session.banned = results[0].status;

                if (req.session.isAdmin == 1 && req.session.loginSta == true && req.session.banned == 1) {
                    res.redirect("/adash");
                } else if (req.session.loginSta == true && req.session.banned == 1) {
                    res.redirect("/udash");
                } else {
                    res.redirect("/");
                }
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
});

// app.post("/login",function(req,res){
//     var username=req.body.uname;
//     var pwd=req.body.pwd;
//     console.log(username);
//     console.log(pwd);
//     if (username && pwd) {
// 		conn.query('SELECT * FROM users_data WHERE username = ? AND pwd = ?', [username, pwd], 
//         function(error, results, fields) {
// 			if (error) throw error;

//             if (results.length > 0) {
//             req.session.loginSta=true;
//             console.log(results[0].is_admin);
//             console.log(error);
//            req.session.isAdmin=results[0].is_admin; 
//             req.session.user=username;
//            req.session.banSta=results[0].status;
//             }
//         }
        
// )};
// console.log(req.session.banned);
//     if(req.session.isAdmin==1 && req.session.loginSta==true&&req.session.banSta==1){
//         res.redirect("/adash");
//     }
//     else if (req.session.loginSta==true&&req.session.banSta==1){
//         res.redirect("/udash");
//     }
//     else{
//         res.redirect("/");
//     }
 
 //admin
    // if(username=="admin" && pwd=="admin"){
    //     req.session.loginSta=true;
    //     req.session.isAdmin=1;
    //     res.redirect("/adash");
    // }
    // else if (username=="user" && pwd=="user"){
    //     req.session.loginSta=true;
    //     res.redirect("/udash");
    // }
    // else{
    //     res.redirect("/");
    // }
//})
//edit get re

app.get("/editPost/:id",function(req,res){
  res.render('edit',{post:posts[req.params.id],index:req.params.id})
});
//edit post req
app.post("/editPost",function(req,res){
    posts[req.body.index]=req.body.postchange;
    res.redirect('/home')
});
app.get("/delPost/:id",function(req,res){
    // console.log(req.params.id);
    //      posts.splice(req.params.id,1);
    //      postedby.splice(req.params.id,1);
    //      PostedT.splice(req.params.id,1);
    conn.query('DELETE FROM users_posts where si_n0='+req.params.id+';', function(error, results, fields) {
        if (error) throw error;
res.redirect("/adash");
    })
});
app.get("/users",function(req,res){

    conn.query('SELECT * FROM users_data ;', function(error1, results1, fields) {
        if (error1) throw error1;


    res.render("users",{results1:results1})
    });
})

app.listen(3000,function(req,res){
    console.log("Server is working");
})