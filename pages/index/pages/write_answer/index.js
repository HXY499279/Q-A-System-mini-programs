// pages/index/pages/write_answer/index.js
import httpRequest from '../../../../utils/request/index';
import {getStorageItem} from '../../../../utils/api'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionDetailData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const questionDetailData = JSON.parse(decodeURIComponent(options.questionDetailData));
    this.setData({questionDetailData})
  },

  //发布回答
  submitAnswer(){
    const { content,img } = this.getValues();

    if (!content) {
      $Toast({
        content: '请输入回答内容',
        type: 'warning'
      });
      return;
    }

    wx.showToast({
      icon: "loading",
      title: "正在上传",
      duration:10000
    });

    getStorageItem("accountId")
    .then(accountId=>{
      const questionId = this.data.questionDetailData.questionId;
      const data = {questionId,accountId,content}
      if(img.length === 0) return httpRequest.submitAnswer({data});
      else return  httpRequest.submitAnswer({data,filePath:img[0]});
    })
    .then(res=>{
      if(!res.data.code) return Promise.reject();
      wx.showToast({
            icon: "success",
            title: "发布成功",
            duration:1500
      });
      setTimeout(()=>{
        wx.navigateBack()
      },1500)
    })
    .catch(err=>{
      wx.showToast({
        icon: "error",
        title: "网络忙 稍后试试",
        duration:1500
      })
    })

  // app.aa = 1;
  // wx.navigateTo({
  //   url: '/pages/index/pages/question_detail/index'
  // })
  },

  /**
   * 获取输入框内容
   */
  getValues: function () {
    const myTextArea = this.selectComponent("#my-textarea");
    const picUpdateBox = this.selectComponent("#picture-update-box");
    return {
      content: myTextArea.getValues().currentWord,
      img: picUpdateBox.getValues().imgTempPath
    }
  },
  
})