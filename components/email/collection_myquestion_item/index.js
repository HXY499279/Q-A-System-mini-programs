// components/email/collection/index.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //跳转至问题详情页
    gotoQuestionDetail(){
      wx.navigateTo({
        url: `/pages/index/pages/question_detail/index?questionId=${this.properties.msg.question.questionId}`,
      })
    }
  }
})
