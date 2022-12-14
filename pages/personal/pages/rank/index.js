// pages/personal/pages/rank/index.js
import httpRequest from '../../../../utils/request/index';
import {
  getStorageItem
} from '../../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, //	0是总榜 1是志愿者
    rankList: [],
    myInfo: {},
    url:'',
    imgMsg:{},
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url : getApp().url.currentUrl+'/img'
    })
    this.getRank();
    this.getBgImg();
  },

  /**
   * 获取排行榜信息
   */
  getRank:function(){
    getStorageItem("accountId")
    .then(accountId => {
      const data = {
        accountId,
        type: this.data.type
      }
      return httpRequest.getRankList(data)
    })
    .then(res => {
      if (!res.data.code) return Promise.reject();
      this.setData({
        loading:false,
        rankList: res.data.data.list,
        myInfo: res.data.data.myData
      })
    })
    .catch(err=>{
      wx.showToast({
        title: '获取失败',
        icon:'none'
      })
    })
  },

  getBgImg:function(){
    httpRequest.getImgs({type:3})
    .then(res=>{
      if(res.data.code !==1) return Promise.reject();
      this.setData({
        imgMsg:res.data.data[0]
      })
    })
  },
  /**
   * 修改排行类别
   */
  changeType: function (e) {
    const type = e.target.dataset.type;
    if (type !== 0 && type !== 1) return;
    if(type === this.data.type) return;
    this.setData({type});
    this.getRank();
  }
})