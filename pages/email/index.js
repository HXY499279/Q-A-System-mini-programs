// pages/email/index.js
import httpRequest from '../../utils/request/index'
import {getStorageItem} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: "dynamic",
    dynamicList:[],
    invitationList:[],
    collectionList:[],
    myquestionList:[],
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
      },{
        "icon": "/img/email/collection.svg",
        "type": "collection",
        "text": "收藏",
        "backgroundColor": "#F87053",
      }, {
        "icon": "/img/email/myquestion.svg",
        "type": "myquestion",
        "text": "我的提问",
        "backgroundColor": "#2DC4BA",
      }
    ]
  },

  pageData:{
    currentType:"dynamic",
    pageSize:5,
    dynamicTotalPages:1,
    dynamicCurrentPage:1,
    invitationTotalPages:1,
    invitationCurrentPage:1,
    collectionTotalPages:1,
    collectionCurrentPage:1,
    myqustionTotalPages:1,
    myquestionCurrentPage:1
  },

  changeItem:function(e){
    const { type } = e.currentTarget.dataset;
    this.pageData.currenType = type;
    switch(type){
      case "dynamic":
        if(this.data.dynamicList.length===0){
          this.getDynamic();
        }
        break;
      case "invitation":
        if(this.data.invitationList.length===0){
          this.getInvitation();
        }
        break;
      case "collection":
        if(this.data.collectionList.length===0){
          this.getCollection();
        }
        break;
      case "myquestion":
        if(this.data.collectionList.length===0){
          this.getMyqustion();
        }
        break;
    }
    this.setData({
      currentType:type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDynamic();
  },

  getDynamic:function(){
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {type:1,accountId,currentPage:this.pageData.dynamicCurrentPages,pageSize:this.pageData.pageSize}
      return httpRequest.getDynamic(data)
    })
    .then(res=>{
      if(res.data.code!==1) return Promise.reject();
      this.pageData.dynamicTotalPages = res.data.data.pageInfo.totalPages;
      this.setData({
        dynamicList:[...this.data.dynamicList,...res.data.data.list]
      })
    })
    .catch(err=>{})
  },

  getInvitation:function(){
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {accountId,currentPage:this.pageData.invitationCurrentPages,pageSize:this.pageData.pageSize}
      return httpRequest.getInvitation(data)
    })
    .then(res=>{
      if(res.data.code !==1) return Promise.reject();
      this.pageData.invitationTotalPages = res.data.data.pageInfo.totalPages;
      this.setData({
        invitationList:res.data.data.list
      })
    })
    .catch(err=>{})
  },

  getCollection:function(){
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {relatedType:2,accountId,currentPage:this.pageData.collectionCurrentPage,pageSize:this.pageData.pageSize}
      return httpRequest.getAboutMyQuestion(data)
    })
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
      this.pageData.collectionTotalPages = res.data.data.pageInfo.totalPages;
      this.setData({
        collectionList:[...this.data.collectionList,...res.data.data.list]
      })
    })
    .catch(err=>{})
  },

  getMyqustion:function(){
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {relatedType:1,accountId,currentPage:this.pageData.myquestionCurrentPage,pageSize:this.pageData.pageSize}
      return httpRequest.getAboutMyQuestion(data)
    })
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
      this.pageData.myqustionTotalPages = res.data.data.pageInfo.totalPages;
      this.setData({
        myquestionList:[...this.data.myquestionList,...res.data.data.list]
      })
    })
    .catch(err=>{})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const type = this.pageData.currenType;
    switch(type){
      case "dynamic":
        if(this.pageData.dynamicCurrentPage < this.pageData.dynamicTotalPages){
          this.pageData.dynamicCurrentPage++;
          this.getDynamic();
        }
        break;
      case "invitation":
        if(this.pageData.invitationCurrentPages < this.pageData.invitationTotalPages){
          this.pageData.invitationCurrentPages++;
          this.getInvitation();
        }
        break;
      case "collection":
        if(this.pageData.collectionCurrentPage < this.pageData.collectionTotalPages){
          this.pageData.collectionCurrentPage++;
          this.getCollection();
        }
        break;
      case "myquestion":
        if(this.pageData.myquestionCurrentPage < this.pageData.myqustionTotalPages){
          this.pageData.myquestionCurrentPage++;
          this.getMyqustion();
        }
        break;
    }
  },
})