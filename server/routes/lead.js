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
      intention,
    } = req.body;

    // 计算follow up时间
    // intention 1=7天后 2=3天后 2=2天后
    let afterDays = "";

    if (intention === "1") afterDays = "7";
    else if (intention === "2") afterDays = "3";
    else afterDays = "2";

    const followUpDate = someDaysLater(afterDays);
    let followUp = false;
    if (intention) {
      followUp = true;
    }

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
    lead.intention = intention;
    lead.followUpDate = followUpDate;

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

const someDaysLater = (days) => {
  const today = new Date();
  today.setDate(today.getDate() + Number(days));
  return (
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  );
};

module.exports = router;
