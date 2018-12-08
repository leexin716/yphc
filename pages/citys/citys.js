let City = require('../../utils/allcity.js');
const app = getApp()
Page({
  data: {
    city: City,
    mycity:''
  },
  onLoad:function(e){
    let that = this
    // wx.request({
    //   url: app.globaData.api + 'area/cityArea',
    //   data:{
    //     parentAreaId:0,
    //     sign:123456
    //   },
    //   success:function(res){
    //     that.setData({
    //       city: res.data.data
    //     })
    //   }
    // })
    that.setData({
      mycity:e.mycity
    })
  },
  bindtap(e) {
    console.log(e.detail)
    wx.reLaunch({
      url: '../index/index?cityname=' + e.detail.name + '&&cityid=' + e.detail.id
    })
  },
  input(e) {
    this.value = e.detail.value
  },
  searchMt() {
    // 当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if (!this.value) {
      this.value = '';
    }
    this.setData({
      value: this.value
    })
  }

})