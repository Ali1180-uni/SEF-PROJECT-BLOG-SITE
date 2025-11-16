# 📝 Blogify - Modern Blog Platform

![Node.js](https://img.shields.io/badge/Node.js-v22.17.1-green)
![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)

A full-stack blog application built with Node.js, Express, MongoDB, and EJS. Features include user authentication, authorization, CRUD operations for blogs, and a beautiful responsive UI.

## 🎓 Project Information

- **Course**: Software Engineering Fundamentals (SEF)
- **Semester**: 3rd Semester
- **Authors**: Ali Rahman & Group
- **Institution**: NTU

---

## 🌟 Features

### Authentication & Authorization
- ✅ **User Registration** - Sign up with name, email, and password
- ✅ **User Login** - Secure authentication with Passport.js
- ✅ **Password Security** - Passwords hashed using passport-local-mongoose
- ✅ **Session Management** - Persistent sessions with MongoDB store
- ✅ **Protected Routes** - Middleware-based route protection
- ✅ **Authorization** - Users can only edit/delete their own blogs

### Blog Management
- ✅ **Create Blogs** - Write and publish blog posts with title, topic, and content
- ✅ **View All Blogs** - Browse all published blogs on the homepage
- ✅ **Edit Blogs** - Update your own blog posts
- ✅ **Delete Blogs** - Remove your own blog posts
- ✅ **Author Attribution** - Each blog shows author information
- ✅ **Timestamps** - Display creation date and time for each blog

### User Experience
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Flash Messages** - Bootstrap-styled success/error notifications
- ✅ **Dynamic Navbar** - Shows login/signup or welcome message with logout
- ✅ **Conditional UI** - Edit/delete buttons only visible to blog owners
- ✅ **Login Redirects** - Redirects users to intended page after login
- ✅ **Form Validation** - Client-side and server-side validation

### UI/UX Features
- ✅ **Modern Design** - Clean, professional interface with custom fonts
- ✅ **Smooth Animations** - CSS transitions and hover effects
- ✅ **Icon Integration** - Font Awesome icons throughout the app
- ✅ **Custom Styling** - Beautiful gradients and color schemes
- ✅ **404 Error Page** - Custom error handling with styled error pages

---

## 🛠️ Tech Stack

### Backend
- **Node.js** (v22.17.1) - JavaScript runtime
- **Express.js** (5.1.0) - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** (8.19.1) - MongoDB ODM

### Authentication
- **Passport.js** (0.7.0) - Authentication middleware
- **passport-local** (1.0.0) - Local authentication strategy
- **passport-local-mongoose** - Mongoose plugin for Passport
- **express-session** (1.18.2) - Session management
- **connect-mongo** (5.1.0) - MongoDB session store
- **connect-flash** (0.1.1) - Flash message middleware

### Frontend
- **EJS** (3.1.10) - Templating engine
- **ejs-mate** (4.0.0) - Layout support for EJS
- **Bootstrap** (5.3.7) - CSS framework
- **Font Awesome** (6.4.2) - Icon library
- **Google Fonts** - Playfair Display & Inter fonts

### Additional Tools
- **method-override** - HTTP verb support (PUT, DELETE)
- **dotenv** (17.2.3) - Environment variable management
- **bcrypt** (6.0.0) - Password hashing
- **nodemon** - Development auto-restart

---

## 📁 Project Structure

```
MODEL PROJECT (BLOG SITE)/
│
├── index.js                    # Main application entry point
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (not in repo)
├── .gitignore                  # Git ignore rules
│
├── models/                     # Database models
│   ├── user.js                 # User schema with passport-local-mongoose
│   ├── blog.js                 # Blog schema with author reference
│   └── init.js                 # Database seeder script
│
├── Middlewares/                # Custom middleware
│   └── isAuth.js               # Authentication & authorization middleware
│
├── Error Class/                # Custom error classes
│   └── Error.js                # Error handling utilities
│
├── views/                      # EJS templates
│   ├── includes/
│   │   └── boilerplate.ejs     # Main layout template
│   ├── layouts/
│   │   ├── navbar.ejs          # Navigation bar component
│   │   ├── footer.ejs          # Footer component
│   │   └── flash.ejs           # Flash message component
│   └── redirects/
│       ├── Home.ejs            # Homepage with blog list
│       ├── Login.ejs           # Login page
│       ├── signUp.ejs          # Registration page
│       ├── newBlog.ejs         # Create blog page
│       ├── editBlog.ejs        # Edit blog page
│       ├── About.ejs           # About page
│       └── error.ejs           # Custom error page
│
└── public/                     # Static assets
    ├── Image/
    │   └── icon.png            # Site logo/icon
    ├── Style/
    │   └── style.css           # Custom CSS (788 lines)
    └── JS/
        └── form-validation.js  # Client-side validation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v22.x or higher)
- MongoDB (v6.x or higher)
- npm (comes with Node.js)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ali1180-uni/SEF-PROJECT-BLOG-SITE.git
cd "MODEL PROJECT (BLOG SITE)"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory:
```env
SECRET=your_session_secret_key_here
```

### Step 4: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Step 5: Seed the Database (Optional)
Run the seeder to create test users and blogs:
```bash
node models/init.js
```

**Test Accounts Created:**
- **User 1**: ali@example.com / password123
- **User 2**: sara@example.com / password123
- **Admin**: admin@blogify.com / admin123

### Step 6: Start the Application
```bash
# Development mode with nodemon
nodemon index.js

# Production mode
node index.js
```

The application will be available at: **http://localhost:3000**

---

## 📋 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  salt: String (auto-generated by passport-local-mongoose),
  hash: String (auto-generated by passport-local-mongoose),
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Model
```javascript
{
  title: String (required),
  topic: String,
  content: String (required),
  author: ObjectId (ref: 'User', required),
  likes: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow

### Registration Process
1. User submits signup form (name, email, password)
2. System checks if email already exists
3. Password is hashed using passport-local-mongoose
4. User document created in MongoDB
5. User automatically logged in
6. Session created and stored in MongoDB
7. Redirect to homepage with welcome message

### Login Process
1. User submits login form (email, password)
2. Passport authenticates using LocalStrategy
3. Password verified against hash in database
4. User serialized into session
5. Session saved to MongoDB
6. Flash success message
7. Redirect to intended page or homepage

### Authorization Checks
- **isLoggedIn**: Middleware that checks if user is authenticated
- **isAuthor**: Middleware that verifies user owns the blog
- **origUrl**: Middleware that stores original URL for post-login redirect

---

## 🛣️ API Routes

### Public Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Redirect to `/blogs` |
| GET | `/blogs` | Homepage with all blogs |
| GET | `/blogs/login` | Login page |
| GET | `/blogs/signup` | Registration page |
| GET | `/blogs/about` | About page |

### Protected Routes (Authentication Required)
| Method | Route | Description | Authorization |
|--------|-------|-------------|---------------|
| GET | `/blogs/new` | Create blog form | Logged in |
| POST | `/blogs` | Create new blog | Logged in |
| GET | `/blogs/:id/edit` | Edit blog form | Blog owner |
| PUT | `/blogs/:id` | Update blog | Blog owner |
| DELETE | `/blogs/:id` | Delete blog | Blog owner |
| GET | `/blogs/logout` | Logout user | Logged in |

### Authentication Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/blogs/signup` | Register new user |
| POST | `/blogs/login` | Login user |
| GET | `/blogs/logout` | Logout user |

---

## 🎨 UI Components

### Navbar Features
- **Logo & Brand**: Clickable logo with site name
- **Navigation Links**: Home, All Blogs, About
- **Conditional Rendering**:
  - Not logged in: Shows "Login" and "Sign up" buttons
  - Logged in: Shows "Welcome, [name]!" and "Logout" button
- **Responsive**: Collapses to hamburger menu on mobile

### Flash Messages
- **Success Messages**: Green alerts for successful operations
- **Error Messages**: Red alerts for errors
- **Auto-dismiss**: Messages can be closed by user
- **Styled**: Bootstrap alert components with Font Awesome icons

### Blog Cards
- **Topic Badge**: Displays blog category
- **Title & Content**: Blog post details
- **Metadata**: Shows creation date and time
- **Author Info**: References blog author
- **Action Buttons**: Edit/delete buttons (only visible to owner)

---

## 🔧 Middleware Explained

### isLoggedIn
```javascript
// Protects routes requiring authentication
// Stores original URL for post-login redirect
// Flashes error message if not authenticated
```

### isAuthor
```javascript
// Verifies user owns the blog
// Checks blog existence
// Ensures user is authenticated
// Compares author ID with current user ID
```

### origUrl
```javascript
// Saves redirectUrl to res.locals
// Used for redirecting after login
// Preserves intended destination
```

---

## 🎯 Key Implementation Details

### Session Configuration
- **Store**: MongoDB (using connect-mongo)
- **Secret**: Loaded from environment variable
- **Duration**: 7 days (168 hours)
- **Cookie**: HttpOnly for security
- **saveUninitialized**: true for proper session handling

### Password Security
- **Plugin**: passport-local-mongoose
- **Algorithm**: PBKDF2 (built into passport-local-mongoose)
- **Salt**: Automatically generated and stored
- **Hash**: Computed and stored separately
- **Username Field**: Configured to use `email` instead of `username`

### Error Handling
- **asyncWrap**: Catches async errors in route handlers
- **Custom Error Page**: Styled 404 and 500 error pages
- **Flash Messages**: User-friendly error notifications
- **Console Logging**: Errors logged for debugging

---

## 🔒 Security Features

1. **Password Hashing**: All passwords hashed using passport-local-mongoose
2. **Session Security**: HttpOnly cookies, secure session management
3. **MongoDB Injection Protection**: Mongoose sanitizes queries
4. **CSRF Protection**: Flash messages prevent unauthorized actions
5. **Authorization Checks**: Middleware prevents unauthorized access
6. **Email Normalization**: Emails converted to lowercase
7. **Duplicate Prevention**: Unique email constraint in database

---

## 🐛 Common Issues & Solutions

### Issue: "Unable to parse ciphertext object!"
**Solution**: Remove `crypto` option from MongoStore configuration. The session secret provides sufficient security.

### Issue: Login always redirects to login page
**Solution**: Ensure `User.createStrategy()` is used instead of manually configuring passport-local strategy.

### Issue: Flash messages not showing
**Solution**: Verify flash key names match in middleware and templates (use lowercase 'success' and 'error').

### Issue: Edit/delete buttons not showing for owner
**Solution**: Use `.equals()` method or string comparison for ObjectId comparison in EJS templates.

### Issue: Route collision with /blogs/logout
**Solution**: Place specific routes (/blogs/logout, /blogs/new, etc.) BEFORE dynamic routes (/blogs/:id).

---

## 📊 Database Seeding

The `models/init.js` script seeds the database with:
- **3 Users**: Ali Rahman, Sara Khan, Admin User
- **4 Blogs**: Sample blog posts with various topics
- **Relationships**: Blogs linked to authors, likes array populated

**Run seeder:**
```bash
node models/init.js
```

---

## 🎨 Styling & Design

### Color Scheme
- **Primary Navy**: #0f2454
- **Secondary Navy**: #1a3a6b
- **Accent Blue**: #2962ff
- **Light Blue**: #4285f4
- **Success Green**: #10b981

### Fonts
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Features
- Smooth scroll behavior
- Gradient backgrounds
- Hover animations
- Responsive grid layouts
- Card-based blog display

---

## 📝 Future Enhancements

### Planned Features
- [ ] Blog categories and tags
- [ ] Search functionality
- [ ] Like/unlike blogs
- [ ] User profiles with avatar
- [ ] Comment system
- [ ] Rich text editor for blog content
- [ ] Image upload for blogs
- [ ] Pagination for blog list
- [ ] Social media sharing
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Admin dashboard
- [ ] Blog analytics

---

## 🤝 Contributing

This is a semester project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Authors

- **Ali Rahman** - Lead Developer
- **Group Members** - Contributors

**Institution**: National Textile University (NTU)  
**Course**: Software Engineering Fundamentals  
**Semester**: 3rd Semester  
**Year**: 2025

---

## 🙏 Acknowledgments

- Express.js documentation
- Passport.js authentication library
- MongoDB and Mongoose documentation
- Bootstrap framework
- Font Awesome icons
- Google Fonts

---

## 📞 Support

For questions or issues:
- **GitHub Issues**: [Create an issue](https://github.com/Ali1180-uni/SEF-PROJECT-BLOG-SITE/issues)
- **Email**: Contact through GitHub profile

---

## 📸 Screenshots

### Homepage
Browse all blog posts with beautiful card layouts and responsive design.

### Login Page
Secure authentication with email and password, includes flash messages for feedback.

### Create Blog
Simple form interface for creating new blog posts with title, topic, and content.

### Navbar (Logged In)
Dynamic navbar shows welcome message and logout button when authenticated.

### Flash Messages
Bootstrap-styled alerts for success and error messages throughout the application.

---

## 🚦 Testing

### Manual Testing Checklist

#### Authentication
- [x] User can sign up with valid credentials
- [x] User cannot sign up with existing email
- [x] User can login with correct credentials
- [x] User cannot login with incorrect credentials
- [x] User stays logged in after page refresh
- [x] User can logout successfully

#### Blog Operations
- [x] Logged-in user can create blog
- [x] Guest user redirected to login when creating blog
- [x] User can view all blogs
- [x] User can edit their own blogs
- [x] User cannot edit other users' blogs
- [x] User can delete their own blogs
- [x] User cannot delete other users' blogs

#### UI/UX
- [x] Navbar shows correct state based on authentication
- [x] Flash messages display properly
- [x] Forms validate input
- [x] Responsive design works on mobile
- [x] All links work correctly

---

## 🔍 Troubleshooting

### Server won't start
- Check if MongoDB is running
- Verify port 3000 is not in use
- Check .env file exists with SECRET key

### Database connection failed
- Ensure MongoDB service is running
- Check MongoDB URL in index.js (default: localhost:27017/blogify)
- Verify MongoDB is accessible

### Authentication not working
- Clear browser cookies and sessions
- Restart server
- Check session store connection
- Verify User.createStrategy() is used

---

**Built with ❤️ by Ali Rahman and Team for SEF Course Project**

---

*Last Updated: November 16, 2025*
