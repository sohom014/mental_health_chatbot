require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");

const app = express();
connectDB();

// ✅ Middleware (put before routes)
app.use(cors());
app.use(express.json()); // 👈 This should come before route handlers
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
app.use('/api/auth', authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);

// Add this with your other route imports
const adminRoutes = require('./routes/adminRoutes');

// Add this with your other route registrations
app.use('/api/admin', adminRoutes);
/*
const adminEmail = 'sohom021014@gmail.com';
const User = require('./models/User');
async function makeAdmin() {
  try {
    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      { isAdmin: true },
      { new: true }
    );
    console.log(`User ${user.username} is now an admin`);
  } catch (err) {
    console.error('Error making admin:', err);
  }
}
makeAdmin();
*/
// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✅ Server running at: http://localhost:${PORT}\n`);
});
