// components/feedback/feedback_item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isAgree:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleAgree(){
      const isAgree = !this.data.isAgree
      this.setData({
        isAgree
      })
    }
  }
})
