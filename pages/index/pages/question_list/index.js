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
    totalPages: 1,
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
        this.setData({ questionList :[...this.data.questionList,...questionList]})
      })
      .catch(err=>{
        wx.showToast({
          title: '网络忙 稍后试',
          icon:'error'
        })
      })
  },

  /**
   * 改变搜索框选择的状态
   */
  onChange: function (event) {
    const detail = event.detail;
    const newState = detail.value ? 1 : 0;

    const newPageData = {totalPages:1,totalRows:0,currentPage:1};
    mergeObj(this.pageData,newPageData);
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
    const newPageData = {totalPages:1,totalRows:0,currentPage:1};
    mergeObj(this.pageData,newPageData);
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.pageData.totalPages>this.pageData.currentPage){
      this.pageData.currentPage++;
      this.setQuestionList();
    }
  },
})