// pages/mycenter/mycenter.js
const app = getApp()
Page({
  data: {
    pageone:[
      {
        page:'myfollow',
        name:'我的关注',
        cout:'0'
      },
      {
        page: 'myappoint',
        name: '我的预约',
        cout:'0'
      }
    ],
    pagetwo: [
      {
        page: 'opinion',
        name: '意见反馈'
      },
      {
        page: 'question',
        name: '常见问题'
      }
    ],
    hideMobile:'',
    isLogin:false,
    url:'/pages/authentication/authentication'
  },
  onLoad: function (options){
    
  },
  onShow:function(){
    let that = this
    wx.getStorage({
      key: 'apiToken',
      success: function (res) {
        that.setData({
          isLogin: true,
        })
        that.getPerson()
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '是否登录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login?islogin=5'
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '/pages/home/home'
              })
            }
          }
        })
      }
    })
  },
  getPerson:function(){
    let that = this
    wx.request({
      url: app.globaData.api + 'user/person',
      header: {
        'auth': wx.getStorageSync('apiToken'),
        'fromBy': '5'
      },
      success:function(res){
        let pageone = []
        pageone = [
          {
            page: 'myfollow',
            name: '我的关注',
            cout: res.data.data.favCount
          },
          {
            page: 'myappoint',
            name: '我的预约',
            cout: res.data.data.reservationCount
          }
        ]
        that.setData({
          pageone: pageone,
          hideMobile: res.data.data.hideMobile
        })
      }
    })
  },
  //退出登录
  goremove:function(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定退出？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'apiToken',
            success: function (res) {
              that.setData({
                isLogin: false,
                pageone: [
                  {
                    page: 'myfollow',
                    name: '我的关注',
                    cout: '0'
                  },
                  {
                    page: 'myappoint',
                    name: '我的预约',
                    cout: '0'
                  }
                ]
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})