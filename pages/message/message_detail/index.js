// pages/message/message_detail/index.js
import httpRequest from '../../../utils/request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsDetail:{},
    url:''
  },

  onLoad:function(options){
    const {newsId} = options;
    this.getUrl();
    this.getNewDetail(newsId)
  },
  getNewDetail:function(newsId){
    httpRequest.getNewDetail({newsId})
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
      this.setData({
        newsDetail:res.data.data
      })
    })
  },
  getUrl:function(){
    this.setData({
      url : getApp().url.currentUrl+'/img'
    })
  },

  //图片预览
  previewPic(e) {
    const src = e.currentTarget.dataset.src; //获取data-src
    wx.previewImage({
      current: this.data.url+src, // 当前显示图片的http链接
      urls: [this.data.url+src]// 需要预览的图片http链接列表
    })
  },
})