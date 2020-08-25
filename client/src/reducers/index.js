import { combineReducers } from 'redux';
import alert from './alert';
import subAlert from './subAlert';
import auth from './auth';
import basicWeChat from './basic/basicWechat';
import amNewBasic from './am/amNewBasic'

export default combineReducers({
  alert,
  subAlert,
  auth,
  basicWeChat,
  amNewBasic
});