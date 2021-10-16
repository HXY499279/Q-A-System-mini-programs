// pages/index/pages/answer_detail/index.js
import {getStorageItem,mergeObj} from '../../../../utils/api'
import httpRequest from '../../../../utils/request/index'
import {$Toast} from '../../../../iview/base/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerDetail:{},
    questionDetail:{},
    commentList:[],
    commentCount:0
  },
  pageData:{
    answerId:undefined,
    answer:{
      currentPage:1,
      pageSize:1,
      totalPages:1,
      totalRows:0,
      answerSortType:0,
      questionId:0
    },
    comment:{
      currentPage:1,
      pageSize:2,
      totalPages:1,
      totalRows:0,
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const questionDetail = (JSON.parse(decodeURIComponent(options.questionDetail)));
    const { currentIndex,totalRows,sortOrder,questionId,answerId} = options;
    mergeObj(this.pageData.answer,{currentPage:currentIndex*1,totalRows,sortOrder,questionId});
    this.pageData.answerId = answerId;
    this.setData({
      questionDetail
    })
    this.getComment();
    this.getAnswerDetail()
  },

  /**
   * 得到回答详情
   */
  getAnswerDetail:function(){
    getStorageItem("accountId")
    .then(accountId=>{
      const data = {accountId,answerId:this.pageData.answerId}
      return httpRequest.getAnswerDetail(data)
    })
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
      this.setData({
        answerDetail:res.data.data
      })
    })
    .catch(err=>{
      wx.showToast({
        title: '网络忙',
        icon:"error"
      })
    })
  }, 
   /**
   * 获取评论
   */
  getComment:function(){
    const data = {
      answerId:this.pageData.answerId,
      currentPage:this.pageData.comment.currentPage,
      pageSize:this.pageData.comment.pageSize
    }
    httpRequest.getComment(data)
    .then(res=>{
      const {currentPage,pageSize,totalPages,totalRows} = res.data.data.pageInfo;
      mergeObj(this.pageData.comment,{currentPage,pageSize,totalPages,totalRows})
      this.setData({
        // commentList:[...this.data.commentList,...res.data.data.list]
        commentList:[...res.data.data.list],
        commentCount:res.data.data.pageInfo.totalRows
      })
    })
  },
  
  /**
   * 点击采纳
   */
  onAdopt:function(){
    let newAnswerDetail = JSON.parse(JSON.stringify(this.data.answerDetail));
    let newQuestionDetail =  JSON.parse(JSON.stringify(this.data.questionDetail));
    if((newAnswerDetail.isAdopt && newQuestionDetail.state)||(!newAnswerDetail.isAdopt && !newQuestionDetail.state) ){
      newAnswerDetail.isAdopt = newAnswerDetail.isAdopt?0:1;
      newQuestionDetail.state = newQuestionDetail.state?0:1;
      
      // const userInfo = wx.getStorageSync('userInfo')
      // newAnswerDetail.isAdopt ? userInfo.solveCount++:userInfo.solveCount--;
      // wx.setStorageSync('userInfo', userInfo)
    }
    else if(!newAnswerDetail.isAdopt && newQuestionDetail.state ){
      newAnswerDetail.isAdopt = newAnswerDetail.isAdopt?0:1;
    }
    this.setData({
      answerDetail:newAnswerDetail,
      questionDetail:newQuestionDetail
    })
    getStorageItem('accountId')
    .then(accountId=>{
      const data = {
        questionId:this.data.questionDetail.questionId,
        answerId:this.data.answerDetail.answerId,
        accountId
      }
      return httpRequest.acceptAnswer(data)
    })
    .then(res=>{
      if(res.data.code !== 1) return Promise.reject();
    })
    .catch(err=>{})
  },

  /**
   * 点击赞同
   */
  onAgree:function(){
    let newAnswerDetail = JSON.parse(JSON.stringify(this.data.answerDetail));
    newAnswerDetail.isAgree = newAnswerDetail.isAgree ? 0 : 1;
    newAnswerDetail.isAgree ? newAnswerDetail.agreeCount++ :  newAnswerDetail.agreeCount--;
    this.setData({
      answerDetail:newAnswerDetail
    })

    getStorageItem("accountId")
    .then(accountId=>{
      const answerId = this.data.answerDetail.answerId;
      const isAgree = this.data.answerDetail.isAgree
      if( isAgree)  return httpRequest.agreeAnswer({answerId,accountId})
      else return httpRequest.cancelAgreeAnswer({answerId,accountId})
    })
    .then(res=>{
     if(!res.data.code) return Promise.reject();
     const isAgree = this.data.answerDetail.isAgree
      // let userInfo = wx.getStorageSync('userInfo');
      // isAgree ? userInfo.agreeCount++:userInfo.agreeCount--;
      // wx.setStorageSync('userInfo', userInfo);
    })
    .catch(err=>{})
  },

  /**
   * 点击评论
   */
  onComment:function(){
    wx.navigateTo({
      url: `/pages/index/pages/comment/index?answerId=${this.data.answerDetail.answerId}&answerName=${this.data.answerDetail.userName}`,
    })
  },

  /**
   * 去评论页面
   */
  showComments:function(){
    wx.navigateTo({
      url: `/pages/index/pages/show_comments/index?answerId=${this.data.answerDetail.answerId}`,
    })
  },

  showNext:function(){
    if(this.pageData.answer.totalRows>this.pageData.answer.currentPage){
      this.pageData.answer.currentPage++;
      const {sortOrder,currentPage,pageSize,questionId,totalRows} = this.pageData.answer;
       getStorageItem("accountId")
      .then(accountId=>{
        const data = {accountId,currentPage,pageSize,questionId,sortOrder};
        return httpRequest.getAnswerList(data)
      })
      .then(res=>{
        if(res.data.code!==1) return Promise.reject();
        const nextAnswerId = res.data.data.list[0].answerId;
        const questionDetail = this.data.questionDetail;
        wx.redirectTo({
          url: `/pages/index/pages/answer_detail/index?answerId=${nextAnswerId}&questionDetail=${encodeURIComponent(JSON.stringify(questionDetail))}&currentIndex=${currentPage}&totalRows=${totalRows}&sortOrder=${sortOrder}&questionId=${questionDetail.questionId}`
        })
      })
     .catch(err=>{
       console.log(err)
       wx.showToast({
         title: '网络忙',
         icon:'error'
       })
     })
     }else{
      $Toast({
        content: '已经是最后啦'
    });
     }
  } ,

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return {
  //     title: '兄弟请看这道题！',
  //     success: function (shareTickets) {
  //     },
  //     fail: function (res) {
  //     },
  //     complete:function(res){
  //     }
  //   }
  // }
})