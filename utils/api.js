//用途: 选择图片，promise封装，上传成功，resolve接受图片地址，上传失败reject返回错误
//参数：count：允许选择图片的数量  sizeType：尺寸   sourceType：来源
//使用注意：resolve / reject 函数里需要使用 wx.hideLoading() 隐藏等待框
const chooseImg = function (count, sizeType = ['original', 'compressed'], sourceType = ['album', 'camera']) {
  return new Promise(function (resolve, reject) {
    wx.chooseImage({
      count,
      sizeType,
      sourceType,
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
      });
      const tempFilePaths = res.tempFilePaths;
      resolve(tempFilePaths)
      }
    })
  })
}



module.exports = {
  chooseImg
}