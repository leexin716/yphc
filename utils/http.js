
const util = require('./util.js')
const rootDocment = 'https://clapi2.youpinhaoche.com/';//生产
// const rootDocment = 'http://clapi.qa.youpinhaoche.com/';//开发
const header = {
  'content-type': 'application/x-www-form-urlencoded',
  'auth': wx.getStorageSync('apiToken'),
  'fromBy': '5',
  'apiVersion': '1.0.0',
  'timestamp': null,
  'sign':null
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