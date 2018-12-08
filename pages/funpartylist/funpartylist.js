// pages/funpartylist/funpartylist.js
const app = getApp()
Page({
  data: {
    carList: []
  },
  onLoad: function (options) {
    let that = this
    wx.request({
      url: app.globaData.api + 'yphc/messages-list',
      header: {
        'fromBy': '5'
      },
      data: {
        type: options.typer
      },
      success: function (res) {
        that.setData({
          carList: res.data.data
        })
      }
    })
  },
  //
  getMore:function(){
    wx.miniProgram.navigateTo({ url: '/path/to/page' })
  }
})