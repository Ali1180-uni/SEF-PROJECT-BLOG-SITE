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
    res.redirect('/blogs');
});

app.get('/blogs', asyncWrap(async(req,res)=>{
    const blog = await Blog.find();
    res.render('./redirects/Home.ejs', {blog});
}));

app.get('/blogs/login', asyncWrap(async(req,res)=>{
   res.render('./redirects/Login.ejs');
}));

app.get('/blogs/signup', asyncWrap(async(req,res)=>{
   res.render('./redirects/signUp.ejs');
}));

app.get('/blogs/new', (req,res)=>{
    res.render('./redirects/newBlog.ejs');
});

app.get('/blogs/about', (req,res)=>{
    res.render('./redirects/About.ejs');
});

app.get('/blogs/:id/edit', asyncWrap(async(req,res)=>{
    const {id} = req.params;
    const blog = await Blog.findById(id).populate('author');
    res.render('./redirects/editBlog.ejs', {blog});
}));

// Authentication required for the following routes
app.post('/blogs', asyncWrap(async(req,res)=>{
    const {topic, title, content} = req.body;
    await Blog.insertOne({topic: topic , title: title, content: content, createdAt: new Date(), updatedAt: new Date()});
    res.redirect('/blogs'); 
}));

app.put('/blogs/:id', asyncWrap(async(req,res)=>{
    const {id} = req.params;
    const {topic, title, content} = req.body;
    await Blog.findByIdAndUpdate(id, {topic, title, content});
    res.redirect('/blogs');
}));

app.delete('/blogs/:id', asyncWrap(async(req,res)=>{
    const {id} = req.params;
    await Blog.findByIdAndDelete(id);
    res.redirect('/blogs');
}));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});