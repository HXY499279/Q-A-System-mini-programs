// pages/email/index.js
import httpRequest from '../../utils/request/index'
import {
  getStorageItem, mergeObj
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    currentType: "dynamic",
    dynamicList: [],
    invitationList: [],
    collectionList: [],
    myquestionList: [],
    totalPages: 1,
    currentPage: 0,
    listLoading: true,
    //邮件模块上面的导航栏
    topBar: [{
      "icon": "/img/email/dynamic.svg",
      "type": "dynamic",
      "text": "动态",
      "backgroundColor": "#6BA1DD",
    }, {
      "icon": "/img/email/write.svg",
      "type": "invitation",
      "text": "邀请回答",
      "backgroundColor": "#FF8D1A",
    }, {
      "icon": "/img/email/collection.svg",
      "type": "collection",
      "text": "收藏",
      "backgroundColor": "#F87053",
    }, {
      "icon": "/img/email/myquestion.svg",
      "type": "myquestion",
      "text": "我的提问",
      "backgroundColor": "#2DC4BA",
    }]
  },

  pageData: {
    currentType: "dynamic",
    pageSize: 5,
    dynamicTotalPages: 1,
    dynamicCurrentPage: 1,
    invitationTotalPages: 1,
    invitationCurrentPage: 1,
    collectionTotalPages: 1,
    collectionCurrentPage: 1,
    myqustionTotalPages: 1,
    myquestionCurrentPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const accountId = wx.getStorageSync('accountId')
    if (accountId) {
      this.setData({
        isLogin: true
      })
      this.getDynamic();
    } else {
      wx.showToast({
        title: '请登录',
        icon: 'none'
      })
      this.setData({
        totalPages: 0
      })
    }
  },

  changeItem: function (e) {
    const { type } = e.currentTarget.dataset;
    if (this.pageData.currentType === type) return
    this.pageData.currentType = type;
    switch (type) {
      case "dynamic":
        if (this.data.dynamicList.length === 0) {
          this.setData({
            listLoading: true
          })
          this.getDynamic();
        }
        break;
      case "invitation":
        if (this.data.invitationList.length === 0) {
          this.setData({
            listLoading: true
          })
          this.getInvitation();
        }
        break;
      case "collection":
        if (this.data.collectionList.length === 0) {
          this.setData({
            listLoading: true
          })
          this.getCollection();
        }
        break;
      case "myquestion":
        if (this.data.myquestionList.length === 0) {
          this.setData({
            listLoading: true
          })
          this.getMyqustion();
        }
        break;
    }
    this.setData({
      currentType: type
    })
  },

  getDynamic: function () {
    if (!this.data.isLogin) return;
    getStorageItem("accountId")
      .then(accountId => {
        const data = {
          type: 1,
          accountId,
          currentPage: this.pageData.dynamicCurrentPage,
          pageSize: this.pageData.pageSize
        }
        return httpRequest.getDynamic(data)
      })
      .then(res => {
        if (res.data.code !== 1) return Promise.reject("获取动态失败");
        this.pageData.dynamicTotalPages = res.data.data.pageInfo.totalPages;
        this.setData({
          dynamicList: [...this.data.dynamicList, ...res.data.data.list],
          totalPages: this.pageData.dynamicTotalPages,
          currentPage: this.pageData.dynamicCurrentPage,
          listLoading: false
        })
      })
      .catch(err => {
        wx.showToast({
          title: String(err),
          icon: "none"
        })
      })
  },

  getInvitation: function () {
    if (!this.data.isLogin) return;
    getStorageItem("accountId")
      .then(accountId => {
        const data = {
          accountId,
          currentPage: this.pageData.invitationCurrentPage,
          pageSize: this.pageData.pageSize
        }
        return httpRequest.getInvitation(data)
      })
      .then(res => {
        if (res.data.code !== 1) return Promise.reject('获取邀请失败');
        this.pageData.invitationTotalPages = res.data.data.pageInfo.totalPages;
        this.setData({
          invitationList: res.data.data.list,
          totalPages: this.pageData.invitationTotalPages,
          currentPage: this.pageData.invitationCurrentPage,
          listLoading: false
        })
      })
      .catch(err => {
        wx.showToast({
          title: String(err),
          icon: "none"
        })
      })
  },

  getCollection: function () {
    if (!this.data.isLogin) return;
    getStorageItem("accountId")
      .then(accountId => {
        const data = {
          relatedType: 2,
          accountId,
          currentPage: this.pageData.collectionCurrentPage,
          pageSize: this.pageData.pageSize
        }
        return httpRequest.getAboutMyQuestion(data)
      })
      .then(res => {
        if (res.data.code !== 1) return Promise.reject("获取收藏失败");
        this.pageData.collectionTotalPages = res.data.data.pageInfo.totalPages;
        this.setData({
          collectionList: [...this.data.collectionList, ...res.data.data.list],
          totalPages: this.pageData.collectionTotalPages,
          currentPage: this.pageData.collectionCurrentPage,
          listLoading: false
        })
      })
      .catch(err => {
        wx.showToast({
          title: String(err),
          icon: "none"
        })
      })
  },

  getMyqustion: function () {
    if (!this.data.isLogin) return;
    getStorageItem("accountId")
      .then(accountId => {
        const data = {
          relatedType: 1,
          accountId,
          currentPage: this.pageData.myquestionCurrentPage,
          pageSize: this.pageData.pageSize
        }
        return httpRequest.getAboutMyQuestion(data)
      })
      .then(res => {
        if (res.data.code !== 1) return Promise.reject("获取问题失败");
        this.pageData.myqustionTotalPages = res.data.data.pageInfo.totalPages;
        this.setData({
          myquestionList: [...this.data.myquestionList, ...res.data.data.list],
          totalPages: this.pageData.myqustionTotalPages,
          currentPage: this.pageData.myquestionCurrentPage,
          listLoading: false
        })
      })
      .catch(err => {
        wx.showToast({
          title: String(err),
          icon: "none"
        })
      })
  },

  onShow: function () {
    wx.removeTabBarBadge({
      index: 3
    })
    const accountId = wx.getStorageSync('accountId')
    if (accountId && !this.data.isLogin) {
      this.setData({
        isLogin: true
      }, wx.startPullDownRefresh())
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isLogin) return;
    const type = this.data.currentType;
    switch (type) {
      case "dynamic":
        if (this.pageData.dynamicCurrentPage < this.pageData.dynamicTotalPages) {
          this.pageData.dynamicCurrentPage++;
          this.getDynamic();
        }
        break;
      case "invitation":
        if (this.pageData.invitationCurrentPages < this.pageData.invitationTotalPages) {
          this.pageData.invitationCurrentPages++;
          this.getInvitation();
        }
        break;
      case "collection":
        if (this.pageData.collectionCurrentPage < this.pageData.collectionTotalPages) {
          this.pageData.collectionCurrentPage++;
          this.getCollection();
        }
        break;
      case "myquestion":
        if (this.pageData.myquestionCurrentPage < this.pageData.myqustionTotalPages) {
          this.pageData.myquestionCurrentPage++;
          this.getMyqustion();
        }
        break;
    }
  },

  onPullDownRefresh: function () {
    if (!this.data.isLogin) {
      wx.stopPullDownRefresh()
      return;
    };
    const type = this.data.currentType;
    const data = {
      dynamicTotalPages: 1,
      dynamicCurrentPage: 1,
      invitationTotalPages: 1,
      invitationCurrentPage: 1,
      collectionTotalPages: 1,
      collectionCurrentPage: 1,
      myqustionTotalPages: 1,
      myquestionCurrentPage: 1
    }
    this.setData({
      dynamicList: [],
      invitationList: [],
      collectionList: [],
      myquestionList: []
    }, () => {
      mergeObj(this.pageData, data);
      switch (type) {
        case "dynamic":
          this.getDynamic();
          break;
        case "invitation":
          this.getInvitation();
          break;
        case "collection":
          this.getCollection();
          break;
        case "myquestion":
          this.getMyqustion();
          break;
      }
    })
    wx.stopPullDownRefresh()
  }
})