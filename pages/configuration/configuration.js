// pages/configuration/configuration.js
Page({
  data: {
    content:[]
  },
  onLoad: function (options) {
    let obj = []
    let hh = JSON.parse(options.configs)
    this.setData({
      content:hh
    })
  }
})