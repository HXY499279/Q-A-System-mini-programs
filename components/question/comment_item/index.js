// components/question/comment/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comment:{
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
    gotoReport(){
      const dataDetail ={content:this.properties.comment.content , contentId:this.properties.commentcommentId} 
      wx.navigateTo({
        url: `/pages/index/pages/complain/index?type=2&param=${encodeURIComponent(JSON.stringify(dataDetail))}`,
      })
    }
  }
})
