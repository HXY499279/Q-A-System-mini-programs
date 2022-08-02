// pages/index/pages/show_more_course/index.js
import httpRequest from '../../../../utils/request/index';
import { mergeObj } from '../../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couseList: [],
    totalPages: 1,
    currentPage: 0,
    category: "学科名称",
    categoryMap: {
      basic: '学科名称',
      postgraduate: "院校名称"
    },
    listLoading: true,
  },

  pageData: {
    currentPage: 1,
    pageSize: 6,
    totalPages: 1,
    totalRows: 0,
    college: undefined,
    keyWords: undefined,
    timer: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { college, type } = options;
    const { categoryMap } = this.data
    this.setData({
      category: categoryMap[type]
    })
    const { currentPage, pageSize } = this.pageData;
    let data;
    if (college) {
      this.pageData.college = college;
      data = { currentPage, pageSize, college }
    } else {
      data = { currentPage, pageSize }
    }
    this.getCourse(data)
  },

  getCourse: function (data) {
    httpRequest.getCouseList(data)
      .then(res => {
        if (res.data.code !== 1) return Promise.resolve();
        mergeObj(this.pageData, res.data.data.pageInfo)
        this.setData({
          couseList: [...this.data.couseList, ...res.data.data.list],
          currentPage: this.pageData.currentPage,
          totalPages: this.pageData.totalPages,
          listLoading: false,
        })
      })
      .catch(err => {
        wx.showToast({
          title: '获取列表失败',
          type: 'error',
          duration: 1500
        })
      })
  },
  /**
   * 搜索课程
   */
  searchInput: function (e) {
    if (this.pageData.timer) {
      clearInterval(this.pageData.timer);
      this.pageData.timer = null;
    }
    const newTimer = setTimeout(() => {
      const keyWords = e.detail.value;
      const newPageData = { totalPages: 1, totalRows: 0, currentPage: 1 };
      mergeObj(this.pageData, newPageData);
      const { currentPage, pageSize, college } = this.pageData;
      this.pageData.keyWords = keyWords;
      let data = {};

      if (keyWords.trim() === '') {
        college ?
          data = { currentPage, pageSize, college } :
          data = { currentPage, pageSize };
      } else {
        college ?
          data = { currentPage, pageSize, college, keyWords } :
          data = { currentPage, pageSize, keyWords }
      }
      this.setData({
        couseList: [],
        listLoading:true,
      }, this.getCourse(data));

    }, 500);
    this.pageData.timer = newTimer;
  },

  gotoQuestionList: function (e) {
    const { subjectid: subjectId, name: subjectName } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/index/pages/question_list/index?subjectId=${subjectId}&subjectName=${subjectName}`,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.pageData.currentPage < this.pageData.totalPages) {
      this.pageData.currentPage++;
      let data = {};
      const { keyWords, college, currentPage, pageSize } = this.pageData;
      if (keyWords) {
        college ?
          data = { keyWords, college, currentPage, pageSize } :
          data = { keyWords, currentPage, pageSize }
      } else {
        college ?
          data = { college, currentPage, pageSize } :
          data = { currentPage, pageSize }
      }
      this.getCourse(data)
    }
  },

})