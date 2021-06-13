// pages/personal/Components/item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "icon": {
      type: String,
      value: ""
    },
    "type": {
      type: String,
      value: ""
    },
    "url": {
      type: String,
      value: ""
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
    gotoUrl: function () {
      const accountId = wx.getStorageSync('accountId')
      if (!accountId) {
        wx.showToast({
          title:'未登录',
          icon:'none'
        })
        return;
      }
      wx.navigateTo({
        url:this.properties.url
      })
    }
  }
})
