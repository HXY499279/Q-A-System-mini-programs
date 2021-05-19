// pages/personal/Components/personal_card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      "userInfo":{
        type:Object,
        value:{}
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    url:""
  },

  lifetimes:{
    attached: function() {
      this.setData({
        url:getApp().url.currentUrl + '/img'
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
