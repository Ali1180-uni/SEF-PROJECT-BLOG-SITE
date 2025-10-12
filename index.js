const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const blog = require('./models/blog');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main().then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log("Database Connection Error");
});

async function main(){
    await mongoose.connect('mongodb://localhost:27017/blog');
}

app.get('/',(req,res)=>{
    res.send('Hello World');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});