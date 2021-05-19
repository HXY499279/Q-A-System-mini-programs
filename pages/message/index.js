// pages/message/index.js
import httpRequest from '../../utils/request/index'
import {mergeObj} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:[]
  },

  pageData:{
    currentPage:1,
    pageSize:6,
    totalPages:1,
    totalRows:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = {pageSize:this.pageData.pageSize,currentPage:this.pageData.currentPage}
    this.setNewsList(data);
  },

  setNewsList: function(data){
    httpRequest.getNews(data)
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
      const {currentPage,pageSize,totalPages,totalRows} = res.data.data.pageInfo;
      mergeObj(this.pageData,{currentPage,pageSize,totalPages,totalRows})
      this.setData({
        messageList:[...this.data.messageList,...res.data.data.list]
      })
    })
  },

  onReachBottom:function(){
    if(this.pageData.totalPages>this.pageData.currentPage){
      this.pageData.currentPage++;
      this.setNewsList();
    }
  }



})