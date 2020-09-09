const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

const AmUser = require("../models/AmUser");
const College = require("../models/College");
const date = require("../utils/Date");

// @route     Post api/admin/college/new
// @desc      Add new college
// @access    Private
router.post("/college/new", auth, async (req, res) => {
  try {
    console.log(req.body);

    const name = req.body.name;
    const area = req.body.area;

    const newCollege = new College({
      name,
      area,
      availability: true,
    });

    newCollege.save();

    res.json({ newCollege });
  } catch (error) {
    console.log(error);
  }
});

// @route     Post api/admin/user/new
// @desc      Add new amuser
// @access    Private
router.post("/user/new", auth, async (req, res) => {
  try {
    console.log(req.body);

    const name = req.body.name;
    const area = req.body.area;
    const email = req.body.email;
    const password = req.body.password;

    let user = new AmUser({
      name,
      email,
      password,
      dateDisplay: date,
      status: true,
      area,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json("good");
  } catch (error) {
    console.log(error);
  }
});

// @route     Get api/admin/college/index
// @desc      Get all college from database
// @access    Private
router.get("/college/index", auth, async (req, res) => {
  try {
    const colleges = await College.find({});

    // console.log(colleges);

    res.status(200).json(colleges);
  } catch (error) {
    console.log(error);
  }
});

// @route     Post api/admin/user/college/assign
// @desc      Assign college to user
// @access    Private
router.post("/user/college/assign", auth, async (req, res) => {
  try {
    console.log(req.body);

    const collegeDisplay = req.body.college;
    const email = req.body.email;

    const college = await College.findOne({ name: collegeDisplay });
    const collegeId = college._id;
    const user = await AmUser.findOne({ email });

    user.college.unshift({ collegeId, collegeDisplay });

    await user.save();

    res.status(200).json("good");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
