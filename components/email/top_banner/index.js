// components/email/top_banner_item/index.js
Component({

  properties: {
    "barDetail":{
      type:Array,
      value:[]
    }
  },


  data: {
    currentType:"invitation"
  },


  methods: {
    //点击切换顶部导航栏 对应种类加阴影,调用父组件函数展示对应模块
    changeItem(e){
      const { type } = e.currentTarget.dataset;
      this.triggerEvent("changeMenu",{currentType:type}) ;
      this.setData({
        currentType:type
      })
    }
  }
})
