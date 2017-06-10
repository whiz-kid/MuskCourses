var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/index', { title: 'Express' });
});

router.get('/user/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0 });
});

router.post('/user/signup',passport.authenticate('local.signup',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/signup',
  failureFlash:true
}))

router.get('/user/signin',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0 });
});

router.post('/user/signin',passport.authenticate('local.signin',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/signin',
  failureFlash:true
}))

router.get('/user/profile',function(req,res,next){
  res.render('user/profile');
});


router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/user/signup' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/user/profile');
  });
  

module.exports = router;
