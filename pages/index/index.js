// index.js
import httpRequest from '../../utils/request/index';
import {
  getStorageItem
} from '../../utils/api';

// 获取应用实例
const app = getApp()
import {
  $Toast
} from '../../iview/base/index'

Page({
  data: {
    chooseCollege: false, //控制选择科目的弹窗
    isLoading: true,
    isError: false,
    isLogin: false,
    url: "",
    imgUrls: [],
    collegeList: [],
    currentCollege: undefined, //当前学院
    professionalCourses: [],
    basicCourses: [],
    otherDetail: {}
  },

  pageData: {
    showTest: true,
    currentCollege: ''
  },

  onLoad() {
    this.getUrl();
    const currentCollege = wx.getStorageSync('college')
    if (currentCollege) {
      this.pageData.showTest = false;
      this.setData({
        isLogin: true
      })
      Promise.all([this.getOtherOneQuestion(), this.getBasicSubject(), this.listSubjectByCollege(currentCollege), this.getUnreadMsg(), this.getSwiper()].map(item =>
        item.catch(err => {
          wx.showToast({
          title: String(err),
          icon: 'none'
        })
       }
      )))
      .then(res => {
        wx.setStorageSync("currentCollege",currentCollege)
          this.setData({
            isLoading: false,
            currentCollege
          })
        })
      .catch(err => {
          this.setData({
            isLoading: false
          })
        })
    } else {
      this.getSwiper();
      this.setData({
        isLoading: false,
      })
      wx.showToast({
        title: '未登录',
        icon: 'none'
      })
    }
  },

  getUrl: function () {
    this.setData({
      url: getApp().url.currentUrl + '/img/'
    })
  },

  /**
   * 点击消失弹窗
   */
  cancelMask: function (e) {
    this.setData({
      chooseCollege: false
    })
  },
  /**
   * 获取首页轮播图
   */
  getSwiper: function () {
    return new Promise((resolve, reject) => {
      httpRequest.getImgs({
          type: 1
        })
        .then(res => {
          if (res.data.code !== 1) return Promise.reject("获取轮播图失败")
          this.setData({
            imgUrls: res.data.data
          })
          resolve();
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   * 获取基础课程
   */
  getBasicSubject: function () {
    return new Promise((resolve, reject) => {
        httpRequest.listSubjectByCollege({
            college: "基础课程"
          })
          .then(res => {
            if (res.data.code !== 1) return Promise.reject("获取基础课程失败");
            let {
              code,
              data
            } = res.data;
            if (data.length >= 9) {
              data = data.slice(0, 9)
            }
            if (code) {
              this.setData({
                basicCourses: data,
              });
              resolve()
            }
          })
      })
      .catch(err => {
        reject(err)
      })
  },
  /**
   * 获取专业课程
   */
  listSubjectByCollege: function (collegeName) {
    return new Promise((resolve, reject) => {
        httpRequest.listSubjectByCollege({
            college: collegeName
          })
          .then(res => {
            if (res.data.code !== 1) return Promise.reject("获取专业课程失败");
            let {
              code,
              data
            } = res.data;
            if (data.length >= 9) {
              data = data.slice(0, 9)
            }
            if (code) {
              this.setData({
                professionalCourses: data,
              });
              resolve()
            }
          })
      })
      .catch(err => {
        reject(err)
      })
  },

  /**
   * 修改学院
   */
  changeCollege: function (e) {
    const currentCollege = e.currentTarget.dataset.collegename;
    if(currentCollege !== this.data.currentCollege){
      wx.setStorageSync('currentCollege', currentCollege);
      this.listSubjectByCollege(currentCollege).catch(err=>{
        wx.showToast({
          title: String(err),
          icon:'none'
        })
      })
      this.setData({
        isLogin: true,
        currentCollege
      })
    }
    this.setData({
      chooseCollege: false
    })
     
  },

  /**
   * 展示所有学院
   */
  showAllCollege: function () {
    if (!this.data.isLogin) {
      wx.showToast({
        title: "未登录",
        icon: "none"
      });
      return;
    }
    httpRequest.getAllCollege()
      .then(res => {
        if (res.data.code !== 1) return Promise.reject();
        this.setData({
          collegeList: res.data.data,
          chooseCollege: true
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
          return httpRequest.getUnReadMsg({
            accountId
          })
        })
        .then(res => {
          if (res.data.code !== 1) return Promise.reject("获取未读信息失败");
          if (res.data.data != 0) {
            wx.setTabBarBadge({
              index: 3,
              text: String(res.data.data)
            });
          }
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   * 跳转到问题列表页
   */
  gotoQuestionList(e) {
    if (!this.data.isLogin) {
      wx.showToast({
        title: "未登录",
        icon: "none"
      })
      return;
    }
    const {
      id: subjectId,
      name: subjectName
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/index/pages/question_list/index?subjectId=${subjectId}&subjectName=${subjectName}`,
    })
  },

  /**
   * 获取其他疑难中的一个提问
   */
  getOtherOneQuestion: function (params) {
    return new Promise((resolve, reject) => {
      const data = {
        state: 0,
        currentPage: 1,
        pageSize: 1,
        subjectName: "其他疑难"
      }
      httpRequest.getQuestionList(data)
        .then(res => {
          if (res.data.code !== 1) return Promise.reject("获取其他疑难失败")
          this.setData({
            otherDetail: res.data.data.list[0]
          })
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })

  },
  /**
   * 跳转到问题详情页
   */
  togoQuestionDetail() {
    wx.navigateTo({
      url: `/pages/index/pages/question_detail/index?questionId=${this.data.otherDetail.question.questionId}`,
    })
  },

  /**
   * 点击更多课程
   */
  showMore: function (e) {
    const type = e.currentTarget.dataset.type;
    let college = type === 'basic' ? '基础课程' : this.data.currentCollege
    wx.navigateTo({
      url: `/pages/index/pages/show_more_course/index?type=${type}&college=${college}`,
    })

  },

  onShow: function () {
    if (!this.pageData.showTest) return;
    const uniqueId = wx.getStorageSync('uniqueId')
    if (uniqueId) {
      httpRequest.getBindUserInfo({
          uniqueId
        })
        .then(res => {
          if (res.data.code !== 1 || res.data.data === null) {
            wx.clearStorage()
            return Promise.reject("请重新登录")
          }
          wx.setStorageSync("accountId", res.data.data.accountId);
          wx.setStorageSync("currentCollege", res.data.data.college);
          wx.setStorageSync("college", res.data.data.college)
          this.pageData.currentCollege = res.data.data.college;
          if (res.data.data.loginScore !== 0) {
            wx.showToast({
              title: `签到成功 ，积分 +${res.data.data.loginScore}`,
              icon: "none"
            })
          }
          return httpRequest.getAccountById({
            accountId: res.data.data.accountId
          })
        })
        .then(res => {
          if (res.data.code !== 1 || res.data.data === null) return Promise.reject("网络繁忙");
          wx.setStorageSync('userInfo', res.data.data);
          this.pageData.showTest = false;
          this.setData({
            isLogin: true,
            currentCollege: this.pageData.currentCollege
          }, () => {
            wx.startPullDownRefresh()
          })
        })
        .catch(err => {
          const errMsg = typeof err === 'string' ? err : '网络繁忙'
          wx.showToast({
            title: errMsg,
            icon: 'none'
          })
        })

    }
  },

  onHide: function () {
    wx.stopPullDownRefresh()
  },

  onPullDownRefresh: function () {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '未登录',
        icon: 'none'
      })
      wx.stopPullDownRefresh();
      return;
    }
    const currentCollege = wx.getStorageSync('currentCollege')
    Promise.all([this.getOtherOneQuestion(), this.getBasicSubject(), this.listSubjectByCollege(currentCollege), this.getUnreadMsg()].map(item =>
      item.catch(err => {
        wx.showToast({
        title: String(err),
        icon: 'none'
      })
     }
    )))
      .then(res => {
        wx.stopPullDownRefresh();
        this.setData({
          isLoading: false
        })
      })
      .catch(err => {
        wx.stopPullDownRefresh();
      })
  }
})