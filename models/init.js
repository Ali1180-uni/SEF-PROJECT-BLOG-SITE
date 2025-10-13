const mongoose = require('mongoose');
const Blog = require('./blog');
const User = require('./user');

// Sample data
const users = [
  {
    _id: new mongoose.Types.ObjectId(), // user1
    name: "Ali Rahman",
    email: "ali@example.com",
    password: "hashed_password_1", // (e.g., bcrypt-hashed)
    role: "user"
  },
  {
    _id: new mongoose.Types.ObjectId(), // user2
    name: "Sara Khan",
    email: "sara@example.com",
    password: "hashed_password_2",
    role: "user"
  },
  {
    _id: new mongoose.Types.ObjectId(), // admin
    name: "Admin User",
    email: "admin@blogify.com",
    password: "hashed_admin_password",
    role: "admin"
  }
];

const blogs = [
  {
    title: "The Future of AI in Everyday Life",
    topic: "Technology",
    content: "Artificial Intelligence is transforming the way we live. From virtual assistants to self-driving cars, the future is AI-driven.",
    author: users[0]._id,
    likes: [users[1]._id],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "10 Tips for Maintaining Mental Health",
    topic: "Health",
    content: "In today’s busy world, mental health is as important as physical health. Here are 10 practical tips for staying positive and calm.",
    author: users[1]._id,
    likes: [users[0]._id, users[2]._id],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Mastering JavaScript in 2025",
    topic: "Programming",
    content: "JavaScript continues to dominate web development. ES2025 introduces new features that make coding cleaner and faster.",
    author: users[0]._id,
    likes: [users[1]._id],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "The Power of Morning Routines",
    topic: "Lifestyle",
    content: "Starting your day with a healthy routine can drastically improve productivity and happiness. Let’s explore some simple habits.",
    author: users[1]._id,
    likes: [users[0]._id],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];


mongoose.connect("mongodb://localhost:27017/blogify")
  .then(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const createdUsers = await User.insertMany(users);
    const mappedBlogs = blogs.map(blog => ({
      ...blog,
      author: createdUsers.find(u => u._id.equals(blog.author))._id
    }));

    await Blog.insertMany(mappedBlogs);
    console.log("✅ Fake data inserted successfully!");
    process.exit();
  })
  .catch(err => console.log(err));