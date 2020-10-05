const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

const AmUser = require("../models/AmUser");
const College = require("../models/College");
const WechatNew = require("../models/WeChatNew");
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

    res.status(200).json(colleges);
  } catch (error) {
    console.log(error);
  }
});

// @route     Get api/admin/user/index
// @desc      Get all users from database
// @access    Private
router.get("/user/index", auth, async (req, res) => {
  try {
    const amUsers = await AmUser.find({}).select("-password");

    res.status(200).json(amUsers);
  } catch (error) {
    console.log(error);
  }
});

// @route     Get api/admin/lead/index
// @desc      Get all Leads from database
// @access    Private
router.get("/lead/index", auth, async (req, res) => {
  try {
    const allLeads = await WechatNew.find({});

    res.status(200).json(allLeads);
  } catch (error) {
    console.log(error);
  }
});

// @route     Post api/admin/user/college/assign
// @desc      Assign college to user
// @access    Private
router.post("/user/college/assign", auth, async (req, res) => {
  try {
    const collegeDisplay = req.body.college;
    const email = req.body.email;

    const college = await College.findOne({ name: collegeDisplay });
    const collegeId = college._id;
    const user = await AmUser.findOne({ email }).select("-password");

    user.college.unshift({ collegeId, collegeDisplay });

    await user.save();

    res.status(200).json("good");
  } catch (error) {
    console.log(error);
  }
});

// @route     Get api/admin/user/report
// @desc      Get all Leads from database
// @access    Private
router.get("/user/report", auth, async (req, res) => {
  try {
    const lead = await WechatNew.find({});
    const user = await AmUser.find({}).select("-password");

    let users = {};
    var processingUsers = new Promise((resolve, reject) => {
      user.forEach((value, index, array) => {
        users[value.email] = {
          id: value._id,
          name: value.name,
          totalLeads: 0,
          已购买: 0,
          无意向购买: 0,
          未购买: 0,
          国内: 0,
          美国: 0,
        };
        if (index === array.length - 1) resolve();
      });
    });

    processingUsers.then(() => {
      var processingLeads = new Promise((resolve, reject) => {
        // console.log("enter");
        lead.forEach((value, index, array) => {
          users[value.amUserDisplay].totalLeads =
            users[value.amUserDisplay].totalLeads + 1;
          users[value.amUserDisplay][value.status] =
            users[value.amUserDisplay][value.status] + 1;
          users[value.amUserDisplay][value.country] =
            users[value.amUserDisplay][value.country] + 1;
          // console.log(users);
          if (index === array.length - 1) resolve();
        });
      });

      processingLeads.then(async () => {
        // console.log(users);
        let payload = [];
        Object.keys(users).forEach((value) => {
          payload = [...payload, users[value]];
        });
        // console.log(payload);
        res.status(200).json(payload);
      });
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
