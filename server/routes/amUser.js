const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const AmUser = require("../models/AmUser");
const BasicUser = require("../models/BasicUser");
const College = require("../models/College");
const date = require("../utils/Date");
const WechatNew = require("../models/WeChatNew");
const Profile = require("../models/LeadsProfile");

// Upload new lead & profile to database
const newProfile = async (wechatId, college, grade, country, req, res) => {
  try {
    const user = await AmUser.findById(req.user);
    let collegeID = await College.findOne({ name: college });
    collegeID = collegeID._id;

    // Creat profile ID
    const amEmail = user.email;
    const p1 = date.split("-").join("");
    const p2 = wechatId;
    const p3 = amEmail.split("@")[0];
    const ProfileID = p1 + "_" + p2 + "_" + p3;

    let profile = new Profile({
      ProfileID,
      wechatId,
      createdDateDisplay: date,
      updateDateDisplay: date,
      college: collegeID,
      collegeDisplay: college,
      country,
      grade,
      createdUser: amEmail,
      createdUserID: req.user,
    });

    await profile.save();
    return profile;
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errors: [{ msg: error }] });
  }
};

// Upload new lead without profile to database
const newLead = async (
  wechatId,
  status,
  college,
  keywords,
  grade,
  country,
  otherKeywords,
  note,
  intention,
  req,
  res,
  profileID
) => {
  // 计算follow up时间
  // intention 1=7天后 2=3天后 2=2天后
  let afterDays = "";
  let followUpDate = "";

  if (intention === 1) afterDays = "7";
  else if (intention === 2) afterDays = "3";
  else if (intention === 3) afterDays = "2";
  if (afterDays) followUpDate = someDaysLater(afterDays);

  let followUp = false;
  if (intention) {
    followUp = true;
  }

  if (wechatId === "") {
    return res.status(400).json({ errors: [{ msg: "请填写微信号！" }] });
  }
  if (status === "") {
    return res.status(400).json({ errors: [{ msg: "请选择状态！" }] });
  }
  if (college === "") {
    return res.status(400).json({ errors: [{ msg: "请选择学校！" }] });
  }

  let keywordString = "";
  if (keywords) {
    keywordString = keywords.join(" ");
  }

  try {
    const user = await AmUser.findById(req.user);
    // const group = await Group.findOne({ collegeDisplay: college });
    const collegeID = await College.findOne({ name: college });
    // console.log(profileID);
    const wechatNew = new WechatNew({
      wechatId,
      status,
      amUser: user.id,
      amUserDisplay: user.email,
      college: collegeID,
      collegeDisplay: college,
      // group,
      // groupDisplay: group.name,
      keywords: keywordString,
      otherKeywords,
      country,
      grade,
      note,
      createdDateDisplay: date,
      updateDateDisplay: date,
      intention,
      followUpDate,
      followUp,
      profileID,
    });

    // Check if new leads belongs to others profile
    if (!req.body.makeProfile) {
      const profile = await Profile.findOne({ ProfileID: profileID });
      if (profile.createdUserID !== req.user) {
        wechatNew.participateUser = [
          { UserID: profile.createdUserID, UserDisplay: profile.createdUser },
        ];
      }
    }

    await wechatNew.save();

    // console.log(wechatNew);

    return wechatNew;
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errors: [{ msg: error }] });
  }
};

// @route      Get api/am/basic/index
// @desc       get all ambassador belong to current am
// @access     private
router.get("/basic/index", auth, async (req, res) => {
  try {
    const am = await AmUser.findById(req.user).select("-password");
    const basicList = am.basic;
    let basics = [];
    // console.log(basicList)

    var bar = new Promise((resolve, reject) => {
      basicList.forEach(async (e) => {
        let basic = await BasicUser.findById(e.basicId);
        basics.push(basic);
        if (basicList.length === basics.length) resolve();
      });
    });

    bar.then(() => {
      // console.log(basics)
      res.json({ basics });
    });
  } catch (error) {
    return res.status(400).json({ errors: [{ msg: error }] });
  }
});

module.exports = router;

// @route     Post api/am/basic/new
// @desc      Add new ambassador
// @access    Private
router.post(
  "/basic/new",
  auth,
  [
    check("email", "请输入正确的邮箱！").isEmail(),
    check("password", "请输入密码！").notEmpty(),
    check("name", "请输入校园大使姓名！").notEmpty(),
    check("college", "请选择学校！").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { email, password, name, college } = req.body;

      const basic = await BasicUser.findOne({ email });
      if (basic) {
        return res.status(400).json({ errors: [{ msg: "该邮箱已经存在！" }] });
      }

      const am = await AmUser.findById(req.user).select("-password");
      const area = am.area;

      const collegeDisplay = college;
      college = await College.findOne({ name: college });
      college = college._id;

      let user = new BasicUser({
        name,
        email,
        password,
        dateDisplay: date,
        status: true,
        college,
        collegeDisplay,
        area,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      user = await BasicUser.findOne({ email });
      am.basic.unshift({
        basicId: user._id,
        basicDisplay: user.name,
      });

      await am.save();

      res.json({ user });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ errors: [{ msg: error }] });
    }
  }
);

