// pages/mypage/mypage.js
const http = require('../../utils/https.js')
Page({
  data: {
    forimgs: [],
    morelist: [],
    takelist: [],
    myimg: '',
    days: '',
    seconds: '',
    stars: '',
    showModal: false,
    rank: '',
    ranklister: [],
    showModal2: false,
    lookmore: false,
    takemore: false
  },
  onLoad: function (options) {
    this.detail()
    this.couonter()
  },
  //获取信息
  detail: function () {
    let that = this
    wx.login({
      success: function (res) {
        http.getReq('ss/user/detail', {
          uuid: wx.getStorageSync('uuid'),
          code: res.code
        }, function (res1) {
          let arr = []
          if (res1.data.stars.length > 14) {
            for (let i = 0; i < 14; i++) {
              arr.push(res1.data.stars[i].avator)
            }
            that.setData({
              lookmore: true
            })
          } else {
            for (let i = 0; i < res1.data.stars.length; i++) {
              arr.push(res1.data.stars[i].avator)
            }
          }
          let arry = []
          for (let i = 0; i < res1.data.stars.length; i++) {
            arry.push(res1.data.stars[i].avator)
          }
          that.setData({
            myimg: res1.data.loveImg,
            days: res1.data.days,
            seconds: res1.data.seconds,
            forimgs: arr,
            takelist: arr,
            stars: res1.data.stars.length,
            morelist: arry
          })
        })
      }
    })
  },
  //计时器
  couonter: function () {
    let that = this
    setInterval(function () {
      var cout = that.data.seconds
      that.setData({
        seconds: cout + 1
      })
    }, 1000)
  },
  //排行榜
  rankList: function () {
    let that = this
    http.getReq('ss/user/starList', { uuid: wx.getStorageSync('uuid') }, function (res) {
      if (res.code == 0) {
        that.setData({
          rank: res.data.rank,
          ranklister: res.data.users
        })
      }
    })
    that.setData({
      showModal: true
    })
  },
  //关闭排行榜
  onConfirm: function () {
    this.setData({
      showModal: false
    })
  },
  giftTip: function () {
    this.setData({
      showModal2: true
    })
  },
  //关闭祝福
  onClose: function () {
    this.setData({
      showModal2: false
    })
  },
  //查看更多
  lookmore: function () {
    let that = this
    that.data.forimgs = []
    that.setData({
      forimgs: that.data.morelist,
      lookmore: false,
      takemore: true
    })
  },
  //收起
  takemore: function () {
    let that = this
    that.data.forimgs = []
    that.setData({
      forimgs: that.data.takelist,
      lookmore: true,
      takemore: false
    })
  },
  qnvip: function () {
    wx.navigateTo({
      url: '../redirect/redirect?scene=qnvip77',
    })
  },
  previewImage:function(e){
    console.log(e.currentTarget.dataset.img)
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.img] // 需要预览的图片http链接列表
    })
  }
})