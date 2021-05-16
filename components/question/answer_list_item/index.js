// components/question/answer_list_item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    answerDetail:{
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
    //去举报
    gotoComplain() {
      wx.navigateTo({
        url: `/pages/index/pages/complain/index?type=1&param=${encodeURIComponent(JSON.stringify(this.properties.answerDetail))}`,
      })
    },
  }
})