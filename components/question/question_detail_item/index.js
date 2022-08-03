// components/question/question_card_item/index.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    questionDetailData: {
      type: Object,
      value: {}
    },
    isTop: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    url: '',
    accountId: ''
  },
  lifetimes: {
    attached() {
      const accountId = wx.getStorageSync('accountId')
      this.setData({
        url: getApp().url.currentUrl + '/img',
        accountId
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //举报问题
    gotoReport() {
      const { questionId, title, collectionCount, answerCount } = this.data.questionDetailData;
      const param = {
        questionId,
        title,
        collectionCount,
        answerCount
      }
      wx.navigateTo({
        url: `/pages/index/pages/complain/index?type=0&param=${encodeURIComponent(JSON.stringify(param))}`,
      })
    },
    editQuestion() {
      const { title, describes, imgPath, questionId } = this.properties.questionDetailData
      const data = { title, describes, imgPath, questionId }

      wx.navigateTo({
        url: `/pages/index/pages/edit_question/index?data=${encodeURIComponent(JSON.stringify(data))}`,
      })
    },
    //预览图片
    previewPic(e) {
      console.log(e.currentTarget.dataset.src)
      const src = e.currentTarget.dataset.src; //获取data-src
      wx.previewImage({
        current: this.data.url + src, // 当前显示图片的http链接
        urls: [this.data.url + src]
      })
    },
  }
})