// pages/personal/index.js
import httpRequest from '../../utils/request/index'

import { getStorageItem } from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isLogin: false,
    loading:true
  },
  pageData: {
    showGetInfo: false,
    college:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
        const uniqueId = wx.getStorageSync('uniqueId')
        if (uniqueId) {
          httpRequest.getBindUserInfo({ uniqueId })
            .then(res => {
              if (res.data.code !== 1 || !res.data.data){
                wx.clearStorage()
                return Promise.reject("请重新登录")
              }
              wx.setStorageSync("accountId", res.data.data.accountId);
              wx.setStorageSync("currentCollege",res.data.data.college);
              wx.setStorageSync('college', res.data.data.college)
              this.pageData.college = res.data.data.college;
              if(res.data.data.loginScore!==0){
                wx.showToast({
                  title: `签到成功 ，积分 +${res.data.data.loginScore}`,
                  icon:"none"
                })
              }
              return httpRequest.getAccountById({ accountId: res.data.data.accountId })
            })
            .then(res => {
              if (res.data.code !== 1 || res.data.data === null) return Promise.reject("网络繁忙");
              let userInfo = res.data.data;
              userInfo.college = this.pageData.college;
              wx.setStorageSync('userInfo',userInfo)
              this.setData({
                userInfo: userInfo,
                isLogin: true,
                loading:false
              })
            })
            .catch(err => {
              const errMsg  = typeof err === 'string' ? err : '网络繁忙'
              wx.showToast({
                title: errMsg,
                icon: 'none'
              })
            })
        } else {
          wx.showToast({
            title: '请登录',
            icon: 'none'
          })
        }
      // }
    }
    catch (err) { }
  },

  /**
   * 点击登录
   */
  gotoLogin: function () {
    /**生成随机数最为用户uniqueId */
    const dataString = new Date().getTime();
    const randomString = this.getRandom();
    const uniqueId = randomString + dataString;
    wx.showToast({
      title: '跳转中...',
      icon: 'loading',
      mask: true,
      duration:5000
    })
    httpRequest.login({ uniqueId })
      .then(res => {
        if (res.data.code !== 1) return Promise.reject()
        let src = res.data.data;
        wx.setStorageSync("Loginsrc", src);
        wx.setStorageSync("uniqueId", uniqueId);
        this.pageData.showGetInfo = true;
        wx.redirectTo({
          url: `/pages/casLogin/index`
        })
      })
      .catch(err => {
        wx.showToast({
          title: '获取地址失败',
          icon: 'error'
        })
      })
  },

  /**生成12位a-zA-Z0-9的随机数 */
  getRandom: function () {
    const e = 12;
    const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = t.length;
    let n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * length));
    return n
  },

  logout:function(){
    wx.clearStorageSync();
    wx.redirectTo({
      url: `/pages/casLogin/index?logoutsrc=https://ids.cqupt.edu.cn/authserver/logout`
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.pageData.showGetInfo) {
      try {
        const uniqueId = wx.getStorageSync('uniqueId')
        if (uniqueId) {
          httpRequest.getBindUserInfo({ uniqueId })
            .then(res => {
              if (res.data.code !== 1 || res.data.data === null){
                wx.clearStorage()
                return Promise.reject("请重新登录")
              }
              wx.setStorageSync("accountId", res.data.data.accountId);
              wx.setStorageSync("currentCollege",res.data.data.college);
              wx.setStorageSync('college', res.data.data.college);
              this.pageData.college = res.data.data.college;
              if(res.data.data.loginScore!==0){
                wx.showToast({
                  title: `签到成功 ，积分 +${res.data.data.loginScore}`,
                  icon:"none"
                })
              }
              return httpRequest.getAccountById({ accountId: res.data.data.accountId })
            })
            .then(res => {
              if (res.data.code !== 1 || res.data.data === null) return Promise.reject("网络繁忙");
              let userInfo = res.data.data;
              userInfo.college = this.pageData.college;
              wx.setStorageSync('userInfo', userInfo);
              this.pageData.showGetInfo = false;
              this.setData({
                userInfo: userInfo,
                isLogin: true
              })
            })
            .catch(err => {
              const errMsg  = typeof err === 'string' ? err : '网络繁忙'
              wx.showToast({
                title: errMsg,
                icon: 'none'
              })
            })
        }
      }
      catch (e) {
        wx.showToast({
          title: '请登录',
          icon: 'none'
        })
      }
    } else if (this.data.isLogin) {
      const accountId = wx.getStorageSync('accountId')
      httpRequest.getAccountById({accountId })
      .then(res => {
        if (res.data.code !== 1 || res.data.data === null) return Promise.reject("网络繁忙");
        let userInfo = res.data.data;
        userInfo.college = this.pageData.college;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          userInfo: userInfo,
        })
      })
      .catch(err => {
        const errMsg  = typeof err === 'string' ? err : '网络繁忙'
        wx.showToast({
          title: errMsg,
          icon: 'none'
        })
      })
    }
  }
})