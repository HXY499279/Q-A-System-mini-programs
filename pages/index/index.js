// index.js
import httpRequest from '../../utils/request/index';
const { $Toast } = require('../../iview/base/index');

// 获取应用实例
const app = getApp()

Page({
  data: {
    isLoading:true,
    isError:false,
    url:"",
    imgUrls:['/img/bg.jpeg','/img/bg.jpeg'],
    professionalCourses:[],
    basicCourses:[]
  },

  onLoad() {
    this.getUrl();
    httpRequest.listSubjectByCollege({college:"经济管理学院"})
    .then(res=>{
      const {code,data} = res.data
      if(code){
        this.setData({
          professionalCourses:data,
          isLoading:false
        })
      }
    })
    .catch(err=>{
      this.setData({
        isLoading:false
      })
      $Toast({
        content: "您当前处于离线模式",
        type: 'warning'
      });
    })
  },
  
  getUrl:function(){
    this.setData({
      url:getApp().url.currentUrl+'/img/'
    })
  },
  /**
   * 跳转到问题列表页
   */
  gotoQuestionList(e){
    const subjectId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/index/pages/question_list/index?subjectId=${subjectId}`,
    })
  },

  /**
   * 跳转到问题详情页
   */
  togoQuestionDetail(){
    wx.navigateTo({
      url: '/pages/index/pages/question_detail/index',
    })
  }
})
