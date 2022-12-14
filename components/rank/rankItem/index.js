// components/rank/rank_item/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "icon":{
      type:String,
      value:""
    },
    userInfo:{
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

  /**
   * 组件的方法列表
   */
  methods: {
    gotoPersonalIndex(){
      const accountId = this.properties.userInfo.accountId
      if(accountId){
        wx.navigateTo({
          url: `/pages/index/pages/other_index/index?accountId=${accountId}`,
        })
      }
    }
  },
  attached(){
    this.setData({
      url:getApp().url.currentUrl+'/img/'
    })
  }
})
