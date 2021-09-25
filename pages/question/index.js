// pages/question/index.js
const {
  $Toast
} = require('../../iview/base/index');
import {
  getStorageItem
} from '../../utils/api'
import httpRequest from '../../utils/request/index'

const app = getApp();

Page({
  data: {
    currentCategory: "",
    isLogin: false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取选择的类别并渲染 已经选过则替代
    const currentCategory = app.chooseCategory ? app.chooseCategory : "";
    this.setData({
      currentCategory
    })
  },

  /**
   * 点击提交
   */
  handleClick: function () {
      const { titleInput: title, textAreat: { currentWord: describes }, tempFilePath: { imgTempPath } } = this.getValues();
    const accountId = wx.getStorageSync('accountId')
    if (accountId) {
      const { titleInput: title, textAreat: { currentWord: describes }, tempFilePath: { imgTempPath } } = this.getValues();
      const subjectId = app.chooseSubjectId;
      if (!title.trim() || !describes.trim()) {
        $Toast({
          content: '请完善标题或内容',
          type: 'warning'
        });
        return;
      }
      if (!subjectId) {
        $Toast({
          content: '请选择科目',
          type: 'warning'
        });
        return;
      }
      getStorageItem("accountId")
        .then(accountId => {
          wx.showToast({ title: '发布中...', icon: 'loading', duration: 10000, mask: true });
          let data = { accountId, title, describes, subjectId };      
          if (imgTempPath.length === 0) return httpRequest.submitQuestion({ data })
          else return httpRequest.submitQuestion({ filePath: imgTempPath[0], data })
        })
        .then(res => {
          if (res.statusCode !== 200) return Promise.reject(res)
          else {
            const resData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
            if(Number(resData.code) === 0){
              wx.showToast({
                title: '上传失败,'+ resData.msg,
                icon:'none',
                duration:2000
              })
              return;
            }
            app.chooseSubjectId = undefined
            app.chooseCategory = ''
            wx.hideToast()
            this.clearInput()
            this.setData({
              currentCategory: ''
            })
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 1500
            });
          }
        })
        .catch(err => {
          wx.showToast({ title: '发布失败', icon: 'error', duration: 1500, mask: true });
        })
    } else {
      $Toast({
        content: "未登录",
        type: 'warning'
      });
    }
  },

  /**
   * 点击删除已选择的课程
   */
  delCurrentCategory: function () {
    app.chooseSubjectId = undefined
    app.chooseCategory = ''
    this.setData({
      currentCategory: ""
    })
  },


  /**
   * 获取输入框的值
   */
  getValues: function () {
    const input = this.selectComponent("#picture_text_box");
    return input.getValues();
  },

  /**
  * 清除输入框的内容
  */
  clearInput: function () {
    app.chooseSubjectId = undefined;
    app.chooseCategory = "";
    const input = this.selectComponent("#picture_text_box");
    input.clearInput();
  },

  /**
   * 隐藏页面时提示框消失
   */
  onHide: function () {
    wx.hideToast()
  },

})