// components/feedback/feedback_item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    feedback:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:undefined
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    url:""
  },

  lifetimes:{
    attached(){
      this.setData({
        url : getApp().url.currentUrl+'/img'
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    gotoPersonalIndex(){
      wx.navigateTo({
        url: `/pages/index/pages/other_index/index?accountId=${this.properties.feedback.accountId}`,
      })
    },
    
    handleAgree(){
      const {feedback:{feedbackId},index} = this.properties;
      this.triggerEvent("handleAgreeClick",{feedbackId,index}) 
    },

     //图片预览
     previewPic(e) {
      const src = e.currentTarget.dataset.src; //获取data-src
      wx.previewImage({
        current: this.data.url + src, // 当前显示图片的http链接
        urls: [this.data.url + src] // 需要预览的图片http链接列表
      })
    },
  }
})
