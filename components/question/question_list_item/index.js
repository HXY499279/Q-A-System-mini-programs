// components/question_list/question_list_item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "question": {
      type: Object,
      value: {}
    },
    "answer": {
      type: Object,
      value: {}
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
    //去问题详情页面
    gotoQuestionDetail(e) {
      const questionId = e.currentTarget.dataset.questionid;
      wx.navigateTo({
        url: `/pages/index/pages/question_detail/index?questionId=${questionId}`,
      })
    },

    //去举报
    gotoReport() {
      const { questionId, title, collectionCount, answerCount } = this.properties.question;
      const param = { questionId, title, collectionCount, answerCount }
      wx.navigateTo({
        url: `/pages/index/pages/complain/index?type=0&param=${encodeURIComponent(JSON.stringify(param))}`,
      })
    },
    gotoShare(){
      wx.showShareMenu()
    }
  }
})
