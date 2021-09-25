// pages/index/pages/write_answer/index.js
import httpRequest from '../../../../utils/request/index';
import { getStorageItem } from '../../../../utils/api'
import { $Toast } from '../../../../iview/base/index'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionDetailData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const questionDetailData = JSON.parse(decodeURIComponent(options.questionDetailData));
    this.setData({ questionDetailData })
  },

  //发布回答
  submitAnswer() {
    const { content, img } = this.getValues();

    if (!content.trim() && img.length === 0) {
      $Toast({
        content: '请输入回答',
        type: 'warning'
      });
      return;
    }

    wx.showToast({
      icon: "loading",
      title: "正在上传",
      duration: 10000,
      mask: true
    });

    getStorageItem("accountId")
      .then(accountId => {
        const questionId = this.data.questionDetailData.questionId;
        const data = { questionId, accountId, content }
        if (img.length === 0) return httpRequest.submitAnswer({ data });
        else return httpRequest.submitAnswer({ data, filePath: img[0] });
      })
      .then(res => {
        if (res.statusCode !== 200) return Promise.reject();

        const resData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        if(Number(resData.code) === 0){
          wx.showToast({
            title: '上传失败,'+ resData.msg,
            icon:'none',
            duration:2000
          })
          return;
        }

        this.clearInput();
        wx.showToast({
          icon: "success",
          title: "发布成功",
          duration: 1500
        });
        let pages = getCurrentPages();
        let beforePage = pages[pages.length - 2];
        beforePage.initAnswerList();
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      })
      .catch(err => {
        wx.showToast({
          icon: "error",
          title: "网络忙 稍后试试",
          duration: 1500
        })
      })
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

  clearInput: function () {
    const myTextArea = this.selectComponent("#my-textarea");
    const picUpdateBox = this.selectComponent("#picture-update-box");
    myTextArea.clearInput();
    picUpdateBox.clearInput();
  }

})