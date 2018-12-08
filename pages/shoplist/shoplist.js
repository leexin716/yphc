// pages/shoplist/shoplist.js
const app = getApp()
Page({
  data: {
    shoplist:[]
  },
  onLoad: function (options) {
    this.getShopList(options.id)
  },
  //获取列表
  getShopList:function(id){
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api +'yphc/shops',
      header: {
        'fromBy': '5'
      },
      data:{
        lng: app.globaData.lng,
        lat: app.globaData.lat,
        cityId: wx.getStorageSync("cityid"),
        districtId:0,
        carTypeId:id
      },
      success:function(res){
        that.setData({
          shoplist:res.data.data
        })
        wx.hideLoading()
      }
    })
  },
  //拨打电话
  getPhone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //查看地图
  getShopMap: function (e) {
    let lat = e.currentTarget.dataset.lat;
    let lng = e.currentTarget.dataset.lng;
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },
})