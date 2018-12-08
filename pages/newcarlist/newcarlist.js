// pages/newcarlist/newcarlist.js
const app = getApp()
Page({
  data: {
    carList:[]
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    wx.request({
      url: app.globaData.api + 'yphc/messages-list',
      header: {
        'fromBy': '5'
      },
      data:{
        type: options.typer
      },
      success:function(res){
        that.setData({
          carList:res.data.data
        })
        wx.hideLoading()
      }
    })
  },
})