// @route      Post api/am/lead/new
// @desc       add new wechat lead account to database
// @access     private
router.post("/lead/new", auth, async (req, res) => {
  const wechatId = req.body.wechat;
  const status = req.body.status;
  const college = req.body.college;
  let keywords = req.body.checkedItem;
  const grade = req.body.grade;
  const country = req.body.country;
  const otherKeywords = req.body.otherKeywords;
  const note = req.body.note;
  let intention = req.body.intention;
  const makeProfile = req.body.makeProfile;
  const profileID = req.body.ProfileID;

  let wechatNew;
  if (makeProfile) {
    profileNew = await newProfile(wechatId, college, grade, country, req, res);
    wechatNew = await newLead(
      wechatId,
      status,
      college,
      keywords,
      grade,
      country,
      otherKeywords,
      note,
      intention,
      req,
      res,
      profileNew.ProfileID
    );

    res.json({ justNewLead: false, wechatNew, profileNew });
  } else {
    wechatNew = await newLead(
      wechatId,
      status,
      college,
      keywords,
      grade,
      country,
      otherKeywords,
      note,
      intention,
      req,
      res,
      profileID
    );

    res.json({ justNewLead: true, wechatNew });
  }
});

// @route      Get /api/am/lead/index
// @desc       get all wechat lead account belong to current user
// @access     private
router.get("/lead/index", auth, async (req, res) => {
  try {
    let wechats = await WechatNew.find({ amUser: req.user });
    let otherWechats = await WechatNew.find({
      "participateUser.UserID": req.user,
    });
    wechats = wechats.concat(otherWechats);
    // wechats.sort(function (a, b) {
    //   return b.updateDateDisplay - a.updateDateDisplay;
    // });
    // console.log(wechats);
    wechats.reverse();

    res.json({ wechats });
  } catch (error) {
    return res.status(400).json({ errors: [{ msg: error }] });
  }
});

// @route      Get/api/am/college/index/:id
// @desc       get all colleges belong to current user
// @access     private
router.get("/college/index/", auth, async (req, res) => {
  try {
    const user = await AmUser.findById(req.user);

    const colleges = user.college;

    res.json(colleges);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errors: [{ msg: error }] });
  }
});

// router.get("/", auth, (req, res) => {
//   res.send("ok");
// });

const someDaysLater = (days) => {
  const today = new Date();
  today.setDate(today.getDate() + Number(days));
  return (
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  );
};

// @route      Get /api/am/profiles/index
// @desc       get all profiles belong to current user
// @access     private
router.get("/profiles/index", auth, async (req, res) => {
  try {
    let profiles = await Profile.find({ createdUserID: req.user });
    let otherProfiles = await Profile.find({
      "participateUser.UserID": req.user,
    });
    profiles = profiles.concat(otherProfiles);
    profiles.reverse();
    res.json({ profiles });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errors: [{ msg: error }] });
  }
});

// @route      Post /api/am/setting
// @desc       Change user setting
// @access     private
router.post("/setting", auth, async (req, res) => {
  const { name, preference } = req.body;
  let user = await AmUser.findById(req.body._id);
  user.name = name;
  user.preference.table.paginationRows = preference.table.paginationRows;
  await user.save();
  res.json("Success!");
});

// @route      Get /api/am/statistic
// @desc       Get data statistc
// @access     private
router.get("/statistic", auth, async (req, res) => {
  let wechats = await WechatNew.find({ amUser: req.user });
  let otherWechats = await WechatNew.find({
    "participateUser.UserID": req.user,
  });
  wechats = wechats.concat(otherWechats);
  leadsStatistic(wechats, res);
});

const leadsStatistic = (wechats, res) => {
  let collegeDistribution = {};
  const collegeDistributionProcessing = new Promise((resolve, reject) => {
    wechats.forEach((item, index, array) => {
      if (item.collegeDisplay) {
        collegeDistribution[item.collegeDisplay] =
          (collegeDistribution[item.collegeDisplay] || 0) + 1;
      }
      // console.log(collegeDistribution);
      if (index === array.length - 1) resolve();
    });
  });
  collegeDistributionProcessing
    .then(() => {
      // console.log(collegeDistribution);
      return res.json({ collegeDistribution });
    })
    .catch((err) => {
      console.log(err);
    });
};

