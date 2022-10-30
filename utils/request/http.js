//测试地址
const baseUrl = 'https://xscqa.cqupt.edu.cn/question/'

const httpUtil = function ({ url, param, method, header } = {}) {
  return new Promise((resolve, reject) => {
    const theader = header ? header : ({
      'content-type': 'application/json' // 默认值
    });
    const tmethod = method ? method : "get"; //默认请求方式get
    wx.request({
      header: theader,
      method: tmethod,
      url: baseUrl + url,
      data: param,
      timeout: 10000,
      success: function (res) {
        if (res.statusCode === 200) resolve(res);
        else reject(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

export default httpUtil;