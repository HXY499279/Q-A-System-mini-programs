// pages/index/pages/comment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { answerName,answerId } = options;
    this.setData({
      answerName
    })
  },
  handleSubmit:function(){
    console.log(this.getValues())
  },

  getValues:function(){
    const myTextArea = this.selectComponent("#my-textarea");
    return myTextArea.getValues();
  }

})