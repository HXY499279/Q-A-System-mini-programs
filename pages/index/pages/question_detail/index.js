// pages/index/pages/question_detail/index.js
import {
  getStorageItem
} from '../../../../utils/api'
const app = getApp();
import httpRequest from '../../../../utils/request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerSortType: 0, //0 最新； 1 最热
    isCollected: false,
    answerList: [],
    questionDetailData: {}
  },

  pageData:{
    questionId:undefined,
    currentPage:1,
    pageSize:6,
    totalPages:1,
    totalRows:0
  },

  //选择回答的排序方式
  changeAnswerSortType(e) {
    const answerSortType = e.target.dataset.type;
    this.setData({
      answerSortType
    })
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
  },

  /**
   * 获取回答列表
   */
  getAnswerList:function(){
    getStorageItem("accountId")
    .then(accountId=>{
      const {currentPage,pageSize,questionId} = this.pageData;
      const sortOrder = this.data.answerSortType;
      const data = {accountId,currentPage,pageSize,questionId,sortOrder};
      return httpRequest.getAnswerList(data)
    })
    .then(res=>{
      if(!res.data.code) return Promise.reject();
      const answerList = [...this.data.answerList,...res.data.data.list]
      const {currentPage,pageSize,totalPages,totalRows} = res.data.data.pageInfo;
       this.setData({
        answerList,
        currentPage,
        pageSize,
        totalPages,
        totalRows
       })
    })
  },

  //去写回答
  gotoWriteAnswer :function() {
    wx.navigateTo({
      url: `/pages/index/pages/write_answer/index?questionDetailData=${encodeURIComponent(JSON.stringify(this.data.questionDetailData))}`,
    })
  },

  //收藏/取消收藏
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})