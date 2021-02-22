// components/question_list/question_list_item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    gotoQuestionDetail(){
      wx.navigateTo({
        url: '/pages/index/pages/question_detail/index',
      })
    }
  }
})
