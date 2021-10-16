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
    url:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoReport(){
      const dataDetail ={content:this.properties.comment.content , commentId:this.properties.comment.commentId}
      console.log(dataDetail) 
      wx.navigateTo({
        url: `/pages/index/pages/complain/index?type=2&param=${encodeURIComponent(JSON.stringify(dataDetail))}`,
      })
    },
    gotoPersonalIndex(){
      if(this.properties.comment.accountId){
        wx.navigateTo({
          url: `/pages/index/pages/other_index/index?accountId=${this.properties.comment.accountId}`,
        })
      }
    }
  },

  attached(){
    this.setData({
      url:getApp().url.currentUrl+'/img'
    })
  }
});

