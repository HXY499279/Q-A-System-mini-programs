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
    /**跳转到资料编辑页面 */
    gotoEdit(){
      const accountId = wx.getStorageSync('accountId')
      if (!accountId){
        wx.showToast({
          title:"未登录",
          icon:"none"
        })
        return
      }
      wx.navigateTo({
        url:`/pages/personal/pages/edit/index?img=${this.properties.userInfo.imgPath}&intro=${this.properties.userInfo.introduce}`
      })
    },
    previewPic(e) {
      console.log(e)
      const src = e.currentTarget.dataset.src; //获取data-src
      wx.previewImage({
        current: this.data.url+src, // 当前显示图片的http链接
        urls: [this.data.url+src] // 需要预览的图片http链接列表
      })
    },
  }
})
