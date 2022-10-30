// pages/index/pages/question_list/index.js
import httpRequest from '../../../../utils/request/index'
import { mergeObj } from '../../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    topQuestionList: [],
    questionList: [],
    totalPages: 1,
    currentPage: 0,
    questionListLoading: true,
  },

  //该页面的全局变量
  pageData: {
    subjectId: undefined,
    subjectName: '',
    timer: null,
    currentPage: 1,
    pageSize: 8,
    totalPages: 1,
    totalRows: 0,
    keyWords: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { subjectId, subjectName } = options;
    const { state } = this.data;

    const { currentPage, pageSize } = this.pageData;
    let data;
    if (subjectId == 'undefined') {
      data = { subjectName, state, currentPage, pageSize }
    } else {
      data = { subjectId, state, currentPage, pageSize }
    };

    wx.setNavigationBarTitle({
      title: subjectName
    })
    this.pageData.subjectId = subjectId;
    this.pageData.subjectName = subjectName;
    // 提前获取未解和已解的问题数量，进行用户体验优化，如果未解数量为0并且已解数量不为0或者指定问题数量不为0则直接显示已解问题
    const topQuestionList = subjectId !== 'undefined' ? await this.getTopQuestionList({ subjectId }) : []
    this.setData({
      topQuestionList
    })
    const unFinishedLength = await this.getQuestionListLength(data)
    const finishedLength = await this.getQuestionListLength({ ...data, state: 1 })
    if (unFinishedLength === 0 && (topQuestionList.length !== 0 || finishedLength !== 0)) {
      // 显示已解问题
      this.setQuestionList({ ...data, state: 1 });
    } else {
      // 显示未解问题
      this.setQuestionList(data);
    }
  },

  /* 
    获取置顶问题列表
  */
  getTopQuestionList: async function (data) {
    return httpRequest.getTopQuestionList(data)
      .then(res => {
        const topQuestionList = res.data.data
        for (let item of topQuestionList) {
          item.question.isTop = 1
        }
        return topQuestionList
      })
      .catch(err => {
        wx.showToast({
          title: '网络忙',
          icon: 'error'
        })
      })
  },

  /* 
    获取问题列表的长度
  */
  getQuestionListLength: async function (data) {
    return httpRequest.getQuestionList(data)
      .then(res => {
        const { list: questionList } = res.data.data;
        return questionList.length
      })
      .catch(err => {
        wx.showToast({
          title: '网络忙',
          icon: 'error'
        })
      })
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
        let mergeQuestionList = null
        if (data.state === 1) {
          mergeQuestionList = [...this.data.topQuestionList, ...this.data.questionList, ...questionList]
        } else {
          mergeQuestionList = [...this.data.questionList, ...questionList]
        }
        this.setData({
          questionList: mergeQuestionList,
          currentPage: this.pageData.currentPage,
          totalPages: this.pageData.totalPages,
          questionListLoading: false,
          state: data.state
        })
      })
      .catch(err => {
        wx.showToast({
          title: '网络忙',
          icon: 'error'
        })
      })
  },

  /**
   * 改变搜索框选择的状态
   */
  onChange: function (event) {
    this.setData({
      questionList: [],
      questionListLoading: true
    }, () => {
      const detail = event.detail;
      const newState = detail.value ? 1 : 0;
      const newPageData = { totalPages: 1, totalRows: 0, currentPage: 1 };
      mergeObj(this.pageData, newPageData);
      const { subjectId, currentPage, pageSize, keyWords, subjectName } = this.pageData;
      const data = keyWords.trim() === "" ?
        subjectId != 'undefined' ? ({ subjectId, currentPage, pageSize, state: newState }) : ({ subjectName, currentPage, pageSize, state: newState }) :
        subjectId != 'undefined' ? ({ subjectId, currentPage, pageSize, keyWords, state: newState }) : ({ subjectName, currentPage, pageSize, keyWords, state: newState })
      this.setData({
        state: newState
      })
      this.setQuestionList(data)
    })
  },

  searchInput: function (e) {
    const oldTimer = this.pageData.timer;
    if (oldTimer) {
      clearTimeout(oldTimer);
      this.pageData.timer = null;
    }

    let newTimer = setTimeout(() => {
      const newPageData = { totalPages: 1, totalRows: 0, currentPage: 1 };
      mergeObj(this.pageData, newPageData);
      const keyWords = e.detail.value;
      this.pageData.keyWords = keyWords;
      let data = {};
      const { subjectId, currentPage, pageSize, subjectName } = this.pageData;
      const state = this.data.state;

      if (keyWords.trim() === "") {
        data = subjectId != 'undefined' ? { subjectId, state, currentPage, pageSize } : { subjectName, state, currentPage, pageSize }
      }
      else {
        data = subjectId != 'undefined' ? { subjectId, state, currentPage, pageSize, keyWords } : { subjectName, state, currentPage, pageSize, keyWords }
      }
      this.setData({
        questionList: [],
        questionListLoading: true
      }, this.setQuestionList(data))

    }, 300);

    this.pageData.timer = newTimer;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.pageData.totalPages > this.pageData.currentPage) {
      this.pageData.currentPage++;
      const { keyWords, currentPage, pageSize, subjectId, subjectName } = this.pageData;
      const state = this.data.state;
      let data = {};
      if (keyWords) data = subjectId != 'undefined' ? { currentPage, pageSize, subjectId, state, keyWords } : { currentPage, pageSize, subjectName, state, keyWords }
      else data = subjectId != 'undefined' ? { currentPage, pageSize, subjectId, state } : { currentPage, pageSize, subjectName, state };
      this.setQuestionList(data)
    }
  },
})