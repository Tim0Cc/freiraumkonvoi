const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passport = require('passport')

// login handle
router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.get('/register', (req, res) => {
  res.render('auth/register')
})

// register handle

router.post('/register', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const password2 = req.body.password2
  const role = req.body.role
  let errors = [];
  if(!name || !email || !password || !password2 || !role) {
      errors.push({msg : "Please fill in all fields"})
  }
  //check if match
  if(password !== password2) {
      errors.push({msg : "passwords don't match"});
  }

  //check if password is more than 6 characters
  // if(password.length < 6 ) {
  //     errors.push({msg : 'password atleast 6 characters'})
  // }
  if(errors.length > 0 ) {
    res.render('auth/register', {
      errors : errors,
      name : name,
      email : email,
      password : password,
      password2 : password2,
      role : role 
    })
  } else {
    User.findOne({name: name}).exec((err, user) => {
      if(user) {
        errors.push({msg: 'username already exists'})
        res.render('auth/register', {errors,name,email,password,password2,role})
      } else {
          //validation passed
        User.findOne({email : email}).exec((err,user)=>{
          if(user) {
            errors.push({msg: 'email already registered'});
            res.render('auth/register', { errors,name,email,password,password2,role });          
          } else {
            const newUser = new User({
              name : name,
              email : email,
              password : password,
              role: role,
              registerDate : Date.now()
            });
            bcrypt.genSalt(10, (err,salt) => bcrypt.hash(
              newUser.password, 
              salt, 
              (err,hash) => {
                if(err) throw err;
                  //save pass to hash
                  newUser.password = hash;
                //save user
                newUser.save()
                .then((value) => {
                  req.flash('success_msg', 'Sie haben die AG erfolgreich registriert')
                  res.redirect('/auth/login');
                })
                .catch(value=> console.log(value));      
              }
            ));
          }
        })
      }
    })
  }
})

router.post('/login', (req, res, next) => {
  const user = User.findOne({name: req.body.username})
  .then((user) => {
    let path = '/dashboard'
    return path
    // if (user != null) {
    //   if (user.role === 'admin') {
    //     return path = '/admindashboard'
    //   } else {
    //     return path = '/dashboard'
    //   }
    // }
  })
  .then((path) => {
    passport.authenticate('local', {
      successRedirect: path,
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next)
  })
})

// logout

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Sie haben sich erfolgreich ausgeloggt')
  res.redirect('/auth/login')
})


module.exports = router