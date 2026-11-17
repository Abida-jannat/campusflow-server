const express = require("express");
const { getDb } = require("../db");

const router = express.Router();

const ALLOWED_ROLES = ["student", "teacher"];
const text = (value, max = 100) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

// POST /users  - save a user profile.
// Only whitelisted fields are stored (the old code inserted whatever the caller
// sent, including any "role", and printed it to the logs).
router.post("/", async (req, res, next) => {
  try {
    const name = text(req.body.name);
    const email = text(req.body.email, 200).toLowerCase();

    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "A valid name and email are required" });
    }

    const users = getDb().collection("users");

    const user = {
      name,
      email,
      role: ALLOWED_ROLES.includes(req.body.role) ? req.body.role : "student",
      department: text(req.body.department),
      semester: text(req.body.semester, 20),
      studentId: text(req.body.studentId, 50),
      createdAt: new Date(),
    };


    const result = await users.updateOne(
      { email },
      { $setOnInsert: user },
      { upsert: true }
    );

    if (result.upsertedCount === 0) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    res.status(201).json({
      success: true,
      message: "User saved successfully",
      insertedId: result.upsertedId,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
