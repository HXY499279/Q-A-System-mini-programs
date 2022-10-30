Component({
  /**
   * 组件的属性列表
   */
  properties: {
    answerDetail: {
      type: Object,
      value: {},
      observer(data) {
        const { accountId } = data
        const userAccountId = wx.getStorageSync('accountId')
        if (accountId === userAccountId) {
          this.setData({
            canAdopt: false
          })
        }
      }
    },
    questionerId: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    canAdopt: true,
    isAdopt: false,
    isAgree: false,
    url: '',
    currentAccount: undefined
  },

  lifetimes: {
    attached: function () {
      const accountId = wx.getStorageSync('accountId')
      this.setData({
        url: getApp().url.currentUrl + '/img',
        currentAccount: accountId
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    //去别人的个人页
    gotoPersonalIndex() {
      wx.navigateTo({
        url: `/pages/index/pages/other_index/index?accountId=${this.properties.answerDetail.accountId}`,
      })
    },
    //点击采纳
    handleAdopt() {
      this.triggerEvent("onAdopt")
    },

    //点击赞同
    handleAgree() {
      this.triggerEvent("onAgree")
    },

    //点击评论
    handleComment() {
      this.triggerEvent("onComment")
    },

    //去举报
    gotoComplain() {
      wx.navigateTo({
        url: `/pages/index/pages/complain/index?type=1&param=${encodeURIComponent(JSON.stringify(this.properties.answerDetail))}`,
      })
    },

    //图片预览
    previewPic(e) {
      const src = e.currentTarget.dataset.src; //获取data-src
      wx.previewImage({
        current: this.data.url + src, // 当前显示图片的http链接
        urls: [this.data.url + src]
      })
    },
  }
})