const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const date = require("../utils/Date");
const WechatNew = require("../models/WeChatNew");
// const College = require("../models/College");
const Profile = require("../models/LeadsProfile.js");
const AmUser = require("../models/AmUser");

// // @route      Get api/lead/:id
// // @desc       get single lead detail
// // @access     private
// router.get("/:id", auth, async (req, res) => {
//   try {
//     const lead = await WechatNew.findById(req.params.id);
//     res.json(lead);
//   } catch (err) {
//     console.log(err);
//   }
// });

// @route      Post api/leadprofile/update/
// @desc       update single profile
// @access     private
router.post("/update", auth, async (req, res) => {
  try {
    const profile = req.body.payload;
    let existProfile = await Profile.findById(profile._id);
    // Get different between two object
    const diff = Object.keys(profile).filter(
      (k) => profile[k] != existProfile[k]
    );
    // Update different to existing object
    diff.forEach((item) => {
      if (item !== "updateDate") existProfile[item] = profile[item];
    });
    existProfile.updateDate = Date.now();
    existProfile.updateDateDisplay = date;
    const user = await AmUser.findById(req.user);
    existProfile.updateDateUser = user.email;
    existProfile.updateDateUserID = user._id;

    await existProfile.save();

    res.json(existProfile);
  } catch (err) {
    console.log(err);
  }
});

// @route      Delete api/leadprofile/delete/:id
// @desc       Delete single profiles and all responding leads
// @access     private
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    profile = await Profile.findById(req.params.id);
    const profileID = profile.ProfileID;

    const leads = await WechatNew.find({ profileID: profileID });
    await WechatNew.deleteMany({ profileID });

    await Profile.deleteOne({ _id: req.params.id });

    res.json({ profile: req.params.id, leads });
  } catch (err) {
    console.log(err);
  }
});

// const someDaysLater = (days) => {
//   const today = new Date();
//   today.setDate(today.getDate() + Number(days));
//   return (
//     today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
//   );
// };

// @route      Get api/leadprofile/wechat/:id
// @desc       get single profile by WechatID
// @access     private
router.get("/wechat/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.find({ wechatId: req.params.id });
    if (profile.length !== 0) {
      const leads = await WechatNew.find({ profileID: profile[0].ProfileID });
      return res.json({ profile, leads });
    } else {
      return res.json(undefined);
    }
  } catch (err) {
    console.log(err);
  }
});

// @route      Get /api/leadprofile/adduser/:id
// @desc       add user to an existing profile
// @access     private
router.get("/adduser/:id", auth, async (req, res) => {
  try {
    let profile = await Profile.find({ ProfileID: req.params.id });
    const user = await AmUser.findById(req.user);
    const newParticipant = { UserID: user._id, UserDisplay: user.email };

    // Update all profiles
    profile = profile[0];
    if (profile.participateUser) {
      profile.participateUser.push(newParticipant);
    } else {
      profile.participateUser = [newParticipant];
    }
    // Update all leads
    let leads = await WechatNew.find({ profileID: req.params.id });
    const processingLeads = new Promise((resolve, reject) => {
      leads.forEach(async (item, index, array) => {
        if (item.participateUser) {
          item.participateUser.push(newParticipant);
        } else {
          // console.log(item);
          item.participateUser = [
            { UserID: user._id, UserDisplay: user.email },
          ];
          // console.log(item);
        }
        await item.save();
        if (index === array.length - 1) resolve();
      });
    });
    processingLeads.then(async () => {
      await profile.save();
      // await leads.save();
      return res.json({ profile, leads });
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
