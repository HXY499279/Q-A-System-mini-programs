// pages/index/pages/show_more_course/index.js
import httpRequest from '../../../../utils/request/index';
import {mergeObj} from '../../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couseList:[]
  },

  pageData:{
    currentPage:1,
    pageSize:6,
    totalPages:1,
    totalRows:0,
    college:undefined,
    keyWords:undefined,
    timer:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {type,college} = options;
    const {currentPage,pageSize } = this.pageData;
    let data;
    if(college){
      this.pageData.college = college;
      data = {currentPage,pageSize,college}
    }else{
      data = {currentPage,pageSize}
    }   
   this.getCourse(data)
  },

  getCourse:function(data){
    wx.showToast({
      title: '加载中',
      icon:'loading',
      duration:10000
    })
    httpRequest.getCouseList(data)
    .then(res=>{
      if(res.data.code!==1) return Promise.resolve();
      wx.hideToast();
      this.setData({
        couseList:[...this.data.couseList,...res.data.data.list]
      })
      mergeObj(this.pageData,res.data.data.pageInfo)
    })
    .catch(err=>{
      wx.showToast({
        title: '网络忙（有bug)',
        type:'error',
        duration:2000
      })
    })
  },
  /**
   * 搜索课程
   */
  searchInput:function(e){
   if(this.pageData.timer) {
     clearInterval(this.pageData.timer);
     this.pageData.timer = null;
    }
    const newTimer = setTimeout(()=>{
      const keyWords = e.detail.value;
      const newPageData = {totalPages:1,totalRows:0,currentPage:1};
      mergeObj(this.pageData,newPageData); 
      const {currentPage,pageSize,college} = this.pageData;
      this.pageData.keyWords = keyWords;
      let data = {};

      if(keyWords.trim() === ''){
      college ? 
      data = {currentPage,pageSize,college} :
      data = {currentPage,pageSize} ;
      }else{
        college ?
        data = {currentPage,pageSize,college,keyWords} :
        data = {currentPage,pageSize,keyWords}
      }
      this.setData({
        couseList:[]
      },this.getCourse(data));

    },500);
    this.pageData.timer = newTimer;
  },

  gotoQuestionList:function(e){
    const subjectId = e.currentTarget.dataset.subjectid;
    wx.navigateTo({
      url: `/pages/index/pages/question_list/index?subjectId=${subjectId}`,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.pageData.currentPage < this.pageData.totalPages){
      this.pageData.currentPage++;
      let data = {};
      const {keyWords,college,currentPage,pageSize} = this.pageData;
      if(keyWords){
        college?
        data = {keyWords,college,currentPage,pageSize} :
        data = {keyWords,currentPage,pageSize}
      }else{
        college?
        data = {college,currentPage,pageSize} :
        data = {currentPage,pageSize}
      }
      this.getCourse(data)
    }
  },

})