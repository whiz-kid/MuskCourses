var Course = require('../models/course');
var User = require('../models/user');
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);



// GET home page
router.get('/', function(req, res, next) {
  Course
  .find(function(err,courses){
      var web=0;
      var app=0;
      var security=0;
      var machine=0;
    if(req.isAuthenticated()){
      var course = [];
      for(var i = 0; i<courses.length; i++){
        if(courses[i]._offeredBy != req.user.email){
          course.push(courses[i]);
        }
      }
     
      for(var i = 0; i<course.length; i++){
        if(course[i].type == 'Web Development'){
          web++;
        }
        else if(course[i].type == 'App Development'){
          app++;
        }
        else if(course[i].type == 'Computer Security'){
          security++;
        }
        else{
          machine++;
        }
      }
    }else{
      course = courses;
      for(var i = 0; i<course.length; i++){
        if(course[i].type == 'Web Development'){
          web++;
        }
        else if(course[i].type == 'App Development'){
          app++;
        }
        else if(course[i].type == 'Computer Security'){
          security++;
        }
        else{
          machine++;
        }
      }
    }
    var total = {app:app,web:web,machine:machine,security:security}
    var productChunks = [];
    var chunkSize = 4;
    for(var i = 0; i<course.length; i += chunkSize){
        productChunks.push(course.slice(i,i+chunkSize));
    }
    res.render('shop/index',{course:productChunks,total:total});
  });
});



router.get('/course/:id',function(req,res,next){

  if(req.params.id == 1){
    var x='Web Development';
  }else if(req.params.id == 2){
    var x = 'App Development';
  }else if(req.params.id == 3){
    var x = 'Computer Security';
  }else{
    var x = 'Machine Learning';
  }

  Course.find({type:x},function(err,courses){
    if(req.isAuthenticated()){
      var course = [];
      for(var i = 0; i<courses.length; i++){
        if(courses[i]._offeredBy != req.user.email){
          course.push(courses[i]);
        }
      }
    }else{
       course = courses;
      }
    if(course.length == 0){
      res.redirect('/');
    }else{
    res.render('shop/course',{course:course});
    }
  });

});



router.get('/course/details/:id',function(req,res,next){
  Course
  .findOne({_id:req.params.id},function(err,course){
    res.render('shop/product',{course:course});
  });
});








//User Routes
router.get('/user/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0 });
});

router.post('/user/signup',passport.authenticate('local.signup',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/signup',
  failureFlash:true
}));

router.get('/user/signin',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0 });
});

router.post('/user/signin',passport.authenticate('local.signin',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/signin',
  failureFlash:true
}));




//Authenticating with Facebook
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/user/signup' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/user/profile');
  });






//Logout
router.get('/user/logout',function(req,res,next){
  req.logout();
  res.redirect('/')
});






//Profile Route
router.get('/user/profile',isLoggedIn,function(req,res,next){
  Course
  .find({_offeredBy:req.user.email},function(err,course){
    var productChunks = [];
    var chunkSize = 4;
    for(var i = 0; i<course.length; i += chunkSize){
        productChunks.push(course.slice(i,i+chunkSize));
    }
    res.render('user/profile',{csrfToken:req.csrfToken(),course:productChunks});
  });
});


router.post('/user/profile',isLoggedIn,function(req,res,next){
  var courseInfo = req.body;
  var newCourse = new Course();
  newCourse.courseName = courseInfo.coursename;
  newCourse.price = courseInfo.price;
  newCourse.type = courseInfo.type;
  newCourse.courseDetails = courseInfo.coursedetails;
  newCourse.period = courseInfo.period;
  newCourse._offeredBy = req.user.email;
  if(courseInfo.type == 'Web Development'){
    newCourse.courseLogo = 'images/web.jpg';
  }
  else if(courseInfo.type == 'App Development'){
    newCourse.courseLogo = 'images/app.jpg';
  }
  else if(courseInfo.type == 'Computer Security'){
    newCourse.courseLogo = 'images/security.jpg';
  }
  else{
    newCourse.courseLogo='images/machine.jpg';
  }
  newCourse.save(function(err,result){
    if(err){
      res.redirect('/user/profile');
    }
  });
 req.user.courseOffered.push(newCourse);
 req.user.save();

 res.redirect('/user/profile');
});
  



//For Checking User Login Status
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  };
  res.redirect('/user/signin');
}
module.exports = router;
