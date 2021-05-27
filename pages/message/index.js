// pages/message/index.js
import httpRequest from '../../utils/request/index'
import {mergeObj} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:[],
    currentPage:0,
    totalPages:1
  },

  pageData:{
    currentPage:1,
    pageSize:6,
    totalPages:1,
    totalRows:0,
    timer:null,
    keyWords:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = {pageSize:this.pageData.pageSize,currentPage:this.pageData.currentPage}
    this.setNewsList(data);
  },

  searchInput:function(e){
      if(this.pageData.timer) {
        clearTimeout(this.pageData.timer);
        this.pageData.timer = null;
      }
  
      let newTimer = setTimeout(()=>{
        const newPageData = {totalPages:1,totalRows:0,currentPage:1};
        mergeObj(this.pageData,newPageData);
  
        const keyWords = e.detail.value;
        let data = {};
        this.pageData.keyWords = keyWords;
  
        if(keyWords.trim() === ""){
          data = {
            currentPage:this.pageData.currentPage,
            pageSize:this.pageData.pageSize,
          }
        }
  
        else{
          data = {
            currentPage:this.pageData.currentPage,
            pageSize:this.pageData.pageSize,
            keyWords
          }
        }
        this.setData({
          messageList:[]
        },this.setNewsList(data))
      },300);
      this.pageData.timer = newTimer;
  },

  setNewsList: function(data){
    httpRequest.getNews(data)
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
      mergeObj(this.pageData, res.data.data.pageInfo)
      this.setData({
        messageList:[...this.data.messageList,...res.data.data.list],
        totalPages:res.data.data.pageInfo.totalPages,
        currentPage:res.data.data.pageInfo.currentPage
      })
    })
  },

  onReachBottom:function(){
    if(this.pageData.totalPages>this.pageData.currentPage){
      this.pageData.currentPage++ ;
      let data = {};
      if(this.pageData.keyWords){
        data = {
          currentPage:this.pageData.currentPage,
          pageSize:this.pageData.pageSize,
          keyWords:this.pageData.keyWords
        }
      }else{
        data = {
          currentPage:this.pageData.currentPage,
          pageSize:this.pageData.pageSize,
        }
      }
      this.setNewsList(data)
    }
  },

  gotoMsgDetail:function(e){
    const newsId = e.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: `/pages/message/message_detail/index?newsId=${newsId}`,
    })
  },

  onPullDownRefresh:function(){
    this.pageData.currentPage = 1;
    const data = {pageSize:this.pageData.pageSize,currentPage:this.pageData.currentPage}
    this.setNewsList(data)
    wx.stopPullDownRefresh();
  }
})