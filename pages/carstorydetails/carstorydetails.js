// pages/carstorydetails/carstorydetails.js
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    obj:''
  },
  onLoad: function (options) {
    let that = this
    wx.request({
      url: app.globaData.api + 'yphc/carStory',
      header: {
        'fromBy': '5'
      },
      data:{
        pageSize: 15
      },
      success:function(res){
        let str = '';
        str = res.data.data[options.id].content;
        str = str.replace(/<o:p>/g,'')
        that.setData({
          obj: str
        })
      }
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
    setTimeout(function(){
      WxParse.wxParse('elp', 'html', that.data.obj, that, 5)
    },500)
    
  }
})