// pages/personal/pages/feedback/index.js
import {getStorageItem,mergeObj} from '../../../../utils/api'
import httpRequest from '../../../../utils/request/index'
const {$Toast} = require('../../../../iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackList:[],
    currentPage:0,
    totalPages:1
  },

  pageData:{
    currentPage:1,
    pageSize:4,
    totalPages: 1,
    totalRows: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getfeedbackList();
  },

  getValues:function(){
    const picTextBox = this.selectComponent("#pic-text-box");
    return picTextBox.getValues()
  },

  clearInput:function(){
    const picTextBox = this.selectComponent("#pic-text-box");
    picTextBox.clearInput();
  },

  getfeedbackList:function(){
    getStorageItem("accountId")
    .then(accountId=>{
      const {currentPage,pageSize}  = this.pageData;
      const data = {currentPage,pageSize,accountId}
      return httpRequest.getFeedbackList(data)
    })
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
      mergeObj(this.pageData,res.data.data.pageInfo)
      this.pageData.totalPages = res.data.data.pageInfo.totalPages;
      this.pageData.totalRows = res.data.data.pageInfo.totalRows;
      this.setData({
        feedbackList:[...this.data.feedbackList,...res.data.data.list],
        currentPage:this.pageData.currentPage,
        totalPages:this.pageData.totalPages
      })
    })
    .catch(err=>{
      wx.showToast({
        title: String(err),
        type:'error'
      })
    })
  },

  handleSubmit:function(){
    const {tempFilePath:{imgTempPath},textAreat:{currentWord},titleInput} = this.getValues();
    const content = titleInput+": "+currentWord;
    if((titleInput.trim()==='' || currentWord.trim()==='') && imgTempPath.length===0){
      $Toast({
        content: "请输入内容或图片",
        type: 'warning'
      });
      return;
    }
    wx.showToast({
      icon: "loading",
      title: "正在提交反馈",
      duration:10000,
      mask:true
    });
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {accountId,content}
      if(imgTempPath.length===0) return httpRequest.submitFeedback({data});
      else return httpRequest.submitFeedback({filePath:imgTempPath[0],data})
    })
    .then(res=>{
      if(res.statusCode!==200) return Promise.reject(res)
      this.clearInput();
      this.pageData.currentPage = 1;
      this.setData({
        feedbackList:[],
      },()=>{
      this.getfeedbackList();
      })
      wx.showToast({
        icon:"success",
        title: "感谢您的反馈",
        duration:1500,
        mask:true
      });
    })
    .catch(err=>{
      wx.hideToast();
      $Toast({
        content: "网络繁忙",
        type: 'error'
      });
    })
  },


  handleAgreeClick:function(e){
    const {feedbackId,index} = e.detail ;
    let newFeedbackList = this.data.feedbackList.slice();
    const isAgreeNow = !newFeedbackList[index].isAgree
    newFeedbackList[index].isAgree = isAgreeNow;
    isAgreeNow ? newFeedbackList[index].agreeCount++ : newFeedbackList[index].agreeCount--
    this.setData({
      feedbackList:newFeedbackList
    })

    getStorageItem("accountId")
      .then(accountId=>{
        const data = {accountId , feedbackId}
        if(isAgreeNow) return httpRequest.agreeFeedback(data)
        else return httpRequest.cancelAgreeFeedback(data)
      })
      .then(res=>{
        if(res.data.code!==1) return Promise.reject();
      })
      .catch(err=>{})
  },

  onReachBottom: function () {
    const {currentPage,totalPages} = this.pageData;
    if(currentPage<totalPages){
      this.pageData.currentPage++ ;
      this.getfeedbackList();
    }
  },
})