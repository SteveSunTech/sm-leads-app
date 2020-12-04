const Lead = require("../models/WeChatNew");
const Profile = require("../models/LeadsProfile");
const AmUser = require("../models/AmUser");
const College = require("../models/College");
const date = require("../utils/Date");

const profileGenerator = async () => {
  try {
    const leads = await Lead.find({});
    // console.log(leads.length);
    // let profileIDs = [];

    const asyncFunc = new Promise((resolve, reject) => {
      leads.forEach(async (e, index, array) => {
        let { wechatId, college, collegeDisplay, country, grade } = e;

        if (!college) {
          college = await College.find({ name: collegeDisplay });
          college = college._id;
        }

        let created = e.createdDateDisplay;
        // console.log(created);
        let email = e.amUserDisplay;
        const p1 = created.split("-").join("");
        const p2 = e.wechatId;
        const p3 = email.split("@")[0];
        const ProfileID = p1 + "_" + p2 + "_" + p3;

        let profile = new Profile({
          ProfileID,
          wechatId,
          createdDateDisplay: date,
          updateDateDisplay: date,
          college,
          collegeDisplay,
          country,
          grade,
          createdUser: e.amUserDisplay,
          createdUserID: e.amUser,
        });

        await profile.save();

        // profileCheck = Profile.find({ wechatId: wechatId });
        // console.log(profileCheck);

        // profileIDs.push(ProfileID);
        // let count = 0;
        // const checkProfileDuplicate = new Promise((resolve, reject) => {
        //   profileIDs.forEach((e, index, array) => {
        //     if (e === ProfileID) count++;
        //     if (index === array.length - 1) {
        //       if (count === 1) resolve(true);
        //       else resolve(false);
        //     }
        //   });
        // });
        // checkProfileDuplicate
        //   .then(async (index) => {
        //     if (index) {
        //       let profile = new Profile({
        //         ProfileID,
        //         wechatId,
        //         createdDateDisplay: date,
        //         updateDateDisplay: date,
        //         college,
        //         collegeDisplay,
        //         country,
        //         grade,
        //         createdUser: e.amUserDisplay,
        //         createdUserID: e.amUser,
        //       });

        //       await profile.save();
        //     }
        //   })
        //   .catch((msg) => {
        //     console.log(msg);
        //   });

        // e.profileID = ProfileID;
        // await e.save();

        if (index === array.length - 1) resolve();
      });
    });

    asyncFunc
      .then(() => {
        console.log("completed!");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

const leadsUpdateCheck = async () => {
  try {
    const leads = await Lead.find({});
    let count = 0;
    let college;
    const check = new Promise((resolve, reject) => {
      leads.forEach(async (item, index, array) => {
        if (item.college === undefined) {
          console.log(item.collegeDisplay);
          college = await College.find({ name: item.collegeDisplay });
          console.log(college._id);
          item.college = college._id;
        }
        if (index === array.length - 1) resolve();
      });
    });
    check.then(() => {
      console.log(count);
    });
  } catch (err) {
    console.log(err);
  }
};

const amUserModification = async () => {
  amUser = await AmUser.find({});

  const processing = new Promise((resolve, reject) => {
    amUser.forEach(async (item, index, array) => {
      item.preference.table.paginationRows = 10;
      await item.save();
      if (index === array.length - 1) resolve();
    });
  });
  processing.then(async () => {
    console.log("done!");
  });
};

module.exports = { profileGenerator, leadsUpdateCheck, amUserModification };
