// pages/index/pages/question_detail/index.js
import {
  getStorageItem, mergeObj
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
    questionDetailData: {},
    currentPage: 0,
    totalPages: 1
  },

  pageData: {
    canClickCollect:true,
    questionId: undefined,
    currentHotPage: 1,
    currentNewPage: 1,
    pageSize: 6,
    totalPages: 1,
    totalRows: 0,
    hotAnswerList: [],
    newAnswerList: []
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
  initAnswerList: function () {
    this.pageData.currentHotPage = 1;
    this.pageData.currentNewPage = 1;
    this.pageData.hotAnswerList = [];
    this.pageData.newAnswerList = [];
    this.pageData.totalPages = 1;
    this.setData({
      answerList: []
    }, this.getAnswerList())
  },

  /*
   *选择回答的排序方式
   */
  changeAnswerSortType(e) {
    const answerSortType = e.target.dataset.type;
    if (answerSortType !== 0 && answerSortType !== 1) return;
    if (answerSortType === 1 && this.pageData.hotAnswerList.length !== 0) {
      this.setData({
        answerSortType,
        answerList: this.pageData.hotAnswerList,
        currentPage: this.pageData.currentHotPage
      })
    }
    else if (answerSortType === 0 && this.pageData.newAnswerList.length !== 0) {
      this.setData({
        answerSortType,
        answerList: this.pageData.newAnswerList,
        currentPage: this.pageData.currentNewPage
      })
    }
    else {
      this.setData({
        answerList: [],
        answerSortType,
        currentPage: 0
      }, () => {
        this.getAnswerList();
      })
    }
  },

  /**
   * 获取问题详情
   */
  getQuestionDetail: function () {
    const questionId = this.pageData.questionId;
    getStorageItem("accountId")
      .then(accountId => {
        return httpRequest.getQustionDetailById({
          questionId,
          accountId
        })
      })
      .then(res => {
        if (!res.data.code) return Promise.reject();
        const isCollected = res.data.data.isCollected ? true : false;
        this.setData({
          isCollected,
          questionDetailData: res.data.data
        })
      })
      .catch(err => {
        wx.showToast({
          title: '网络繁忙',
          type:'error'
        })
      })
  },

  /**
   * 获取回答列表
   */
  getAnswerList: function () {
    getStorageItem("accountId")
      .then(accountId => {
        const { currentHotPage, currentNewPage, pageSize, questionId } = this.pageData;
        const sortOrder = this.data.answerSortType;
        const currentPage = this.data.answerSortType ? currentHotPage : currentNewPage;
        const data = { accountId, currentPage, pageSize, questionId, sortOrder };
        return httpRequest.getAnswerList(data)
      })
      .then(res => {
        if (!res.data.code) return Promise.reject();
        mergeObj(this.pageData, res.data.data.pageInfo);
        if (this.data.answerSortType === 0) {
          this.pageData.newAnswerList = [...this.pageData.newAnswerList, ...res.data.data.list];
          this.setData({
            currentPage: this.pageData.currentNewPage,
            totalPages: this.pageData.totalPages
          })
        }
        else if (this.data.answerSortType === 1) {
          this.pageData.hotAnswerList = [...this.pageData.hotAnswerList, ...res.data.data.list]
          this.setData({
            currentPage: this.pageData.currentHotPage,
            totalPages: this.pageData.totalPages
          })
        }
        this.setData({
          answerList: this.data.answerSortType ? this.pageData.hotAnswerList : this.pageData.newAnswerList
        })
      })
      .catch(err => {
        wx.showToast({
          title: '回答列表err',
          icon: 'error'
        })
      })
  },

  /*
   *去写回答
   */
  gotoWriteAnswer: function () {
    wx.navigateTo({
      url: `/pages/index/pages/write_answer/index?questionDetailData=${encodeURIComponent(JSON.stringify(this.data.questionDetailData))}`,
    })
  },

  /*
   *收藏/取消收藏
   */
  addIntoCollection: function () {
    if(!this.pageData.canClickCollect) return;
    this.pageData.canClickCollect = false
    getStorageItem("accountId")
      .then(res => {
        const questionId = this.data.questionDetailData.questionId;
        const param = { questionId, accountId: res };
        if (this.data.isCollected) return httpRequest.cancelCollectionProblem(param)
        return httpRequest.CollectionProblem(param)
      })
      .then(res => {
        if (res.data.code) {
          const isCollected = !this.data.isCollected;
          const questionDetailData = JSON.parse(JSON.stringify(this.data.questionDetailData));
          isCollected ? questionDetailData.collectionCount++ : questionDetailData.collectionCount--;
          this.pageData.canClickCollect = true;
          this.setData({
            isCollected,
            questionDetailData
          })
        }else return Promise.reject('收藏失败')
      })
      .catch(err=>{
        this.pageData.canClickCollect = true;
      })
  },

  /**
   * 跳转回答详情页面
   */
  gotoAnswerDetail: function (e) {
    const answerId = e.currentTarget.dataset.answerid;
    const currentIndex = e.currentTarget.dataset.index*1+1;
    const questionDetail = this.data.questionDetailData;
    wx.navigateTo({
      url: `/pages/index/pages/answer_detail/index?answerId=${answerId}&questionDetail=${encodeURIComponent(JSON.stringify(questionDetail))}&currentIndex=${currentIndex}&totalRows=${this.pageData.totalRows}&sortOrder=${this.data.answerSortType}&questionId=${this.data.questionDetailData.questionId}`,
    })
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
    const { currentHotPage, currentNewPage, totalPages } = this.pageData;
    const { answerSortType } = this.data;
    if (answerSortType === 1 && currentHotPage < totalPages) {
      this.pageData.currentHotPage++;
      this.getAnswerList();
    }
    else if (answerSortType === 0 && currentNewPage < totalPages) {
      this.pageData.currentNewPage++;
      this.getAnswerList();
    }
  },

  onPullDownRefresh: function () {
    this.initAnswerList()
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '兄弟请看这道题！',
      success: function (shareTickets) {
      },
      fail: function (res) {
      },
      complete:function(res){
      }
    }
  }
})