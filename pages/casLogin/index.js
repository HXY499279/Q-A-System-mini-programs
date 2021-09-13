// pages/casLogin/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url= options.logoutsrc;
    if(!url){
      url = wx.getStorageSync('Loginsrc');
    } 
    this.setData({
      url:url
    })
  },

})