const express = require('express');
const router = express();
const auth = require('../middleware/auth');

const Wechat = require('../models/WeChat');
const Basic = require('../models/BasicUser');
const College = require('../models/College');
const WechatNew = require('../models/WeChatNew');
const Group = require('../models/Group');

// @route      Post api/basic/single
// @desc       check if single wechat in kpi group
// @access     private
router.post('/single', auth, async (req, res) => {
  const wechatId = req.body.wechat;
  const user = req.user;
  console.log(wechatId);
  console.log(user);

  try {
    wechat = await Wechat.findOne({ wechatId })
    console.log(wechat);
  } catch (error) {

  }
})

// @route      Post api/basic/new
// @desc       add new wechat lead account to database
// @access     private
router.post('/new', auth, async (req, res) => {
  const wechatId = req.body.wechat;
  const status = req.body.status;
  let keywords = req.body.checkedItem;

  if (wechatId === '') {
    return res.status(400).json({ errors:[{ msg: '请填写微信号！' }]})
  }
  if (status === '') {
    return res.status(400).json({ errors:[{ msg: '请选择状态！' }]})
  }
  let keywordString = ''
  if (keywords) {
    keywordString = keywords.join(' ')
  }

  try {
    const user = await Basic.findById(req.user);
    const group = await Group.findOne({ collegeDisplay:user.collegeDisplay });
    const wechatNew = new WechatNew({
      wechatId,
      status,
      basicUser: user.id,
      basicUserDisplay: user.email,
      college: user.college,
      collegeDisplay: user.collegeDisplay,
      group,
      groupDisplay: group.name,
      keywords: keywordString
    })

    wechatNew.save();

    res.json({ wechatNew })
  } catch (error) {
    return res.status(400).json({ errors:[{ msg: error }]})
  }
})

module.exports = router;

// @route      Post api/basic/get
// @desc       get all wechat lead account belong to current user
// @access     private
router.get('/get', auth, async (req, res) => {

  try {
    const wechats = await WechatNew.find({ basicUser: req.user})

    res.json({ wechats })
  } catch (error) {
    return res.status(400).json({ errors:[{ msg: error }]})
  }
})

module.exports = router;