Component({
  /**
   * 组件的属性列表
   */
  properties: {
    answerDetail:{
      type:Object,
      value:{}
    },
    questionerId:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isAdopt: false,
    isAgree: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //点击采纳
    handleAdopt() {
      this.triggerEvent("onAdopt")
    },

    //点击赞同
    handleAgree() {
      this.triggerEvent("onAgree")
    },

    //点击评论
    handleComment(){
     this.triggerEvent("onComment")
    },

    //去举报
    gotoComplain(){
      wx.navigateTo({
        url: `/pages/index/pages/complain/index?type=1&param=${encodeURIComponent(JSON.stringify(this.properties.answerDetail))}`,
      })
    }

  }
})