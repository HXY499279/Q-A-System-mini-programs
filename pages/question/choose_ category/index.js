// pages/question/choose_ category/index.js
import httpRequest from '../../../utils/request/index';
import {mergeObj} from '../../../utils/api'
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
    totalRows:0,
    totalPages:1,
    keyWord:'',
    timer:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {currentPage,pageSize} = this.pageData;
    const data = {currentPage,pageSize}
    this.searchSubject(data);
  },
  /**
   * 获取科目信息
   */
  searchSubject : function(data){
     wx.showToast({
      icon: "loading",
      title: "正在获取信息",
      duration:10000
      });
    httpRequest.searchSubject(data)
    .then(res=>{
      const categorys = res.data.data.list;
      mergeObj(this.pageData,res.data.data.pageInfo)
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
  },

searchInput:function(e){
     if(this.pageData.timer) {
       clearInterval(this.pageData.timer);
       this.pageData.timer = null;
      }
      const newTimer = setTimeout(()=>{
        const keyWords = e.detail.value;
        const newPageData = {totalPages:1,totalRows:0,currentPage:1};
        mergeObj(this.pageData,newPageData); 
        const {currentPage,pageSize,college} = this.pageData;
        this.pageData.keyWords = keyWords;
        let data = {};
  
        if(keyWords.trim() === ''){
        data = {currentPage,pageSize} ;
        }else{
          data = {currentPage,pageSize,keyWords} 
        }
        this.setData({
          categorys:[]
        },this.searchSubject(data));
      },500);
      this.pageData.timer = newTimer;
  },

  onPullDownRefresh:function(){
    if(this.pageData.currentPage < this.pageData.totalPages){
      this.pageData.currentPage++;
      let data = {};
      const {keyWords,currentPage,pageSize} = this.pageData;
      if(keyWords){
        data = {keyWords,currentPage,pageSize}
      }else{
        data = {currentPage,pageSize}
      }
      this.searchSubject(data)
    }
  }
})