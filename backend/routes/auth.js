const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWTS;

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be Blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res
          .status(400)
          .json({ success, errors: "Email Not Found Kindly Contact Support" });
      }
      const passwordCompare = await bcrypt.compare(password, admin.password);
      if (!passwordCompare) {
        return res.status(401).json({ success, errors: "Wrong Password" });
      }
      const data = {
        admin: {
          id: admin.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error occured");
    }
  }
);

router.post(
  "/createadmin",
  [
    body("name", "Enter a Valid name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //if there are error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(500)
        .json({ msg: "error occurred", errors: errors.array() });
    }

    // check email already exist
    try {
      let admin = await Admin.findOne({ email: req.body.email });
      let adminu = await Admin.findOne({ uname: req.body.uname });
      if (admin) {
        return res.status(400).json({ success, error: "Email Already Exist" });
      } else if (adminu) {
        return res
          .status(400)
          .json({ success, error: "User Name Already Exist" });
      }
      //If email and uname is unique create admin
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      admin = await Admin.create({
        name: req.body.name,
        uname: req.body.uname,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        admin: {
          id: admin.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some Error Occured");
    }
  }
);

module.exports = router;
