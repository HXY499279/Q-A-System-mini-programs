// pages/index/pages/question_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "answerSortType":"hot",
    isCollection:false
  },

  //选择回答的排序方式
  changeAnswerSortType(e){
    const answerSortType = e.target.dataset.type;
    this.setData({
      answerSortType
    })
  },

  //去写回答
  gotoWriteAnswer(){
    wx.redirectTo({
      url: '/pages/index/pages/write_answer/index',
    })
  },
  //添加进收藏夹
  addIntoCollection(){
    const isCollection = !this.data.isCollection;
    this.setData({
      isCollection
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