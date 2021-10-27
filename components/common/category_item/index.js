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
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    url: "",
    showHide:false
  },
  lifetimes: {
    attached:function(){
      const url = getApp().url.currentUrl+'/img';
      this.setData({
        url
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showDetail:function(){
      this.setData({
        showHide:true
      })
    },
    hideDetail:function(){
      this.setData({
        showHide:false
      })
    }

  }
})