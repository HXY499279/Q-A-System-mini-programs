// pages/index/complain/index.js
import {
  getStorageItem
} from '../../../../utils/api'
const {
  $Toast
} = require('../../../../iview/base/index');
import httpRequest from '../../../../utils/request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataDetail: {},
    type:0 //0是问题 1是回答
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const dataDetail = JSON.parse(decodeURIComponent(options.param));
    const type = options.type;
    this.setData({
      dataDetail,
      type
    })
  },

  /**
   * 举报
   */
  submitReport: function () {
    const {
      content,
      img
    } = this.getValues();
    if (!content) {
      $Toast({
        content: '请输入举报内容',
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
      .then(accountId => {
        const questionId = this.data.questionDetail.questionId;
        const param = {
          accountId,
          questionId,
          content
        }
        if (img.length === 0) return httpRequest.reportQuestion({data: param})
        return httpRequest.reportQuestion({ filePath: img[0],data: param})
      })
      .then(res => {
        if (!res.data.code) Promise.reject();
        else {
          wx.showToast({
            icon: "success",
            title: "反馈成功",
            duration:1500
          })
          this.clearInput();
        }
      })
      .catch(err=>{
        wx.showToast({
          icon: "error",
          title: "请检查您的网络",
          duration:1500
        })
      })
  },

  /**
   * 获取输入框和图片上传框内容
   */
  getValues: function () {
    const myTextArea = this.selectComponent("#my-textarea");
    const picUpdateBox = this.selectComponent("#picture-update-box");
    return {
      content: myTextArea.getValues().currentWord,
      img: picUpdateBox.getValues().imgTempPath
    }
  },

  clearInput: function () {
    const myTextArea = this.selectComponent("#my-textarea");
    const picUpdateBox = this.selectComponent("#picture-update-box");
    myTextArea.clearInput();
    picUpdateBox.clearInput();
  },
})