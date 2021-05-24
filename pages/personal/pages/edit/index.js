// pages/personal/pages/edit/index.js
import httpRequest from '../../../../utils/request/index'
import { getStorageItem,chooseImg } from '../../../../utils/api'
const { $Toast } = require('../../../../iview/base/index');

Page({

  data: {
    imgTempPath:"", //记录头像临时地址
    currentImg:"",
    intro:""
  },

  onLoad: function (options) {
    getStorageItem("userInfo")
    .then(userInfo=>{
      this.setData({
        currentImg:getApp().url.currentUrl+'/img'+userInfo.imgPath,
        intro:userInfo.introduce
      })
    })
  },


  //点击更换头像
  changeHeadImg:function(){
    chooseImg(1)
   .then(res=>{
     this.setData({
      imgTempPath:res[0]
     })
   })
  },

  submit:function(){
    const myTextArea = this.selectComponent("#my-textarea");
    let {currentWord:introduction}= myTextArea.getValues();
    const filePath = this.data.imgTempPath;
    if(!introduction.trim() && !filePath){
     wx.showToast({
       title: '已是最新状态',
       icon:'error',
       duration:1500,
       mask:true
     })
      return
    }

    wx.showToast({
      title: '保存中',
      icon:'loading',
      duration:10000,
      mask:true
    })

    getStorageItem("accountId")
    .then(accountId=>{
      introduction = introduction ? introduction:this.data.intro;
      const data = {accountId,introduction} 
      if(filePath) return httpRequest.editPersonal({data,filePath});
      else return httpRequest.editPersonal({data})
    })
    .then(res=>{
      if(res.statusCode!== 200) return Promise.reject();
      wx.hideToast();
      $Toast({
        content: '更新成功！',
        type: 'success'
      });
      //返回上一个页面并刷新
      let pages = getCurrentPages();
      let beforePage = pages[pages.length - 2];
      beforePage.getUserInfo();
      wx.navigateBack();
    })
    .catch(err=>{
      console.log(err)
      wx.hideToast();
      $Toast({
        content: '网络繁忙',
        type: 'error'
      });
    })
  }
})