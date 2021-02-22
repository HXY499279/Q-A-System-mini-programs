// components/email/invitation_item/index.js
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
    //点击跳转至问题详情页面
    toQustionDetail(){
      wx.navigateTo({
        url: '/pages/index/pages/question_detail/index'
      })
    }
  }
})
