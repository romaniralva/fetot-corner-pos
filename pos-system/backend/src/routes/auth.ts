import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Employee } from "../models/Employee";
import { Credential } from "../models/Credential";

const router = express.Router();

// =====================
// REGISTER
// =====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, position, contactNo, address, password, role } =
      req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !position ||
      !contactNo ||
      !address ||
      !password ||
      !role
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingCred = await Credential.findOne({ email });
    if (existingCred)
      return res.status(400).json({ message: "Email already registered" });

    // Create Employee
    const employee = new Employee({
      name,
      email,
      position,
      contactNo,
      address,
    });
    await employee.save();

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create Credential
    const credential = new Credential({
      uid: employee._id, // link to employee
      email,
      passwordHash,
      role,
      status: "Active", // default
    });
    await credential.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =====================
// LOGIN
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const credential = await Credential.findOne({ email });
    if (!credential)
      return res.status(400).json({ message: "Invalid credentials" });
    if (credential.status !== "Active")
      return res.status(403).json({ message: "Account not active" });

    const isMatch = await bcrypt.compare(password, credential.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { uid: credential.uid, role: credential.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Send JWT as HttpOnly cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({ success: true, role: credential.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =====================
// LOGOUT
// =====================
router.post("/logout", (_req, res) => {
  res
    .cookie("token", "", { httpOnly: true, maxAge: 0 })
    .json({ success: true, message: "Logged out successfully" });
});

// =====================
// GET CURRENT USER (/me)
// =====================
router.get("/me", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      uid: string;
      role: string;
    };
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;
