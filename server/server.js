const express = require("express");
const app = express();
const connectDB = require("../config/db");
const path = require("path");

// Connect Database
connectDB();

// Init Middleware
// @yuchen
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,X-Requested-With,x-auth-token, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,HEAD,DELETE,OPTIONS"
  );
  next();
});
app.use(express.json({ extended: false }));

// app.get('/', (req,res) =>
//   res.json({ msg: 'Welcome!' })
// );

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/basic", require("./routes/basicUser"));
app.use("/api/am", require("./routes/amUser"));
app.use("/api/lead", require("./routes/lead"));
app.use("/api/admin", require("./routes/adminUser"));

// app.use("/am", require("./routes/amUser"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// app.use('/api/adminuser', require('./routes/adminUser'))
// app.use('/yuchen/api', require('./routes/yuchen'))

// ************************************************************************************************************

// @Yuchen

// app.use('/login/yuchen', require('./routes/yuchen/login'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// ************************************************************************************************************

// // Admin register
// const bcrypt = require('bcryptjs');
// const User = require('./models/AdminUser');

// const adminRegister = async() => {
//   const password = 'test123123';

//   const user = new User({
//     email: 'mingkunm@usc.edu',
//     password,
//     status: true
//   });

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(password, salt);

//   await user.save();

//   console.log('Admin register success!');
// }
// adminRegister();

// Admin register @yuchen
// const bcrypt = require('bcryptjs');
// const User = require('./models/AdminUser');

// const adminRegister = async() => {
//   const password = 'abc12345678';

//   const user = new User({
//     email: 'j0909089342@gmail.com',
//     password,
//     status: true
//   });

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(password, salt);

//   await user.save();

//   console.log('********************************************************');
// }
// adminRegister();

//basic user register
// const bcrypt = require('bcryptjs');
// const User = require('./models/BasicUser');
// const College = require('./models/College');

// const basicRegister = async() => {
//   const college = await College.findById('5f2f7a5b9103539d7dbec33b');
//   const collegeDisplay = college.name;
//   const password = 'test123123';

//   const user = new User({
//     email: 'mingkunm@usc.edu',
//     password,
//     college: '5f2f7a5b9103539d7dbec33b',
//     collegeDisplay,
//     area: 'Western',
//     status: true
//   });
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(password, salt);

//   await user.save();
//   console.log('Basic register success!');
// }
// basicRegister();

// modify basic user
// const User = require('./models/BasicUser');

// const basicRegister = async() => {
// 	const email = 'mmk.ee.911@gmail.com';

// 	const user = await User.findOne({ email });

// 	console.log(user)

// 	user.name = '马鸣坤';

//   await user.save();
//   console.log('Basic register success!');
// }
// basicRegister();

// modify am user
// const User = require('./models/AmUser');

// const basicRegister = async() => {
// 	const email = 'am@usc.edu';

// 	const user = await User.findOne({ email });

// 	console.log(user)

// 	user.name = '朱彤';
// 	user.area = 'western'

//   await user.save();
//   console.log('Basic register success!');
// }
// basicRegister();

// AM user register
// const bcrypt = require('bcryptjs');
// const User = require('./models/AmUser');
// const date = require('./utils/Date')

// const amRegister = async() => {
// 	const password = 'test123123';
// 	const college = [
// 		{
// 			collegeId: '5f2f7a09a5dc8a9d6f158996',
// 			collegeDisplay: 'University of Southern California'
// 		},
// 		{
// 			collegeId: '5f2f7a5b9103539d7dbec33b',
// 			collegeDisplay: 'University of California, Riverside'
// 		}
// 	]

//   const user = new User({
//     email: 'am@usc',
// 		password,
// 		college,
// 		dateDisplay: date,
//     status: true
//   });
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(password, salt);
//   await user.save();
//   console.log('Admin register success!');
// }

// amRegister();

// Register University
// const College = require('./models/College');
// const collegeRegister = async() => {
//   const name = 'University of Southern California';
//   // const name = 'University of California, Riverside';
//   const area = 'Western';

//   const co = new College({
//     name,
//     area,
//     availability: true
//   });

//   await co.save();

//   console.log(`${name} Register Success!`);
// }
// collegeRegister();

// modify college
// const College = require('./models/College');
// const collegeRegister = async() => {

// 	const name = 'University of Southern California';

// 	const id = '5f2f7a09a5dc8a9d6f158996';

// 	const query = {
// 		id,
// 		name
// 	}

// 	const college = await College.findOne({ name })

// 	college.group.unshift(query)

// 	college.save();

//   console.log(`${name} Register Success!`);
// }
// collegeRegister();

// Register Group
// const group = require('./models/Group');
// const collegeRegister = async() => {
//   // const name = 'University of Southern California';
//   const name = '(2)UCR&SM保险答疑群';
// 	const college = '5f2f7a5b9103539d7dbec33b'
// 	const collegeDisplay = 'University of California, Riverside'

//   const co = new Group({
//     name,
//     college,
//     collegeDisplay
//   });

//   await co.save();

//   console.log(`${name} Register Success!`);
// }
// collegeRegister();

// const fs = require('fs')
// const db = './Data/GroupContact.json';
// const Wechat = require('./models/WeChat')
// const College = require('./models/College');
// const groupName = '(10)USC&SM保险答疑群'

// fs.readFile(db, 'utf8', async (err, data) => {
//   const time1 = new Date();

//   if (err) {
//     console.log(err);
//   }
//   try {
//     var count = 0;
//     const jsonData = JSON.parse(data);
//     const college = await College.findById('5f2f7a09a5dc8a9d6f158996');
//     const collegeDisplay = college.name;

//     jsonData.forEach(async jd => {
//       if (jd.nickname === groupName) {
//         jd.m_nsChatRoomMemList.split(';').forEach(async id => {

//           const wechat = new Wechat({
//             wechatId: id,
//             groupName,
//             college: '5f2f7a09a5dc8a9d6f158996',
//             collegeDisplay,
//             initalData: true
//           })

//           await wechat.save()
//           count = count + 1;
//         })
//       }
//     });

//     const time2 = new Date();
//     let totalTime = time2.getTime() - time1.getTime();
//     totalTime = totalTime/1000;

//     console.log(`录入 ${count} 条数据， 共耗时 ${totalTime} 秒`);
//   } catch (error) {
//     console.log(error);
//   }
// })
