// pages/question/choose_ category/index.js
import httpRequest from '../../../utils/request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //所有学科
    categorys:[],
    isLoading:true
  },

  /**
   * 页面数据
   */
  pageData:{
    currentPage:1,
    pageSize:7,
    keyWord:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchSubject();
  },
  /**
   * 获取科目信息
   */
  searchSubject : function(keyWord){
     wx.showToast({
      icon: "loading",
      title: "正在获取信息",
      duration:10000
      });
    const {currentPage,pageSize} = this.pageData;
    let param = keyWord ? {keyWord,currentPage,pageSize} : {currentPage,pageSize}
    httpRequest.searchSubject(param)
    .then(res=>{
      const categorys = res.data.data.list;
      this.setData({categorys});
      wx.hideToast();
    })
    .catch(err=>{
      wx.showToast({
        icon: "error",
        title: "请检查您的网络",
        duration:2000
        });
    })
  }
})