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

const userTransfer = async () => {
  //
  //
  // Bella
  //
  //
  // const ucsb = await College.findOne({
  //   name: "University of California, Santa Barbara",
  // });
  const bella = await AmUser.findOne({ email: "lmyang@smcovered.com" });
  // const newucsb = {
  //   collegeId: ucsb._id,
  //   collegeDisplay: ucsb.name,
  // };
  // // console.log(newucsb);
  // bella.college.push(newucsb);
  // await bella.save();
  // console.log(bella);

  const bellaNeedProfile = await Profile.find({
    college: "5f58992f1051e29cabd6e561",
    createdUser: "zchu@smcovered.com",
  });
  // console.log(bellaNeedProfile);

  // const processing = new Promise((resolve, reject) => {
  //   bellaNeedProfile.forEach(async (item, index, array) => {
  //     const addUser = {
  //       UserID: bella._id,
  //       UserDisplay: bella.email,
  //     };
  //     item.participateUser.push(addUser);
  //     await item.save();

  //     if (index === array.length - 1) resolve();
  //   });
  // });

  // processing.then(() => console.log("finished!"));

  // const bellaNeedLeads = await Lead.find({
  //   college: "5f58992f1051e29cabd6e561",
  //   amUserDisplay: "zchu@smcovered.com",
  // });
  // console.log(bellaNeedLeads.length);
  // const processing = new Promise((resolve, reject) => {
  //   bellaNeedLeads.forEach(async (item, index, array) => {
  //     const addUser = {
  //       UserID: bella._id,
  //       UserDisplay: bella.email,
  //     };
  //     item.participateUser.push(addUser);
  //     await item.save();

  //     if (index === array.length - 1) resolve();
  //   });
  // });

  // processing.then(() => console.log("finished!"));

  //
  //
  // zhuzhu
  //
  //
  const miis = await College.findOne({
    name: "Middlebury Institute of International Studies",
  });
  const zhu = await AmUser.findOne({ email: "tzhu@smcovered.com" });
  // console.log(miis);
  // console.log(zhu);

  // const newmiis = {
  //   collegeId: miis._id,
  //   collegeDisplay: miis.name,
  // };
  // zhu.college.push(newmiis);
  // await zhu.save();

  // const zhuNeedProfile = await Profile.find({
  //   college: miis._id,
  //   createdUser: "zchu@smcovered.com",
  // });
  // // console.log(zhuNeedProfile);

  // const processing = new Promise((resolve, reject) => {
  //   zhuNeedProfile.forEach(async (item, index, array) => {
  //     const addUser = {
  //       UserID: zhu._id,
  //       UserDisplay: zhu.email,
  //     };
  //     item.participateUser = [];
  //     item.participateUser.push(addUser);
  //     await item.save();

  //     if (index === array.length - 1) resolve();
  //   });
  // });

  // processing.then(() => console.log("finished!"));

  // const zhuNeedLeads = await Lead.find({
  //   college: miis._id,
  //   amUserDisplay: "zchu@smcovered.com",
  // });
  // console.log(zhuNeedLeads.length);
  // const processing = new Promise((resolve, reject) => {
  //   zhuNeedLeads.forEach(async (item, index, array) => {
  //     const addUser = {
  //       UserID: zhu._id,
  //       UserDisplay: zhu.email,
  //     };
  //     item.participateUser = [];
  //     item.participateUser.push(addUser);
  //     await item.save();

  //     if (index === array.length - 1) resolve();
  //   });
  // });

  // processing.then(() => console.log("finished!"));

  //
  //
  // hui
  //
  //
  const ucsc = await College.findOne({
    name: "University of California, Santa Cruz",
  });
  const hui = await AmUser.findOne({ email: "hli@smcovered.com" });
  // console.log(ucsc);
  // console.log(hui);

  // const newucsc = {
  //   collegeId: ucsc._id,
  //   collegeDisplay: ucsc.name,
  // };
  // hui.college.push(newucsc);
  // await hui.save();

  // const huiNeedProfile = await Profile.find({
  //   college: ucsc._id,
  //   createdUser: "zchu@smcovered.com",
  // });
  // console.log(huiNeedProfile.length);

  // const processing = new Promise((resolve, reject) => {
  //   huiNeedProfile.forEach(async (item, index, array) => {
  //     const addUser = {
  //       UserID: hui._id,
  //       UserDisplay: hui.email,
  //     };
  //     item.participateUser = [];
  //     item.participateUser.push(addUser);
  //     await item.save();

  //     if (index === array.length - 1) resolve();
  //   });
  // });
  // processing.then(() => console.log("finished!"));

  // const huiNeedLeads = await Lead.find({
  //   college: ucsc._id,
  //   amUserDisplay: "zchu@smcovered.com",
  // });
  // console.log(huiNeedLeads.length);

  // const processing = new Promise((resolve, reject) => {
  //   huiNeedLeads.forEach(async (item, index, array) => {
  //     const addUser = {
  //       UserID: hui._id,
  //       UserDisplay: hui.email,
  //     };
  //     item.participateUser = [];
  //     item.participateUser.push(addUser);
  //     await item.save();

  //     if (index === array.length - 1) resolve();
  //   });
  // });
  // processing.then(() => console.log("finished!"));

  //
  //
  // shaozhen
  //
  //
  const stanford = await College.findOne({
    name: "Stanford University",
  });
  const sz = await AmUser.findOne({ email: "szjin@smcovered.com" });
  // console.log(stanford);
  // console.log(sz);

  // const newstanford = {
  //   collegeId: stanford._id,
  //   collegeDisplay: stanford.name,
  // };
  // sz.college.push(newstanford);
  // await sz.save();
  // console.log(sz);

  // const szNeedProfile = await Profile.find({
  //   college: stanford._id,
  //   createdUser: "zchu@smcovered.com",
  // });
  // console.log(szNeedProfile.length);

  // const processing = new Promise((resolve, reject) => {
  //   szNeedProfile.forEach(async (item, index, array) => {
  //     const addUser = {
  //       UserID: sz._id,
  //       UserDisplay: sz.email,
  //     };
  //     item.participateUser = [];
  //     item.participateUser.push(addUser);
  //     await item.save();

  //     if (index === array.length - 1) resolve();
  //   });
  // });
  // processing.then(() => console.log("finished!"));

  // const szNeedLeads = await Lead.find({
  //   college: stanford._id,
  //   amUserDisplay: "zchu@smcovered.com",
  // });
  // console.log(szNeedLeads.length);

  // const processing = new Promise((resolve, reject) => {
  //   szNeedLeads.forEach(async (item, index, array) => {
  //     const addUser = {
  //       UserID: sz._id,
  //       UserDisplay: sz.email,
  //     };
  //     item.participateUser = [];
  //     item.participateUser.push(addUser);
  //     await item.save();

  //     if (index === array.length - 1) resolve();
  //   });
  // });
  // processing.then(() => console.log("finished!"));
};

module.exports = {
  profileGenerator,
  leadsUpdateCheck,
  amUserModification,
  kpi,
  userTransfer,
};
