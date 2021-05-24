// components/common/detail_item_box/index.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    answer:{
      type:Object,
      value:null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    url:"",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoPersonalIndex(){
      if(this.properties.answer.accountId){
        wx.navigateTo({
          url: `/pages/index/pages/other_index/index?accountId=${this.properties.answer.accountId}`,
        })
      }
    }
  },

  //组件挂载时设置当前URL
  attached(){
    this.setData({
      url:getApp().url.currentUrl+'/img'
    })
  }
})
