const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
// POST /api/auth/register

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //checks user already exists

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    //Hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Viewer",
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });

  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Login user
// POST /api/auth/login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email" });
    }

    // Checks password matches

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Checks user is active

    if (user.status === "Inactive") {
      return res
        .status(403)
        .json({ success: false, message: "Account is inactive" });
    }

    // Generate JWT Token
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({ success: true, token, role: user.role });

  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
