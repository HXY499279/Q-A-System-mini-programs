// components/email/dynamic_item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    url:""
  },

  lifetimes:{
      attached:function(){
        this.setData({
          url:getApp().url.currentUrl+'/img'
        })
      }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoQuestionDetail(){
      wx.navigateTo({
        url: `/pages/index/pages/question_detail/index?questionId=${this.properties.msg.emailContent.question.questionId}`,
      })
    }
  }
})
