// pages/question/question.js
const app = getApp()
Page({
  data: {
    qalist:[]
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
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
      url: app.globaData.api + 'yphc/faqs',
      header: {
        'fromBy': '5'
      },
      success:function(res){
        let str = '',
            list = [];
        for (let i = 0; i < res.data.data.length;i++){
          str = res.data.data[i].answer;
          str = str.replace(/\\r\\t/g, '\n');
          list.push({
            answer: str,
            question: res.data.data[i].question
          })
        }
        that.setData({
          qalist: list
        })
        wx.hideLoading()
      }
    })
  }
})