const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main().then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log("Database Connection Error");
});

async function main(){
    await mongoose.connect('mongodb://localhost:27017/blogify');
}

function asyncWrap(fn) {
    return function(req,res,next) {
        fn(req,res,next).catch((err)=>{
           next(err); 
        });
    }    
}

app.get('/',(req,res)=>{
    res.redirect('/home');
});

app.get('/home', asyncWrap(async(req,res)=>{
    const blog = await Blog.find();
    res.render('./redirects/Home.ejs', {blog});
}));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});