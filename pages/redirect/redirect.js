// pages/redirect/redirect.js
const http = require('../../utils/https.js')
Page({
  onLoad: function (options) {
    var scene = options.scene
    if (!options.scene || options.scene == 'efined') {
      scene = ''
    }
    wx.login({
      success: function (res) {
        http.getReq('ss/user/status', {
          code: res.code,
          uuid: scene
        }, function (res1) {
          wx.setStorage({
            key: 'uuid',
            data: res1.data.uuid
          })
          wx.setStorage({
            key: 'qiniuToken',
            data: res1.data.token
          })
          wx.setStorage({
            key: 'contents',
            data: res1.data.contents,
          })
          wx.setStorage({
            key: 'qiniuDomain',
            data: res1.data.qiniuDomain,
          })
          if (res1.data.status == 1) {//上传页面
            wx.redirectTo({
              url: '../uploadimg/uploadimg',
            })
          }
          if (res1.data.status == 5) {//别人展示页面
            wx.redirectTo({
              url: '../giveup/giveup',
            })
          }
          if (res1.data.status == 10) {//自己展示页面
            wx.redirectTo({
              url: '../mypage/mypage',
            })
          }
        })
      }
    })
  }
})