// @route      Get /api/am/weeklyreport/leader
// @desc       Get president user weekly report
// @access     private
router.get("/weeklyreport/leader", auth, async (req, res) => {
  try {
    const allSum = {};
    const amSum = {};

    const userList = {};
    const am = await AmUser.find({});
    am.forEach(async (item) => {
      userList[item._id] = item.name;

      allSum[item.name] = {};
      allSum[item.name].total = 0;
      allSum[item.name].thisWeek = 0;

      amSum[item.name] = {};
      item.college.forEach((co) => {
        amSum[item.name][co.collegeDisplay] = {};

        amSum[item.name][co.collegeDisplay].college = co.collegeDisplay;
        amSum[item.name][co.collegeDisplay].collegeID = co.collegeId;
        amSum[item.name][co.collegeDisplay].total = 0;
        amSum[item.name][co.collegeDisplay].thisWeek = 0;
      });
    });

    // console.log(allSum);

    // const leads = await WechatNew.find({});
    const Profiles = await Profile.find();
    const thisWeek = ISO8601_week_no(new Date());

    // leads.forEach((item) => {
    //   allSum[userList[item.amUser]].total++;
    //   amSum[userList[item.amUser]][item.collegeDisplay].total++;

    //   if (ISO8601_week_no(item.updateDate) === thisWeek) {
    //     allSum[userList[item.amUser]].thisWeek++;
    //     amSum[userList[item.amUser]][item.collegeDisplay].thisWeek++;
    //   }
    // });

    // console.log(allSum);
    // console.log(amSum);

    Profiles.forEach((item) => {
      allSum[userList[item.createdUserID]].total++;
      if (amSum[userList[item.createdUserID]][item.collegeDisplay])
        amSum[userList[item.createdUserID]][item.collegeDisplay].total++;

      if (
        item.updateDateUserID &&
        item.updateDateUserID !== item.createdUserID
      ) {
        allSum[userList[item.updateDateUserID]].total++;
        amSum[userList[item.updateDateUserID]][item.collegeDisplay].total++;
      }

      if (ISO8601_week_no(item.updateDate) === thisWeek) {
        allSum[userList[item.createdUserID]].thisWeek++;
        if (amSum[userList[item.createdUserID]][item.collegeDisplay])
          amSum[userList[item.createdUserID]][item.collegeDisplay].thisWeek++;

        if (
          item.updateDateUserID &&
          item.updateDateUserID !== item.createdUserID
        ) {
          allSum[userList[item.updateDateUserID]].thisWeek++;
          amSum[userList[item.updateDateUserID]][item.collegeDisplay]
            .thisWeek++;
        }
      }
    });

    // console.log(allSum);
    // console.log(amSum);

    const kpiAllSum = [];
    Object.keys(allSum).forEach((item) => {
      const newRecord = {
        name: item,
        thisWeek: allSum[item].thisWeek,
        total: allSum[item].total,
      };
      kpiAllSum.push(newRecord);
    });
    kpiAllSum.sort((a, b) => b.thisWeek - a.thisWeek);

    const kpiAmSum = {};
    Object.keys(amSum).forEach((am) => {
      kpiAmSum[am] = [];
      Object.keys(amSum[am]).forEach((uni) => {
        const newRecord = {
          name: uni,
          total: amSum[am][uni].total,
          thisWeek: amSum[am][uni].thisWeek,
        };
        kpiAmSum[am].push(newRecord);
      });
      kpiAmSum[am].sort((a, b) => b.thisWeek - a.thisWeek);
    });

    return res.json({ kpiAllSum, kpiAmSum });
  } catch (err) {
    console.log(err);
  }
});

function ISO8601_week_no(dt) {
  var tdt = new Date(dt.valueOf());
  var dayn = (dt.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  var firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

// @route      Get /api/am/weeklyreport/basic
// @desc       Get basic am user weekly report
// @access     private
router.get("/weeklyreport/basic", auth, async (req, res) => {
  try {
    const user = await AmUser.findById(req.user);
    const allColleges = user.college;
    let allLeads = await WechatNew.find({ amUser: req.user });
    let otherWechats = await WechatNew.find({
      "participateUser.UserID": req.user,
    });
    allLeads = allLeads.concat(otherWechats);

    const sum = {};
    allColleges.forEach((item) => {
      sum[item.collegeDisplay] = {
        thisWeek: 0,
        total: 0,
      };
    });
    const thisWeek = ISO8601_week_no(new Date());
    allLeads.forEach((lead) => {
      if (sum[lead.collegeDisplay]) sum[lead.collegeDisplay].total++;
      if (ISO8601_week_no(lead.updateDate) === thisWeek) {
        if (sum[lead.collegeDisplay]) sum[lead.collegeDisplay].thisWeek++;
      }
    });
    const sumTable = [];
    Object.keys(sum).forEach((item) => {
      const newRecord = {
        name: item,
        total: sum[item].total,
        thisWeek: sum[item].thisWeek,
      };
      sumTable.push(newRecord);
    });

    sumTable.sort((a, b) => b.thisWeek - a.thisWeek);

    return res.json({ sumTable });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
