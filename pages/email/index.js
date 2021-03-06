// pages/email/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: "invitation",
    //邮件模块上面的导航栏
    topBar: [{
        "icon": "/img/email/write.svg",
        "type": "invitation",
        "text": "邀请回答",
        "backgroundColor": "#FF8D1A",
      }, {
        "icon": "/img/email/dynamic.svg",
        "type": "dynamic",
        "text": "动态",
        "backgroundColor": "#6BA1DD",
      }, {
        "icon": "/img/email/collection.svg",
        "type": "collection",
        "text": "收藏",
        "backgroundColor": "#F87053",
      }, {
        "icon": "/img/email/myquestion.svg",
        "type": "myquestion",
        "text": "我的提问",
        "backgroundColor": "#2DC4BA",
      }
    ]
  },

  changeMenu(e) {
    const {currentType} = e.detail; 
    this.setData({
      currentType
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})