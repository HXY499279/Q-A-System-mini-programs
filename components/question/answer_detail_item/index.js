// components/question/answer_detail_item/index.js
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
    isAdopt: false,
    isAgree: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //点击采纳
    handleAdopt() {
      const isAdopt = !this.data.isAdopt;
      this.setData({
        isAdopt
      })
    },

    //点击赞同
    handleAgree() {
       const isAgree = !this.data.isAgree;
       this.setData({
         isAgree
       })
    },

    //点击评论
    handleComment(){
      wx.redirectTo({
        url: '/pages/index/pages/comment/index',
      })
    },

    //去举报
    gotoComplain(){
      wx.redirectTo({
        url: '/pages/index/pages/complain/index',
      })
    }

  }
})