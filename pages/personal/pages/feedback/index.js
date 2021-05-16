// pages/personal/pages/feedback/index.js
import {getStorageItem} from '../../../../utils/api'
import httpRequest from '../../../../utils/request/index'
const {$Toast} = require('../../../../iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedBackList:[]
  },

  pageData:{
    currentPage:1,
    pageSize:6,
    totalPages: 1,
    totalRows: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFeedBackList();
  },

  getValues:function(){
    const picTextBox = this.selectComponent("#pic-text-box");
    return picTextBox.getValues()
  },

  clearInput:function(){
    const picTextBox = this.selectComponent("#pic-text-box");
    picTextBox.clearInput();
  },

  handleSubmit:function(){
    const {tempFilePath:{imgTempPath},textAreat:{currentWord},titleInput} = this.getValues();
    const content = titleInput+currentWord;
    if(!content && imgTempPath.length===0){
      $Toast({
        content: "请输入内容或图片",
        type: 'warning'
      });
      return;
    }
    wx.showToast({
      icon: "loading",
      title: "正在提交反馈",
      duration:10000
    });
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {accountId,content}
      if(imgTempPath.length===0) return httpRequest.submitFeedback({data});
      else return httpRequest.submitFeedback({filePath:imgTempPath[0],data})
    })
    .then(res=>{
      if(!res.data.code) return Promise.reject();
      this.clearInput();
      wx.showToast({
        icon: "success",
        title: "反馈成功！",
        duration:1500,
        success:()=> wx.navigateBack()
      });
    })
    

  },

  getFeedBackList:function(){
    const {currentPage,pageSize}  = this.pageData;
    const data = {currentPage,pageSize}
    httpRequest.getFeedBackList(data)
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log("+================")
    })
  }
})