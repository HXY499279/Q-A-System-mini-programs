// components/common/category_item/index.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    categoryMsg: {
      type: Object,
      value: {},
      observer(data) {
        // 根据返回的学科名字长度来应用不同样式
        const { subjectName } = data
        if (subjectName.length > 6) {
          this.setData({
            subjectClassName: "long_long_text"
          })
        } else if (subjectName.length > 4) {
          this.setData({
            subjectClassName: "long_text"
          })
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    url: "",
    showHide: false,
    subjectClassName: ""
  },
  lifetimes: {
    attached: function () {
      const url = getApp().url.currentUrl + '/img';
      this.setData({
        url
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showDetail: function () {
      this.setData({
        showHide: true
      })
    },
    hideDetail: function () {
      this.setData({
        showHide: false
      })
    }

  }
})