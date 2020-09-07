const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const date = require("../utils/Date");
const WechatNew = require("../models/WeChatNew");
const College = require("../models/College");

// @route      Get api/lead/:id
// @desc       get single lead detail
// @access     private
router.get("/:id", auth, async (req, res) => {
  try {
    const lead = await WechatNew.findById(req.params.id);
    res.json(lead);
  } catch (err) {
    console.log(err);
  }
});

// @route      Post api/lead/update/:id
// @desc       update single lead
// @access     private
router.post("/update/:id", auth, async (req, res) => {
  try {
    const lead = await WechatNew.findById(req.params.id);

    // console.log(req.body);

    const {
      wechat,
      status,
      college,
      grade,
      country,
      keywords,
      note,
    } = req.body;

    const collegeData = College.findOne({ name: college });

    lead.wechatId = wechat;
    lead.status = status;
    lead.grade = grade;
    lead.country = country;
    lead.keywords = keywords;
    lead.otherKeywords = "";
    lead.note = note;
    lead.updateDate = Date.now();
    lead.updateDateDisplay = date;
    lead.college = collegeData._id;
    lead.collegeDisplay = college;

    lead.save();

    res.json(lead);
  } catch (err) {
    console.log(err);
  }
});

// @route      Delete api/lead/delete/:id
// @desc       update single lead
// @access     private
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    await WechatNew.deleteOne({ _id: req.params.id });

    res.json("Success");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
