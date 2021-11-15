// pages/index/pages/edit_question/index.js
import {baseImgUrl} from '../../../../utils/api'
import httpRequest from '../../../../utils/request/index'

const {
  $Toast
} = require('../../../../iview/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    values:{}
  },

  pageData : {
    oldValus:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = JSON.parse(decodeURIComponent(options.data))
    const {title,describes} = data
    const imgPath = data.imgPath = baseImgUrl + data.imgPath
    this.setData({
      values:{titleInput:title,contentInput:describes,imgPath}
    })
    this.pageData.oldValus = data
  },

  handleClick(){
    const accountId = wx.getStorageSync('accountId')
    if (accountId) {
      const { titleInput: title, textAreat: { currentWord: describes }, tempFilePath: { imgTempPath } } = this.getValues();
      if (!title.trim() || !describes.trim()) {
        $Toast({
          content: '请完善标题或内容',
          type: 'warning'
        });
        return;
      }
      const {title:oldTitleInput,describes:oldContentInput,imgPath:oldImgPath,questionId} = this.pageData.oldValus
      //如果没有变化，直接返回
      if(oldTitleInput === title && oldContentInput===describes && imgTempPath[0]===oldImgPath){
        return wx.navigateBack()
      }

      let data = { accountId, title, describes,questionId };      
      let result = imgTempPath[0]===oldImgPath ?  httpRequest.updateQuestion({data}) : httpRequest.updateQuestion({filePath: imgTempPath[0], data })
      result.then(res=>{
        if(res.statusCode !== 200) return Promise.reject(res)
        const resData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        if(resData.code === 1){
          wx.showToast({
            title: '更新成功',
            icon:'success',
            duration:1500
          })
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 2];
          beforePage.initQuestion();
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }else return Promise.reject("更新失败")
      })
      .catch(err=>{
        wx.showToast({
          title: String(err),
          icon:'none',
          duration:1500
        })
      })
       
      
      }
    else{
      wx.showToast({
        title: '获取身份失败，请登录',
        icon:'none'
      })
    }
  },

  getValues: function () {
    const input = this.selectComponent("#picture_text_box");
    return input.getValues();
  },


})