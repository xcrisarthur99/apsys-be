const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sequelize } = require("./models"); // Import sequelize

dotenv.config();
const app = express();

app.use(cors({
  origin: "*",  // alamat frontend
  credentials: true
}));

// Middleware parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Auth
const auth = require("./middleware/authMiddleware");

// Routes
app.use("/api/auth", require("./routes/authRoutes")); // Login tidak pakai auth
app.use("/users", auth, require("./routes/userRoutes"));
app.use("/appointments", auth, require("./routes/appointmentRoutes"));
app.use("/api/participants", auth, require("./routes/appointmentParticipantRoutes"));

// Tes koneksi DB
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected to Railway");

    // Jalankan server setelah DB ready
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ Unable to connect to database:", err);
  });
