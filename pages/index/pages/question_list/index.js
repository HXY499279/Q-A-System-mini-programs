// pages/index/pages/question_list/index.js
import httpRequest from '../../../../utils/request/index'
import { mergeObj } from '../../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    questionList: [],
  },

  //该页面的全局变量
  pageData: {
    subjectId: 0,
    timer: null,
    currentPage: 1,
    pageSize: 5,
    totalPages: 0,
    totalRows: 0,
    keyWords: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { subjectId } = options;
    const { state } = this.data;
    const { currentPage, pageSize } = this.pageData;
    const data = {
      subjectId, state, currentPage, pageSize
    };
    this.pageData.subjectId = subjectId;
    this.setQuestionList(data);
  },

  /**
   * 初始化页面获取列表数据
   */
  setQuestionList: function (data) {
    httpRequest.getQuestionList(data)
      .then(res => {
        const { list: questionList, pageInfo: { totalPages, totalRows } } = res.data.data;
        const newPageData = { totalPages, totalRows }
        mergeObj(this.pageData, newPageData)
        this.setData({ questionList })
      })
  },

  /**
   * 改变搜索框选择的状态
   */
  onChange: function (event) {
    const detail = event.detail;
    const newState = detail.value ? 1 : 0;
    const { subjectId, currentPage, pageSize, keyWords } = this.pageData;
    const data = keyWords.trim()===""?
        ({subjectId, currentPage, pageSize,state: newState}):
        ({subjectId, currentPage, pageSize, keyWords, state: newState})
    this.setData({
      state: newState
    })
    this.setQuestionList(data)
  },

  searchInput: function (e) {
    this.pageData.currentPage = 1;
    const keyWords = e.detail.value;
    this.pageData.keyWords = keyWords;
    let data = {};
    const { subjectId, currentPage, pageSize } = this.pageData;
    const state = this.data.state;

    if (keyWords.trim() === "") {
      data = { subjectId, state, currentPage, pageSize }
    }
    else{
      data = { subjectId, state, currentPage, pageSize, keyWords}
    }

    const oldTimer = this.pageData.timer;
    if (oldTimer) clearTimeout(oldTimer)
    let newTimer = setTimeout(() => {
      this.setQuestionList(data)
    }, 300);
    this.pageData.timer = newTimer;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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