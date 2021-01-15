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
    const am = await AmUser.find({});
    const userList = {};
    am.forEach((item) => {
      userList[item._id] = item.name;
    });

    const leads = await Lead.find({});

    const thisWeek = ISO8601_week_no(new Date());

    let count = 0;
    const updated = {};
    const check = new Promise((resolve) => {
      leads.forEach(async (item, index, array) => {
        if (ISO8601_week_no(item.updateDate) === thisWeek) {
          const name = userList[item.amUser];
          updated[name] =
            typeof updated[name] === "number" ? updated[name] + 1 : 0;
          count++;
        }
        if (index === array.length - 1) resolve();
      });
    });
    check.then(() => {
      console.log(updated);
      console.log("total: ", count);
    });
  } catch (err) {
    console.log(err);
  }
};

const amUserModification = async () => {
  // const amUser = await AmUser.find({ email: "yli@smcovered.com" });
  // amUser[0].presidentUser = true;
  // await amUser[0].save();
  // const processing = new Promise((resolve, reject) => {
  //   amUser.forEach(async (item, index, array) => {
  //     item.preference.table.paginationRows = 10;
  //     await item.save();
  //     if (index === array.length - 1) resolve();
  //   });
  // });
  // processing.then(async () => {
  //   console.log("done!");
  // });
};

const kpi = async () => {
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

  const leads = await WechatNew.find({});
  const thisWeek = ISO8601_week_no(new Date());

  leads.forEach((item) => {
    allSum[userList[item.amUser]].total++;
    amSum[userList[item.amUser]][item.collegeDisplay].total++;

    if (ISO8601_week_no(item.updateDate) === thisWeek) {
      allSum[userList[item.amUser]].thisWeek++;
      amSum[userList[item.amUser]][item.collegeDisplay].thisWeek++;
    }
  });
};

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

module.exports = {
  profileGenerator,
  leadsUpdateCheck,
  amUserModification,
  kpi,
};
