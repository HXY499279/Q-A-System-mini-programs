// components/common/question_card/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    dataDetail:{
      type:Object,
      value:{}
    },
    type:{
      type:Number,
      value:0 //    /0是问题 1是回答
    }
  },

  /**
   * 组件的初始数据
   */
 data:{

 },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
