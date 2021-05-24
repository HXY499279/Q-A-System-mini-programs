// pages/index/pages/question_detail/index.js
import {
  getStorageItem,mergeObj
} from '../../../../utils/api'
const app = getApp();
import httpRequest from '../../../../utils/request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerSortType: 1, //0 最新； 1 最热
    isCollected: false,
    answerList: [],
    questionDetailData: {}
  },

  pageData:{
    questionId:undefined,
    currentHotPage:1,
    currentNewPage:1,
    pageSize:4,
    totalPages:1,
    totalRows:0,
    shouldUnshiftIntoNewList:false,
    hotAnswerList:[],
    newAnswerList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { questionId } = options;
    this.pageData.questionId = questionId;
    this.getQuestionDetail();
    this.getAnswerList();
  },

  /**
   * 从写回答页面跳转回来重新加载数据
   */
  initAnswerList:function(){
    this.pageData.currentHotPage = 1;
    this.pageData.currentNewPage = 1;
    this.pageData.hotAnswerList = [];
    this.pageData.newAnswerList = [];
    this.pageData.totalPages = 1;
    this.setData({
      answerList:[]
    },this.getAnswerList())
  },

  /*
   *选择回答的排序方式
   */
  changeAnswerSortType(e) {
    const answerSortType = e.target.dataset.type;
    if(answerSortType !==0 && answerSortType!==1) return;
    if(answerSortType === 1 && this.pageData.hotAnswerList.length!==0){
      this.setData({
        answerSortType,
        answerList:this.pageData.hotAnswerList
      })
    }
    else if(answerSortType === 0 && this.pageData.newAnswerList.length!==0){
      this.setData({
       answerSortType,
       answerList:this.pageData.newAnswerList
       })
    }
    else{
      answerSortType === 1 ? this.pageData.shouldUnshiftIntoNewList = true : ''
      this.setData({
        answerList:[],
        answerSortType
      },()=>{
        this.getAnswerList();
      })
    }
  },
  /**
   * 获取问题详情
   */
  getQuestionDetail: function () {
    const questionId =  this.pageData.questionId;
    getStorageItem("accountId")
      .then(accountId => {
        return httpRequest.getQustionDetailById({
          questionId,
          accountId
        })
      })
      .then(res => {
        if(!res.data.code) return Promise.reject();
        const isCollected = res.data.data.isCollected ? true : false;
        this.setData({
          isCollected,
          questionDetailData: res.data.data
        })
      })
      .catch(err=>{
        wx.showToast({
          title: '网络忙 稍后试',
          type:'error'
        })
      })
  },

  /**
   * 获取回答列表
   */
  getAnswerList:function(){
    getStorageItem("accountId")
    .then(accountId=>{
      const {currentHotPage,currentNewPage,pageSize,questionId} = this.pageData;
      const sortOrder = this.data.answerSortType;
      const currentPage = this.data.answerSortType ? currentHotPage : currentNewPage;
      const data = {accountId,currentPage,pageSize,questionId,sortOrder};
      return httpRequest.getAnswerList(data)
    })
    .then(res=>{
      if(!res.data.code) return Promise.reject();
      if(this.data.answerSortType === 0) {
        this.pageData.newAnswerList = [...this.pageData.newAnswerList,...res.data.data.list]
      }
      else if(this.data.answerSortType === 1){
        this.pageData.hotAnswerList = [...this.pageData.hotAnswerList,...res.data.data.list]
      }
     
      const {pageSize,totalPages,totalRows} = res.data.data.pageInfo;
      const newData = {pageSize,totalPages, totalRows}
      mergeObj(this.pageData,newData);

       this.setData({
        answerList : this.data.answerSortType ? this.pageData.hotAnswerList : this.pageData.newAnswerList
       })
    })
    .catch(err=>{
      wx.showToast({
        title: '网络忙',
        icon:'error'
      })
    })
  },

  /*
   *去写回答
   */
  gotoWriteAnswer :function() {
    wx.navigateTo({
      url: `/pages/index/pages/write_answer/index?questionDetailData=${encodeURIComponent(JSON.stringify(this.data.questionDetailData))}`,
    })
  },

  /*
   *收藏/取消收藏
   */
  addIntoCollection:function() {
    getStorageItem("accountId")
      .then(res => {
        const questionId = this.data.questionDetailData.questionId;
        const param = {questionId,accountId: res};
        if (this.data.isCollected) return httpRequest.cancelCollectionProblem(param)
        return httpRequest.CollectionProblem(param)
      })
      .then(res => {
        if(res.data.code){
          const isCollected = !this.data.isCollected;
          const  questionDetailData = JSON.parse(JSON.stringify(this.data.questionDetailData));
          isCollected ? questionDetailData.collectionCount++ : questionDetailData.collectionCount--;
          this.setData({
            isCollected,
            questionDetailData
          })
        }
      })
  },

  /**
   * 跳转回答详情页面
   */
  gotoAnswerDetail:function(e) {
    const answerDetail = e.currentTarget.dataset.answerdetail;
    const questionDetail = this.data.questionDetailData;
    wx.navigateTo({
      url: `/pages/index/pages/answer_detail/index?answerDetail=${encodeURIComponent(JSON.stringify(answerDetail))}&questionDetail=${encodeURIComponent(JSON.stringify(questionDetail))}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.pageData.currentHotPage = 1;
    this.pageData.currentNewPage = 1;
    this.pageData.hotAnswerList = [];
    this.pageData.newAnswerList = [];
    this.getAnswerList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {currentHotPage,currentNewPage,totalPages} = this.pageData;
    const {answerSortType}= this.data;
    if(answerSortType===1 && currentHotPage<totalPages){
      this.pageData.currentHotPage++;
      this.getAnswerList();
    }
    else if(answerSortType===0 && currentNewPage<totalPages){
      this.pageData.currentNewPage++;
      this.getAnswerList();
    }
  },

  onPullDownRefresh:function(){
      this.initAnswerList()
      wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})