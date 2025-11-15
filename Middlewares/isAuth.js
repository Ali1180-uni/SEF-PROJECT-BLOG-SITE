const Blog = require('../models/blog');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // store original url so we can redirect after successful login
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be Login first!');
        return res.redirect('/blogs/login');
    }
    next();
}

module.exports.origUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
        req.flash('error', 'Blog not found');
        return res.redirect('/blogs');
    }
    // Ensure user is authenticated before checking ownership
    if (!req.user) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to perform this action');
        return res.redirect('/blogs/login');
    }
    const ownerId = String(blog.author);
    const currUserId = String(req.user._id);
    if (ownerId !== currUserId) {
        req.flash('error', 'You are not authorized to perform this action!');
        return res.redirect('/blogs');
    }
    return next();
}

