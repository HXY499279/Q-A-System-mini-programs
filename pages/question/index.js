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
    currentCategory: ""
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
    const subjectId = app.chooseSubjectId;
    if (!title || !describes) {
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
        wx.showToast({title: '发布中...', icon: 'loading', duration: 10000,mask:true});
        let data = { accountId, title, describes, subjectId };
        if (imgTempPath.length === 0) return httpRequest.submitQuestion({ data })
        else return httpRequest.submitQuestion({ filePath: imgTempPath[0], data })
      })
      .then(res => {
        if(!res.data.data) return Promise.reject(res)
        else{
          wx.hideToast();
          this.clearInput();
          this.data.currentCategory = ''
          $Toast({
            content: '发布成功',
            type: 'success'
          });
        }
      })
      .catch(err => {
        wx.showToast({title: '发布失败', icon: 'error', duration: 1500,mask:true});
      })
  },

  /**
   * 点击删除已选择的课程
   */
  delCurrentCategory: function () {
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
 clearInput:function(){
  app.chooseSubjectId = undefined;
  app.chooseCategory = "";
  const input = this.selectComponent("#picture_text_box");
  input.clearInput();

},

})