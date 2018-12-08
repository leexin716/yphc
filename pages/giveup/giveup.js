// pages/giveup/giveup.js
const http = require('../../utils/https.js')
Page({
  data: {
    imgs: '',
    days: '',
    seconds: '',
    content: '',
    loveImg: '',
    isHeart: true,
    loveYear: '',
    loveMonthDate: ''
  },
  onLoad: function (options) {
    this.detail()
    this.couonter()
  },
  detail: function () {
    let that = this
    wx.login({
      success: function (res) {
        http.getReq('ss/user/detail', {
          uuid: wx.getStorageSync('uuid'),
          code: res.code
        }, function (res1) {
          that.setData({
            loveImg: res1.data.loveImg,
            days: res1.data.days,
            seconds: res1.data.seconds,
            content: res1.data.content,
            loveMonthDate: res1.data.loveMonthDate,
            loveYear: res1.data.loveYear
          })
          if (res1.data.star == 1) {
            that.setData({
              imgs: res1.data.loveImg,
              isHeart: false
            })
          } else {
            that.setData({
              imgs: res1.data.loveImgBlur,
              isHeart: true
            })
          }
        })
      }
    })
  },
  couonter: function () {
    let that = this
    setInterval(function () {
      var cout = that.data.seconds
      that.setData({
        seconds: cout + 1
      })
    }, 1000)
  },
  onGotUserInfo: function (e) {
    let that = this
    if (!that.data.isHeart) {
      wx.showToast({
        title: '已祝福',
      })
      return
    }
    wx.login({
      success: function (res) {
        http.getReq('ss/user/star', {
          uuid: wx.getStorageSync('uuid'),
          code: res.code,
          avator: e.detail.userInfo.avatarUrl
        }, function (res1) {
          if (res1.code == 0) {
            that.setData({
              imgs: that.data.loveImg,
              isHeart: false
            })
          } else if (res1.code == 1004) {
            wx.showToast({
              title: res1.message,
            })
          }
        })
      }
    })
  },
  //canyu
  gotocanyu: function () {
    wx.navigateTo({
      url: '../redirecter/redirecter',
    })
  },
  qnvip: function () {
    wx.navigateTo({
      url: '../redirect/redirect?scene=qnvip77',
    })
  },
  previewImage: function (e) {
    console.log(e.currentTarget.dataset.img)
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.img] // 需要预览的图片http链接列表
    })
  }
})