import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Employee } from "../models/Employee";
import { Credential } from "../models/Credential";
import { Role, Status } from "../models/enums";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// 🔑 Helper to sign JWT and set cookie
const setAuthCookie = (res: express.Response, payload: object) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    //maxAge: 60 * 60 * 1000, // 1 hour
  });
};

// 🧩 REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, position, contactNo, address, password, role } =
      req.body;

    if (!name || !email || !position || !contactNo || !address || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email exists
    const existing = await Credential.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists." });

    const uid = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    // Create Employee
    const employee = new Employee({
      uid,
      name,
      email,
      position,
      contactNo,
      address,
    });
    await employee.save();

    // Create Credentials
    const credential = new Credential({
      uid,
      email,
      passwordHash,
      role: role || Role.Cashier,
      status: Status.Active,
    });
    await credential.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});
// 🧩 LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  try {
    const credential = await Credential.findOne({ email });
    if (!credential)
      return res.status(401).json({ message: "Invalid credentials." });

    const valid = await bcrypt.compare(password, credential.passwordHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials." });

    if (credential.status !== Status.Active)
      return res.status(403).json({ message: "Account not active." });

    // ✅ Set auth cookie
    setAuthCookie(res, { uid: credential.uid, role: credential.role });

    // ✅ Return user data so frontend can redirect correctly
    res.status(200).json({
      success: true,
      message: "Login successful",
      role: credential.role,
      user: {
        uid: credential.uid,
        email: credential.email,
        status: credential.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// 🧩 ME (get logged-in user info)
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token; // ✅ consistent with setAuthCookie
    if (!token)
      return res.status(401).json({ message: "Unauthorized: No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      uid: string;
      role: Role;
    };

    const employee = await Employee.findOne({ uid: decoded.uid });
    const credential = await Credential.findOne({ uid: decoded.uid });

    if (!employee || !credential)
      return res.status(404).json({ message: "User not found" });

    if (credential.status !== Status.Active)
      return res.status(403).json({ message: "Account not active" });

    res.status(200).json({
      success: true,
      user: {
        uid: credential.uid,
        name: employee.name,
        email: employee.email,
        role: credential.role,
        status: credential.status,
      },
    });
  } catch (err) {
    console.error("Error in /api/auth/me:", err);
    res.status(401).json({ message: "Unauthorized or invalid token" });
  }
});

// 🧩 LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
});

export default router;
