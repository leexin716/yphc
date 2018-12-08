// pages/webview/webview.js
const app = getApp()
Page({
  data: {
    url:''
  },
  onLoad: function (options) {
    let that = this
    if(options.page == 0){
      wx.request({
        url: app.globaData.api + 'yphc/messages-list?type=11',
        header: {
          'fromBy': '5'
        },
        success: function (res) {
          that.setData({
            url: res.data.data[options.id].content
          })
        }
      })
    } else if (options.page == 1){
      wx.setNavigationBarTitle({
        title: options.title
      })
      that.setData({
        url: options.url
      })
    }
  }
})