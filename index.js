
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');

//controllers
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

//middlwares
const validateMiddleware = require("./middleware/validationMiddleware");
const expressSession = require('express-session');
const authMiddleware = require('./middleware/authMiddleware');
const redirIfAuthenticated = require('./middleware/redirectIfAuthenticatedMiddleware');


mongoose.connect('mongodb://127.0.0.1/my_database', {useNewUrlParser: true});


const app = new express();
app.use(express.static('public'));

const ejs = require('ejs');
app.set('view engine','ejs');

//initializing express sessions
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  }));

app.use(flash());;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use('posts/store',validateMiddleware); // appling to only one route


global.loggedIn = null;

app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next()
});


app.get('/',homeController);
app.get('/post/:id',getPostController);
app.get('/posts/new',authMiddleware, newPostController);
app.get('/auth/register', redirIfAuthenticated, newUserController);
app.get('/auth/login', redirIfAuthenticated, loginController);
app.get('/auth/logout', logoutController);

app.get('/about',(req,res)=>{
  //res.sendFile(path.resolve(__dirname,'pages/about.html'))
  res.render('about');
});
  app.get('/contact',(req,res)=>{
  //res.sendFile(path.resolve(__dirname,'pages/contact.html'))
  res.render('contact');
});


app.post('/posts/store', authMiddleware,storePostController);
app.post('/users/register', redirIfAuthenticated, storeUserController);
app.post('/users/login',redirIfAuthenticated, loginUserController);

app.use((req, res) => res.render('notfound'));


app.listen(4000, ()=>{
console.log('App listening on port 4000')
});
