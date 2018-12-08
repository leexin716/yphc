// pages/myappoint/myappoint.js
const app = getApp()
Page({
  data: {
    reservation:[],
    nodata:false
  },
  onLoad: function (options) {
    this.getReservation()
  },
  //获取列表
  getReservation:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    wx.request({
      url: app.globaData.api + 'yphc/reservations',
      header: {
        'auth': wx.getStorageSync('apiToken'),
        'fromBy': '5'
      },
      success:function(res){
        if(res.data.data.length != 0){
          that.setData({
            nodata:false,
            reservation: res.data.data
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
  //拨打电话
  callshop_phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //查看地图
  callshop_map: function (e) {
    let lat = e.currentTarget.dataset.lat;
    let lng = e.currentTarget.dataset.lng;
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },
  //去逛逛
  gohappy: function () {
    app.globaData.carname = '品牌'
    app.globaData.carbrandid = 0
    wx.switchTab({
      url: '/pages/carselect/carselect'
    })
  }
})