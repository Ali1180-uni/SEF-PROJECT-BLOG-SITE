require('dotenv').config();
const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const User = require('./models/user');
const passport = require('passport');
const passportLocal = require('passport-local');
const flash = require('connect-flash');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { isLoggedIn, isAuthor, origUrl } = require('./Middlewares/isAuth');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



const mongoUrl = process.env.MONGODB_URL;
// const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/blogify';

const store = MongoStore.create({
    mongoUrl,
    touchAfter: 24 * 3600 // time period in seconds
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR:', e);
});

const SessionOptions = {
    store,
    secret: process.env.SECRET,
    // secret: process.env.SECRET || "AliRahmaniSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};


app.use(session(SessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local-mongoose strategy
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});


main().then(() => {
    console.log("Database Connected");
}).catch((err) => {
    console.log("Database Connection Error");
});

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    // await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/blogify');
}

function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err);
        });
    }
}

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/blogs', asyncWrap(async (req, res) => {
    const blog = await Blog.find().populate('author');
    res.render('./redirects/Home.ejs', { blog });
}));

app.get('/blogs/login', (req, res) => {
    res.render('./redirects/Login.ejs');
});

app.get('/blogs/signup', asyncWrap(async (req, res) => {
    res.render('./redirects/signUp.ejs');
}));

app.get('/blogs/new', isLoggedIn, (req, res) => {
    res.render('./redirects/newBlog.ejs');
});

app.get('/blogs/about', (req, res) => {
    res.render('./redirects/About.ejs');
});

// Logout - MUST be before /blogs/:id to avoid route collision
app.get('/blogs/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Logged out successfully');
        return res.redirect('/blogs');
    });
});

// View individual blog (optional feature - for future use)
app.get('/blogs/:id', asyncWrap(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('author');
    if (!blog) {
        req.flash('error', 'Blog not found');
        return res.redirect('/blogs');
    }
    // For now redirect to home, or you can create a single blog view
    res.redirect('/blogs');
}));

app.get('/blogs/:id/edit', isLoggedIn, isAuthor, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('author');
    if (!blog) {
        req.flash('error', 'Blog not found');
        return res.redirect('/blogs');
        
    }
    res.render('./redirects/editBlog.ejs', { blog });
}));

// Authentication required for the following routes
app.post('/blogs', isLoggedIn, asyncWrap(async (req, res) => {
    const { topic, title, content } = req.body;
    const blog = new Blog({ topic, title, content, author: req.user._id });
    await blog.save();
    req.flash('success', 'Blog created successfully');
    res.redirect('/blogs');
}));

app.put('/blogs/:id', isLoggedIn, isAuthor, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { topic, title, content } = req.body;
    await Blog.findByIdAndUpdate(id, { topic, title, content });
    req.flash('success', 'Blog updated');
    res.redirect('/blogs');
}));

app.delete('/blogs/:id', isLoggedIn, isAuthor, asyncWrap(async (req, res) => {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    req.flash('success', 'Blog deleted');
    res.redirect('/blogs');
}));

// Signup route
app.post('/blogs/signup', asyncWrap(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            req.flash('error', 'All fields are required');
            return res.redirect('/blogs/signup');
        }
        const lowerEmail = email.toLowerCase();
        const existing = await User.findOne({ email: lowerEmail });
        if (existing) {
            req.flash('error', 'Email already registered');
            return res.redirect('/blogs/signup');
        }
        const user = new User({ name, email: lowerEmail });
        const registered = await User.register(user, password);
        req.login(registered, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome!');
            res.redirect('/blogs');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/blogs/signup');
    }
}));

// Login route
app.post('/blogs/login', origUrl, passport.authenticate('local', { failureRedirect: '/blogs/login', failureFlash: true }), async (req, res) => {
    console.log('Login successful! User:', req.user.email);
    req.flash('success', `Welcome back, ${req.user.name}!`);
    res.redirect(res.locals.redirectUrl || '/blogs');
});

// 404 handler for all undefined routes (must be after all other routes)
app.all('/blogs/:any', (req, res, next) => {
    const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
    err.status = 404;
    next(err);
});
// 404 handler for all undefined routes (must be after all other routes)
app.all('/:any', (req, res, next) => {
    const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
    err.status = 404;
    next(err);
});

// Generic error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    // Log for debug
    console.error(err);
    // Render error page
    res.status(status).render('./redirects/error.ejs', { status, message });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});