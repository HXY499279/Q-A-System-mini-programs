// pages/index/pages/answer_detail/index.js
import {getStorageItem} from '../../../../utils/api'
import httpRequest from '../../../../utils/request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerDetail:{},
    questionDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const answerDetail = (JSON.parse(decodeURIComponent(options.answerDetail)));
    const questionDetail = (JSON.parse(decodeURIComponent(options.questionDetail)));
    this.setData({
      answerDetail,
      questionDetail
    })
  },

  /**
   * 点击采纳
   */
  onAdopt:function(){
    let newAnswerDetail = JSON.parse(JSON.stringify(this.data.answerDetail));
    newAnswerDetail.isAdopt = newAnswerDetail.isAdopt?0:1;
    this.setData({
      answerDetail:newAnswerDetail
    })
  },

  /**
   * 点击赞同
   */
  onAgree:function(){
    let newAnswerDetail = JSON.parse(JSON.stringify(this.data.answerDetail));
    newAnswerDetail.isAgree = newAnswerDetail.isAgree ? 0 : 1;
    newAnswerDetail.isAgree ? newAnswerDetail.agreeCount++ :  newAnswerDetail.agreeCount--;
    this.setData({
      answerDetail:newAnswerDetail
    })

    getStorageItem("accountId")
    .then(accountId=>{
      const answerId = this.data.answerDetail.answerId;
      const isAgree = this.data.answerDetail.isAgree
      if( isAgree)  return httpRequest.agreeAnswer({answerId,accountId})
      else return httpRequest.cancelAgreeAnswer({answerId,accountId})
    })
    .then(res=>{
     if(!res.data.code) return Promise.reject();
    })
    .catch(err=>{})
  },

  /**
   * 点击评论
   */
  onComment:function(){
    console.log("parent-oncomment")
    wx.navigateTo({
      url: `/pages/index/pages/comment/index?answerId=${this.data.answerDetail.answerId}&answerName=${this.data.answerDetail.userName}`,
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})