// pages/personal/pages/edit/index.js
import {
  chooseImg
} from '../../../../utils/api'

Page({

  data: {
    inputValue:"", //记录个人简介输入框的值
    imgTempPath:"" //记录头像临时地址
  },

  //点击更换头像
  changeHeadImg(){
    chooseImg(1)
   .then(res=>{
     this.setData({
      imgTempPath:res[0]
     })
   })
  },

  
  //子组件调用，获取子组件（输入框）的值
  getInputValue(e){
    this.setData({
      inputValue:e.detail.inputValue
    })
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },


  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }
})