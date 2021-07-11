// pages/personal/pages/aboutApp/index.js
import httpRequest from '../../../../utils/request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    imgMsg:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url : getApp().url.currentUrl+'/img'
    })
    this.getBgImg();
  },

  getBgImg:function(){
    httpRequest.getImgs({type:4})
    .then(res=>{
      if(res.data.code !==1) return Promise.reject();
      this.setData({
        imgMsg:res.data.data[0]
      })
    })
  },
})