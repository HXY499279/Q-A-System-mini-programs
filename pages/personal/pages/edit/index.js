// pages/personal/pages/edit/index.js
import httpRequest from '../../../../utils/request/index'
import { getStorageItem,chooseImg } from '../../../../utils/api'
const { $Toast } = require('../../../../iview/base/index');

Page({

  data: {
    imgTempPath:"" //记录头像临时地址
  },

  //点击更换头像
  changeHeadImg(){
    chooseImg(1)
   .then(res=>{
     this.setData({
      imgTempPath:res[0]
     })
   })
  },

  submit:function(){
    const myTextArea = this.selectComponent("#my-textarea");
    const {currentWord:introduction}= myTextArea.getValues();
    const filePath = this.data.imgTempPath;
    if(!introduction.trim() && !filePath){
      $Toast({
        content: '已经最新状态',
        type: 'warning'
      });
      return
    }

    getStorageItem("accountId")
    .then(accountId=>{
      const data = {accountId,introduction} 
      if(filePath) return httpRequest.editPersonal({data,filePath});
      else return httpRequest.editPersonal({data})
    })
    .then(res=>{
      if(!res.data.code) return Promise.reject();
      $Toast({
        content: '更新成功！',
        type: 'success'
      });
      wx.navigateBack();
    })
  },

  onLoad: function (options) {
    const {img,intro} = options;
  },
})