// index.js
import httpRequest from '../../utils/request/index';
import { getStorageItem } from '../../utils/api';
const { $Toast } = require('../../iview/base/index');

// 获取应用实例
const app = getApp()

Page({
  data: {
    isLoading: true,
    isError: false,
    url: "",
    imgUrls: ['/img/bg.jpeg'],
    currentCollege: '经济管理学院',//当前学院
    professionalCourses: [],
    basicCourses: []
  },

  onLoad() {
    this.getUrl();
    wx.setStorageSync('accountId', 1664781);
    Promise.all([this.listSubjectByCollege(), this.getUnreadMsg()])
      .then(res => {
        this.setData({
          isLoading: false
        })
      })
      .catch(err => {
        this.setData({
          isLoading: false
        })
        $Toast({
          content: "您当前处于离线模式",
          type: 'warning'
        });
      })
  },

  getUrl: function () {
    this.setData({
      url: getApp().url.currentUrl + '/img/'
    })
  },

  /**
   * 获取首页轮播图
   */
  getSwiper: function () {
    return new Promise((resolve, reject) => {
      httpRequest.getImgs({ type: 1 })
        .then(res => {
          console.log(res)
          // this.setData({
          //   imgUrls:res.data.
          // })
        })
    })
  },
  /**
   * 获取专业课程
   */
  listSubjectByCollege: function () {
    return new Promise((resolve, reject) => {
      httpRequest.listSubjectByCollege({ college: this.data.currentCollege })
        .then(res => {
          if (res.data.code !== 1) return reject();
          let { code, data } = res.data;
          if (data.length >= 7) {
            data = data.slice(0, 7)
          }
          if (code) {
            this.setData({
              professionalCourses: data,
            });
            resolve()
          }
        })
    })
  },

  /**
   * 获取未读消息数量
   */
  getUnreadMsg: function () {
    return new Promise((resolve, reject) => {
      getStorageItem("accountId")
        .then(accountId => {
          return httpRequest.getUnReadMsg({ accountId })
        })
        .then(res => {
          if (res.data.code !== 1) return reject();
          if (res.data.data !== 0) {
            wx.setTabBarBadge({
              index: 3,
              text: String(res.data.data)
            });
            resolve()
          }
        })
    })
  },
  /**
   * 跳转到问题列表页
   */
  gotoQuestionList(e) {
    const subjectId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/index/pages/question_list/index?subjectId=${subjectId}`,
    })
  },

  /**
   * 跳转到问题详情页
   */
  togoQuestionDetail() {
    wx.navigateTo({
      url: '/pages/index/pages/question_detail/index',
    })
  },

  /**
   * 点击更多课程
   */
  showMore: function (e) {
    const type = e.currentTarget.dataset.type;
    if (type === "professional") {
      wx.navigateTo({
        url: `/pages/index/pages/show_more_course/index?type=${type}&college=${this.data.currentCollege}`,
      }
      )
    } else if (type === "basic") {
      wx.navigateTo({
        url: `/pages/index/pages/show_more_course/index?type=${type}`,
      })
    }
  },

  onPullDownRefresh: function () {
    Promise.all([this.getUnreadMsg(), this.listSubjectByCollege()])
      .then(res => {
        wx.stopPullDownRefresh();
        this.setData({
          isLoading: false
        })
      })
  }
})
