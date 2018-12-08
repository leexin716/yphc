// pages/opinion/opinion.js
const app = getApp()
Page({
  data: {
    phone:'',
    worder:''
  },
  onLoad: function (options) {

  },
  //监听
  usphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  word:function(e){
    this.setData({
      worder: e.detail.value
    })
  },
  //提交
  tiper:function(){
    let that = this
    if (that.data.worder == ''){
      wx.showToast({
        title: '请输入意见',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request({
      url: app.globaData.api + 'yphc/feedback',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'fromBy': '5'
      },
      method: 'POST',
      data:{
        content: that.data.worder,
        phone: that.data.phone
      },
      success:function(res){
        if (res.data.errcode == 0){
          wx.showToast({
            title: res.data.errmsg,
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack()
          },2000)
        }
      }
    })
  }
})