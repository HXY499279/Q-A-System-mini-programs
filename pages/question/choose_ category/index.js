// pages/question/choose_ category/index.js
import httpRequest from '../../../utils/request/index';
import { mergeObj } from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //所有学科
    categorys: [],
    currentPage: 0,
    totalPages: 1,
    listLoading: true,
  },

  /**
   * 页面数据
   */
  pageData: {
    currentPage: 1,
    pageSize: 7,
    totalRows: 0,
    totalPages: 1,
    keyWord: '',
    timer: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { currentPage, pageSize } = this.pageData;
    const data = { currentPage, pageSize }
    this.searchSubject(data);
  },
  /**
   * 获取科目信息
   */
  searchSubject: function (data) {
    httpRequest.searchSubject(data)
      .then(res => {
        const categorys = res.data.data.list;
        mergeObj(this.pageData, res.data.data.pageInfo)
        this.setData({
          categorys: [...this.data.categorys, ...categorys],
          currentPage: this.pageData.currentPage,
          totalPages: this.pageData.totalPages,
          listLoading: false,
        });
      })
      .catch(err => {
        wx.showToast({
          icon: "error",
          title: "获取课程失败",
          duration: 2000
        });
      })
  },

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
        data = { currentPage, pageSize };
      } else {
        data = { currentPage, pageSize, keyWords }
      }
      this.setData({
        categorys: [],
        listLoading: true,
      }, this.searchSubject(data));
    }, 500);
    this.pageData.timer = newTimer;
  },

  onReachBottom: function () {
    if (this.pageData.currentPage < this.pageData.totalPages) {
      this.pageData.currentPage++;
      let data = {};
      const { keyWords, currentPage, pageSize } = this.pageData;
      if (keyWords) {
        data = { keyWords, currentPage, pageSize }
      } else {
        data = { currentPage, pageSize }
      }
      this.searchSubject(data)
    }
  }
})