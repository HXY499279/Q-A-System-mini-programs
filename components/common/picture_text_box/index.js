// components/common/picture_text_box/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "titlePlaceholder":{
      type:String,
      value:"请输入标题"
    },
    "contentPlaceholder":{
      type:String,
      value:"内容的描述"
    },
    "values":{
      type:Object,
      value:{
        titleInput:'',
        contentIput:'',
        imgPath:''
      },
      observer(val) {
        val && this.init()
     }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    titleInput:"",
    contentInput:"",
    imgPath:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(){
      const {titleInput,contentInput,imgPath} = this.properties.values
      this.setData({
        titleInput,
        contentInput,
        imgPath
      })
    },
    //获取标题输入框的内容
    titleInput(e){
      const titleInput = e.detail.value;
      this.setData({
        titleInput
      })
    },
  
    //用于父组件获取子组件的值
    getValues(){
      const myTextArea = this.selectComponent("#my_textarea");
      const picUpdateBox = this.selectComponent("#picture_update_box");
      return{
        titleInput:this.data.titleInput,
        textAreat:myTextArea.getValues(),
        tempFilePath:picUpdateBox.getValues()
      }
    },

    /**
    * 清除输入框的内容
    */
    clearInput(){
      const myTextArea = this.selectComponent("#my_textarea");
      const picUpdateBox = this.selectComponent("#picture_update_box");
      myTextArea.clearInput();
      picUpdateBox.clearInput();
      this.setData({
        titleInput:""
      })
    }
  }
})
