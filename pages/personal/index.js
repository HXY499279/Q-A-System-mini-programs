// pages/personal/index.js
import httpRequest from '../../utils/request/index'
import { getStorageItem } from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isLogin: false
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
      const accountId = wx.getStorageSync('accountId')
      if (accountId) {
        httpRequest.getAccountById({ accountId })
          .then(res => {
            if (res.data.code !== 1) return Promise.reject();
            let college = wx.getStorageSync('college');
            let userInfo =  res.data.data;
            userInfo.college = college;
            wx.setStorageSync('userInfo', userInfo)
            this.setData({
              userInfo:userInfo,
              isLogin: true
            })
          })
          .catch(err => {
            wx.showToast({
              title: '网络繁忙',
              icon: 'error'
            })
          })
      } else {
        const uniqueId = wx.getStorageSync('uniqueId')
        if (uniqueId) {
          httpRequest.getBindUserInfo({ uniqueId })
            .then(res => {
              if (res.data.code !== 1) return Promise.reject();
              if (res.data.data === null) {
                wx.showToast({
                  title: '请登录',
                  icon: 'none'
                });
                return {
                  data: {
                    code: 1,
                    data: null
                  }
                };
              }
              wx.setStorageSync("accountId", res.data.data.accountId);
              wx.setStorageSync("currentCollege",res.data.data.college);
              wx.setStorageSync('college', res.data.data.college)
              this.pageData.college = res.data.data.college;
              return httpRequest.getAccountById({ accountId: res.data.data.accountId })
            })
            .then(res => {
              if (res.data.code !== 1) return Promise.reject();
              if (res.data.data === null) return;
              let userInfo = res.data.data;
              userInfo.college = this.pageData.college;
              wx.setStorageSync('userInfo',userInfo)
              this.setData({
                userInfo: userInfo,
                isLogin: true
              })
            })
            .catch(err => {
              wx.showToast({
                title: '网络繁忙',
                icon: 'error'
              })
            })
        } else {
          wx.showToast({
            title: '请登录',
            icon: 'none'
          })
        }
      }
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
      mask: true
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
          title: '网络出错',
          icon: 'error'
        })
      })
  },

  /**生成12位a-zA-Z0-9的随机数 */
  getRandom: function () {
    // const e = 12;
    // const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    // const length = t.length;
    // let n = "";
    // for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * length));
    // return n
    return "RB8WI933R5031625836096823"
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow...")
    if (this.pageData.showGetInfo) {
      try {
        const uniqueId = wx.getStorageSync('uniqueId')
        if (uniqueId) {
          httpRequest.getBindUserInfo({ uniqueId })
            .then(res => {
              if (res.data.code !== 1) return Promise.reject();
              if (res.data.data === null) {
                wx.showToast({
                  title: '请登录',
                  icon: 'none'
                })
                return {
                  data: {
                    code: 1,
                    data: null
                  }
                }
              }
              wx.setStorageSync("accountId", res.data.data.accountId);
              wx.setStorageSync("currentCollege",res.data.data.college);
              wx.setStorageSync('college', res.data.data.college);
              this.pageData.college = res.data.data.college;
              return httpRequest.getAccountById({ accountId: res.data.data.accountId })
            })
            .then(res => {
              if (res.data.code !== 1) return Promise.reject();
              if (res.data.data === null) return;
              let userInfo = res.data.data;
              userInfo.college = this.pageData.college;
              wx.setStorageSync('userInfo', userInfo);
              this.pageData.showGetInfo = false;
              this.setData({
                userInfo: res.data.data,
                isLogin: true
              })
            })
            .catch(err => {
              wx.showToast({
                title: '网络出错啦',
                icon: 'error'
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
      getStorageItem("userInfo")
        .then(userInfo => {
          this.setData({
            userInfo
          })
        })
    }
  }
})