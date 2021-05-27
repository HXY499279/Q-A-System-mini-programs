// index.js
import httpRequest from '../../utils/request/index';
import { getStorageItem } from '../../utils/api';
const { $Toast } = require('../../iview/base/index');

// 获取应用实例
const app = getApp()

Page({
  data: {
    chooseCollege:false,  //控制选择科目的弹窗
    isLoading: true,
    isError: false,
    url: "",
    imgUrls: [],
    collegeList:[{
      "id":1,
      collegeName:"经济管理学院"
    },{
      "id":2,
      collegeName:"计算机学院"
    }],
    currentCollege: undefined,//当前学院
    professionalCourses: [],
    basicCourses: []
  },

  onLoad() {
    this.getUrl();
    wx.setStorageSync('accountId', 1664781);
    wx.setStorageSync('currentCollege', "经济管理学院");

    getStorageItem("currentCollege")
    .then(currentCollege=>{
      Promise.all([this.getBasicSubject(),this.listSubjectByCollege(currentCollege), this.getUnreadMsg(),this.getSwiper()])
      .then(res => {
        this.setData({
          isLoading: false,
          currentCollege
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
    })
  },

  getUrl: function () {
    this.setData({
      url: getApp().url.currentUrl + '/img/'
    })
  },

  /**
   * 点击消失弹窗
   */
  cancelMask:function(e){
    this.setData({
      chooseCollege:false
    })
  },
  /**
   * 获取首页轮播图
   */
  getSwiper: function () {
    return new Promise((resolve, reject) => {
      httpRequest.getImgs({ type: 1 })
        .then(res => {
          if(res.data.code!==1) return reject()
          this.setData({
            imgUrls:res.data.data
        })
        resolve();
      })
      .catch(err=>{reject()})
    })
  },
  /**
   * 获取基础课程
   */
  getBasicSubject: function () {
    return new Promise((resolve, reject) => {      
        httpRequest.listSubjectByCollege({ college:"基础课程" })
          .then(res => {
            if (res.data.code !== 1) return reject();
            let { code, data } = res.data;
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
      .catch(err=>{reject()})
  },
  /**
   * 获取专业课程
   */
  listSubjectByCollege: function (collegeName) {
    return new Promise((resolve, reject) => {      
        httpRequest.listSubjectByCollege({ college:collegeName })
          .then(res => {
            if (res.data.code !== 1) return reject();
            let { code, data } = res.data;
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
      .catch(err=>{reject()})
  },

  /**
   * 修改学院
   */
  changeCollege:function(e){
    const currentCollege = e.currentTarget.dataset.collegename;
    wx.setStorageSync('currentCollege', currentCollege);
    this.setData({
      chooseCollege:false,
      currentCollege
    },wx.startPullDownRefresh())
  },

  /**
   * 展示所有学院
   */
  showAllCollege:function(){
    httpRequest.getAllCollege()
    .then(res=>{
      console.log(res)
      if(res.data.code!==1) return Promise.reject();
      this.setData({
          collegeList:res.data.data,
          chooseCollege:true
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
          if(res.data.data != 0){
            wx.setTabBarBadge({
              index: 3,
              text: String(res.data.data)
            });
          }
          resolve()
        })
        .catch(err=>{reject()})
    })
  },
  /**
   * 跳转到问题列表页
   */
  gotoQuestionList(e) {
    const {id:subjectId,name:subjectName} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/index/pages/question_list/index?subjectId=${subjectId}&subjectName=${subjectName}`,
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
    Promise.all([this.getUnreadMsg(), this.listSubjectByCollege(this.data.currentCollege)])
      .then(res => {
        wx.stopPullDownRefresh();
        this.setData({
          isLoading: false
        })
      })
  }
})
