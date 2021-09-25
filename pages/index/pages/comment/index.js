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
    if(!content.trim()){
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
      duration:10000,
      mask:true
    })
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {accountId,content,answerId:this.data.answerId}
      return httpRequest.submitComment(data)
    })
    .then(res=>{

      const resData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      if(Number(resData.code) === 0){
        wx.showToast({
          title: '上传失败,'+ resData.msg,
          icon:'none',
          duration:2000
        })
        return;
      }

      if(!resData.code) return Promise.reject();
      wx.showToast({
        title: '发布成功',
        icon:"success",
        mask:true,
        duration:1000
      });
      let pages = getCurrentPages();
      let beforePage = pages[pages.length - 2];
      beforePage.getComment();
      setTimeout(()=>wx.navigateBack(),1000)
    })
  },

  getValues:function(){
    const myTextArea = this.selectComponent("#my-textarea");
    return myTextArea.getValues();
  }

})