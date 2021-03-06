// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls:['/img/bg.jpeg','/img/bg.jpeg']
  },

  onLoad() {
  
  },
  gotoQuestionList(){
    wx.navigateTo({
      url: '/pages/index/pages/question_list/index',
    })
  },
  togoQuestionDetail(){
    wx.navigateTo({
      url: '/pages/index/pages/question_detail/index',
    })
  }
})
