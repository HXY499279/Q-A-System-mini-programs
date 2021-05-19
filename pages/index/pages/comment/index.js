// pages/index/pages/comment/index.js
import {getStorageItem} from '../../../../utils/api';
import httpRequest from '../../../../utils/request/index';
import {$Toast} from '../../../../iview/base/index'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    answerName:"",
    answerId:undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { answerName,answerId } = options;
    this.setData({
      answerName,
      answerId
    })
  },
  handleSubmit:function(){
    const {currentWord:content} = this.getValues();
    if(!content){
      $Toast({
        content: '请输入评论',
        type: 'warning'
      })
      return;
    }

    wx.showToast({
      title: '发布中',
      icon:"loading",
      mask:true,
      duration:10000
    })
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {accountId,content,answerId:this.data.answerId}
      return httpRequest.submitComment(data)
    })
    .then(res=>{
      if(!res.data.code) return Promise.reject();
      wx.showToast({
        title: '发布成功',
        icon:"success",
        mask:true,
        duration:1500
      });
      setTimeout(()=>wx.navigateBack(),1500)
    })
  },

  getValues:function(){
    const myTextArea = this.selectComponent("#my-textarea");
    return myTextArea.getValues();
  }

})