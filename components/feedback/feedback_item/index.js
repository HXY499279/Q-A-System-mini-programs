// components/feedback/feedback_item/index.js
import httpRequest from '../../../utils/request/index';
import {getStorageItem} from '../../../utils/api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    feedback:{
      type:Object,
      value:{}
    }
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
      const feedbackId = this.properties.feedback.feedbackId
      this.triggerEvent("handleAgreeClick",{feedbackId}) 
    }
  }
})
