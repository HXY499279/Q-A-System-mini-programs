// pages/index/pages/other_index/index.js
import httpRequest from '../../../../utils/request/index'
import {mergeObj} from '../../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    personalInfo:{},
    dynamicList:[],
  },

  pageData:{
    accountId:undefined,
    pageSize:6,
    currentPage:1,
    totalPages:1,
    totalRows:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {accountId} = options;
    const {currentPage,pageSize} = this.pageData;
    const data = {type:2,currentPage,pageSize,accountId}

    this.pageData.accountId = accountId;
    this.getPersonalInfo({accountId});
    this.getDynamic(data);
    this.getUrl();
  },

  getUrl:function(){
    this.setData({
      url:getApp().url.currentUrl+'/img'
    })
  },

  getPersonalInfo:function(data){
    httpRequest.getAccountById(data)
    .then(res=>{
      if(res.data.code!==1) return Promise.reject();
      this.setData({
        personalInfo:res.data.data
      })
    })
    .catch(err=>{
      wx.showToast({
        title: '有Bug，在改',
        icon:'error'
      })
    })
  },

  getDynamic:function(data){
    httpRequest.getDynamic(data)
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
      mergeObj(this.pageData,res.data.data.pageInfo)
      this.setData({
        dynamicList:[...this.data.dynamicList,...res.data.data.list]
      })
    })
  },

  onReachBottom:function(){
    if(this.pageData.currentPage<this.pageData.totalPages){
      this.pageData.currentPage++;
      const data = {
        type:2,
        accountId:this.pageData.accountId,
        currentPage:this.pageData.currentPage,
        pageSize:this.pageData.pageSize
      }
      this.getDynamic(data)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})