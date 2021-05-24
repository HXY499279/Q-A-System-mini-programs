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
    type:0 //0是问题 1是回答 2是评论
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const dataDetail = JSON.parse(decodeURIComponent(options.param));
    const type = Number(options.type);
    this.setData({
      dataDetail,
      type
    })
  },

  /**
   * 举报
   */
  submitReport: function () {
    const { content,img } = this.getValues();
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
        duration:10000,
        mask:true
      });

      getStorageItem("accountId")
      .then(accountId => {
        let param;
        this.data.type === 0 ? 
        param = {accountId,content,questionId:this.data.dataDetail.questionId}:
        this.data.type === 1 ?
          param = {accountId,content,answerId:this.data.dataDetail.answerId}:
          param = {accountId,content,answerId:this.data.dataDetail.commentId}
        
        switch (this.data.type){
          case 0:  //0 代表举报问题
            if (img.length === 0) return httpRequest.reportQuestion({data: param})
            return httpRequest.reportQuestion({ filePath: img[0],data: param})    
            break;
          case 1:  //1代表举报回答
          if (img.length === 0) return httpRequest.reportAnswer({data: param})
          return httpRequest.reportAnswer({ filePath: img[0],data: param})    
            break;
          case 2: //2 代表评论
          if (img.length === 0) return httpRequest.reportComment({data: param})
          return httpRequest.reportComment({ filePath: img[0],data: param})    
          break;
        }
      })
      .then(res => {
        console.log(res)
        if (res.statusCode !== 200) return Promise.reject();
        else {
          this.clearInput();
          wx.showToast({
            icon: "success",
            title: "感谢您的反馈！",
            duration:1500
          })
          setTimeout(()=>{wx.navigateBack()},1500)
        }
      })
      .catch(err=>{
        wx.showToast({
          icon: "error",
          title: "网络繁忙",
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