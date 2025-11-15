const mongoose = require('mongoose');
const Blog = require('./blog');
const User = require('./user');

// User data - passwords will be hashed by passport-local-mongoose
const usersData = [
  {
    name: "Ali Rahman",
    email: "ali@example.com",
    password: "password123"
  },
  {
    name: "Sara Khan",
    email: "sara@example.com",
    password: "password123"
  },
  {
    name: "Admin User",
    email: "admin@blogify.com",
    password: "admin123"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/blogify");
    console.log("✅ Database connected");

    console.log("🔄 Clearing existing data...");
    await User.deleteMany({});
    await Blog.deleteMany({});

    console.log("👤 Creating users...");
    const createdUsers = [];
    
    // Register each user using passport-local-mongoose's register method
    for (const userData of usersData) {
      const user = new User({ 
        name: userData.name, 
        email: userData.email 
      });
      const registered = await User.register(user, userData.password);
      console.log(`   DEBUG: Has hash: ${!!registered.hash}, Has salt: ${!!registered.salt}`);
      createdUsers.push(registered);
      console.log(`   ✓ ${userData.name} created`);
    }

    console.log("📝 Creating blogs...");
    const blogs = [
      {
        title: "The Future of AI in Everyday Life",
        topic: "Technology",
        content: "Artificial Intelligence is transforming the way we live. From virtual assistants to self-driving cars, the future is AI-driven.",
        author: createdUsers[0]._id,
        likes: [createdUsers[1]._id]
      },
      {
        title: "10 Tips for Maintaining Mental Health",
        topic: "Health",
        content: "In today's busy world, mental health is as important as physical health. Here are 10 practical tips for staying positive and calm.",
        author: createdUsers[1]._id,
        likes: [createdUsers[0]._id, createdUsers[2]._id]
      },
      {
        title: "Mastering JavaScript in 2025",
        topic: "Programming",
        content: "JavaScript continues to dominate web development. ES2025 introduces new features that make coding cleaner and faster.",
        author: createdUsers[0]._id,
        likes: [createdUsers[1]._id]
      },
      {
        title: "The Power of Morning Routines",
        topic: "Lifestyle",
        content: "Starting your day with a healthy routine can drastically improve productivity and happiness. Let's explore some simple habits.",
        author: createdUsers[1]._id,
        likes: [createdUsers[0]._id]
      }
    ];

    await Blog.insertMany(blogs);
    console.log(`   ✓ ${blogs.length} blogs created`);
    
    console.log("\n✅ Seed data inserted successfully!");
    console.log("\n📧 Test Accounts:");
    console.log("   User 1: ali@example.com / password123");
    console.log("   User 2: sara@example.com / password123");
    console.log("   Admin:  admin@blogify.com / admin123\n");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seedDatabase();
