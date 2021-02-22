// components/question/answer_list_item/index.js
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
    //去举报
    gotoComplain() {
      wx.navigateTo({
        url: '/pages/index/pages/complain/index?type=answer',
      })
    },

    //去问题详情页
    gotoAnswerDetail() {
      wx.navigateTo({
        url: '/pages/index/pages/answer_detail/index',
      })
    }
  }
})