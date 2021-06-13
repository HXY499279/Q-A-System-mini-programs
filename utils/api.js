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
        resolve(tempFilePaths);
        wx.hideLoading()
      }
    })
  })
}

const getStorageItem = function (key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    })
  })
}

/**
 * 上传文件到服务器
 * @param {string} file 文件的地址、临时地址
 * @param {object} data  数据
 */
const upLoadFile = function ({filePath,data,url}) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      filePath:filePath,
      name: 'img',
      url: getApp().url.currentUrl + url,
      formData: data,
      timeout: 2500,
      success:res => {
        if(res.statusCode === 200 ) resolve(res);
        else  reject(res)
       },
      fail: res =>  reject(res)
    })
  })
}

/**
 * 整个对各对象到arguments[0上]
 */
const mergeObj = function () {
  let [target, ...cloneObj] = [...arguments],
  cloneItem = null,
    i = 0;

  if (Object.prototype.toString.call(target) != '[object Object]')
    throw new Error("'arguments[0]' is not an Object");

  for (i; i < cloneObj.length; i++) {
    if ((cloneItem = cloneObj[i]) !== null) {
      for (let name in cloneItem) {
        const src = target[name];
        const copy = cloneItem[name];
        if (src === copy) continue;
        if (src && copy && (Object.prototype.toString.call(copy) === '[Object Object]')) {
          target[name].extend(copy)
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target
}

const handleInput = function(string){
  return string.replace(/\n/g,"\\n").replace(/[ ]/g,"&nbsp;")
}


module.exports = {
  chooseImg,
  getStorageItem,
  upLoadFile,
  mergeObj,
  handleInput
}