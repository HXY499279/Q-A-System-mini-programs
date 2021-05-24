// components/choose_category_item/index.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categoryMsg:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击添加
    chooseCategory(e){
      const {currentcategory,currentid}= e.currentTarget.dataset;
      app.chooseCategory = currentcategory;
      app.chooseSubjectId = currentid;
      wx.navigateBack({
        url: '/pages/question/index'
      })
    }
  }
})
