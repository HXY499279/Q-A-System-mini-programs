// components/common/my_textarea/index.js
const {
  $Toast
} = require('../../../iview/base/index');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "myPlaceholder": {
      type: String,
      value: "简介简介简介简介简介简介"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentWordsLen: "0", //记录当前字数
    currentWord: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //字数统计字数限制
    wordLimit(e) {
      const inputValue = e.detail.value;
      const len = inputValue.length;
      if (len >= 140) {
        $Toast({
          content: '最多140字，不能再多啦',
          type: 'warning'
        });
        return;
      }
      this.setData({
        currentWordsLen: len,
        currentWord:inputValue
      })
     
    
    },

    //用于父组件获取子组件输入框的值
    getValues(){
      return{
        currentWord:this.data.currentWord
      }
    }
  }
})