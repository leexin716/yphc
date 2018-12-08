
// const util = require('./util.js')
const rootDocment = 'https://hd.youpinhaoche.com/';//生产
// const rootDocment = 'https://dev2.qncentury.com/';//开发
const header = {
  'content-type': 'application/x-www-form-urlencoded',
}
function getReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.request({
    url: rootDocment + url,
    method: 'get',
    data: data,
    header: header,
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}

function postReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.request({
    url: rootDocment + url,
    header: header,
    data: data,
    method: 'post',
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })

}
module.exports = {
  getReq: getReq,
  postReq: postReq,
  header: header,
}