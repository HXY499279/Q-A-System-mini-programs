// components/common/picture_update_box/index.js
const {
  $Toast
} = require('../../../iview/base/index');

import {
  chooseImg
} from '../../../utils/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:String,
      value:'',
      observer(val){
        val&&val!=="-1"&&this.init()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgTempPath: [],
    allowPicNum: 1 //允许上传的图片数量
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(){
      this.setData({
        imgTempPath:[this.properties.value]
      })
    },
    imgChoose() {
      //如果大于 x 张图片，则出现警告
      if (this.data.imgTempPath.length >= this.data.allowPicNum) {
        $Toast({
          content: `${this.data.allowPicNum}张就够啦`,
          type: 'warning'
        });
        return;
      }

      //选择图片
      chooseImg(this.data.allowPicNum)
        .then(res => {
          const tempFilePaths = [...res, ...this.data.imgTempPath];
          this.setData({
            imgTempPath: tempFilePaths
          })
          wx.hideLoading();
        })
        .catch(err=>{
          $Toast({
            content:"请检查你的网络",
            type: 'warning'
          });
        })
    },

    //删除图片
    imgDelete(e) {
      const currentIndex = e.currentTarget.dataset.index;
      let tempFilePath = [...this.data.imgTempPath];
      tempFilePath.splice(currentIndex, 1);
      this.setData({
        imgTempPath: tempFilePath
      })
    },

    //预览图片
    previewPic(e) {
      const src = e.currentTarget.dataset.src; //获取data-src
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: this.data.imgTempPath // 需要预览的图片http链接列表
      })
    },

    //用于父组件获取子组件的值
    getValues() {
      return {
        imgTempPath: this.data.imgTempPath
      }
    },

   /**
    * 清除输入框的内容
    */
    clearInput(){
      this.setData({
        imgTempPath:[]
      })
    }
  }
})