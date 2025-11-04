import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Employee } from "../models/Employee";
import { Credential } from "../models/Credential";
import { Role, Status } from "../models/enums";

const router = express.Router();

// ===================== REGISTER =====================
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, position, contactNo, address, password, role } =
      req.body;

    // --- Validate required fields ---
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

    // --- Check existing email ---
    const existing = await Credential.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // --- Generate unique UID and hash password ---
    const uid = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    // --- Create Employee record ---
    await Employee.create({
      uid,
      name,
      email,
      position,
      contactNo,
      address,
    });

    // --- Create Credential record ---
    await Credential.create({
      uid,
      email,
      passwordHash,
      role: role as Role,
      status: Status.Active,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
});

// ===================== LOGIN =====================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // --- Find credential record ---
    const credential = await Credential.findOne({ email });
    if (!credential) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // --- Compare password ---
    const isMatch = await bcrypt.compare(password, credential.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // --- Check status ---
    if (credential.status !== Status.Active) {
      return res.status(403).json({ message: "Account not active" });
    }

    // --- Generate JWT token ---
    const token = jwt.sign(
      { uid: credential.uid, role: credential.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    // --- Return user role for frontend redirect ---
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: credential.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

// ===================== VERIFY TOKEN =====================
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      uid: string;
      role: Role;
    };

    return res
      .status(200)
      .json({ valid: true, uid: decoded.uid, role: decoded.role });
  } catch {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
});

export default router;
