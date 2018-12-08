// pages/myfollow/myfollow.js
const app = getApp()
Page({
  data: {
    favlist:[],
    nodata:false
  },
  onLoad: function (options) {
      // this.getList()
  },
  onShow:function(){
    this.getList()
  },
  //获取列表
  getList:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    wx.request({
      url: app.globaData.api + 'yphc/favorites',
      header: {
        'auth': wx.getStorageSync('apiToken'),
        'fromBy': '5'
      },
      success:function(res){
        if (res.data.errcode == 0){
          if(res.data.data.length != 0){
            that.setData({
              nodata: false,
              favlist: res.data.data
            })
          }else{
            that.setData({
              nodata: true
            })
          }
        }
        wx.hideLoading()
      }
    })
  },
  //去逛逛
  gohappy:function(){
    app.globaData.carname = '品牌'
    app.globaData.carbrandid = 0
    wx.switchTab({
      url: '/pages/carselect/carselect'
    })
  }
})