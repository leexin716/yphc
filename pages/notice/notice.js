// pages/notice/notice.js
const app = getApp()
Page({
  data: {
    messagelist:[],
    nodata:false
  },
  onLoad: function (options) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api + 'yphc/messages',
      header: {
        'auth': wx.getStorageSync('apiToken'),
        'fromBy': '5'
      },
      success: function (res) {
        if (res.data.data.length != 0){
          let list = [
            {
              imgs: 'http://mp.static.youpinhaoche.com/newcar.jpg',
              name: '新车上架',
              time: res.data.data[0].modifyTime,
              title: res.data.data[0].title,
              page: 'newcarlist',
              typer: res.data.data[0].type
            },
            {
              imgs: 'http://mp.static.youpinhaoche.com/funparty.jpg',
              name: '优惠活动',
              time: res.data.data[0].modifyTime,
              title: res.data.data[0].title,
              page: 'funpartylist',
              typer: res.data.data[1].type
            }
          ]
          that.setData({
            messagelist: list
          })
        }else{
          that.setData({
            nodata: true
          })
        }
        wx.hideLoading()
      }
    })
  },
})