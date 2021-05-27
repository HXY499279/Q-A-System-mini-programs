// pages/index/pages/show_comments/index.js
import httpRequest from '../../../../utils/request/index'
import {mergeObj} from '../../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
    totalPages:1,
    currentPage:0
  },

  pageData:{
    answerId:0,
    currentPage:1,
    pageSize:6,
    totalPages:1,
    totalRows:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const answerId = options.answerId;
    this.pageData.answerId = answerId;
    this.getComment();
  },


  getComment:function(){
    const data = {
      answerId:this.pageData.answerId,
      currentPage:this.pageData.currentPage,
      pageSize:this.pageData.pageSize
    }
    httpRequest.getComment(data)
    .then(res=>{
      mergeObj(this.pageData,res.data.data.pageInfo)
      this.setData({
        commentList:[...this.data.commentList,...res.data.data.list],
        totalPages:this.pageData.totalPages,
        currentPage:this.pageData.currentPage
      })
    })
  },
  back:function(){
    wx.navigateBack()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.pageData.currentPage<this.pageData.totalPages){
      this.pageData.currentPage++;
      this.getComment()
    }
  },
})