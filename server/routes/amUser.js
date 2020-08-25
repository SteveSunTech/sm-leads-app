const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const AmUser = require('../models/AmUser');
const BasicUser = require('../models/BasicUser');
const College = require('../models/College');
const date = require('../utils/Date');

// @route      Get api/am/basic/index
// @desc       get all ambassador belong to current am
// @access     private
router.get('/basic/index', auth, async (req, res) => {

  try {
    const am = await AmUser.findById(req.user).select('-password');
      const basicList = am.basic
      let basics = []
      // console.log(basicList)

      var bar = new Promise((resolve, reject) => {
        basicList.forEach(async e => {
          let basic = await BasicUser.findById(e.basicId);
          basics.push(basic)
          if (basicList.length === basics.length) resolve();
        })
      });

      bar.then(() => {
        // console.log(basics)
        res.json({ basics });
      })

  } catch (error) {
    return res.status(400).json({ errors:[{ msg: error }]})
  }
})

module.exports = router;

// @route     Post api/am/basic/new
// @desc      Add new ambassador
// @access    Private
router.post(
  '/basic/new',
  auth,
  [
    check('email', '请输入正确的邮箱！').isEmail(),
    check('password', '请输入密码！').notEmpty(),
    check('name', '请输入校园大使姓名！').notEmpty(),
    check('college', '请选择学校！').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      let { email, password, name, college } = req.body;

      const basic = await BasicUser.findOne({ email })
      if (basic) {
        return res.status(400).json({ errors:[{ msg: '该邮箱已经存在！'}] })
      }

      const am = await AmUser.findById(req.user).select('-password');
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
        area
      })
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      user = await BasicUser.findOne({ email })
      am.basic.unshift({
        basicId: user._id,
        basicDisplay: user.name
      })

      await am.save()

      res.json({ user })
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ errors:[{ msg: error }] })
    }
});

module.exports = router;