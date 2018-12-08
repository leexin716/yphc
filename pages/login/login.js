// pages/login/login.js
const app = getApp()
Page({
  data: {
    userN:'',
    coder:'',
    islogin:'',
    timer:'获取验证码',
    currentTime:60,
    disabled:false,
    carid:'',
    idx:'',
    title:'',
    url:''
  },
  onLoad: function (options) {
    let that = this
    if (options.id){
      that.setData({
        carid: options.id
      })
    }
    if (options.idx) {
      that.setData({
        idx: options.idx
      })
    }
    if (options.title) {
      that.setData({
        title: options.title
      })
    }
    if (options.url) {
      that.setData({
        url: options.url
      })
    }
    if (options.page) {
      that.setData({
        page: options.page
      })
    }
    that.setData({
      islogin:options.islogin
    })
  },
  onUnload:function(){
    
  },
  //微信获取用户信息
  // onGotUserInfo: function (e) {
  //   if (e.detail.errMsg == 'getUserInfo:ok'){
  //     wx.showToast({
  //       title: '登录成功',
  //       icon: 'success',
  //       duration: 1000
  //     })
  //     setTimeout(function(){
  //       wx.navigateBack()
  //     },1000)
  //   }
  //   console.log(e.detail.userInfo)
  // },
  // getPhoneNumber: function (e) {
  //   console.log(e.detail.errMsg)
  //   console.log(e.detail.iv)
  //   console.log(e.detail.encryptedData)
  // },
  //监听
  phone:function(e){
    this.setData({
      userN: e.detail.value
    })
  },
  code: function (e) {
    this.setData({
      coder: e.detail.value
    })
  },
  //获取验证码
  getCode:function(){
    let that = this
    let currentTime = that.data.currentTime
    if (that.data.userN == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (that.data.userN.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    that.setData({
      timer: currentTime + 's',
      disabled:true
    })
    const interval = setInterval(function () {
      that.setData({
        timer: (currentTime - 1) + 's'
      })
      currentTime--;
      if (currentTime == 0 ) {
        console.log(1)
        clearInterval(interval)
        that.setData({
          timer: '重新获取',
          currentTime: 60,
          disabled:false
        })
      }
    }, 1000)
    wx.request({
      url: app.globaData.api + 'user/sms',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'fromBy':'5'
      },
      method:'POST',
      data:{
        mobile: that.data.userN,
        type:'0',
        sign:'123456'
      },
      success:function(res){

      }
    })
  },
  //登录
  Login:function(){
    let that = this
    if (that.data.userN == ''){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (that.data.userN.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (that.data.coder == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.request({
      url: app.globaData.api + 'user/login',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'fromBy': '5'
      },
      data:{
        sign:'123456',
        type:'1',
        params1: that.data.userN,
        params2: that.data.coder,
        ip:'123456',
        register:'miniProgram'
      },
      success:function(res){
        if (res.data.errcode == 0){
          //设登录缓存
          wx.setStorageSync('apiToken', res.data.data.apiToken)
          // wx.setStorage({
          //   key: "apiToken",
          //   data: res.data.data.apiToken
          // })
          wx.setStorageSync('usePhone', that.data.userN)
          // wx.setStorage({
          //   key: 'usePhone',
          //   data: that.data.userN
          // })
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            // wx.navigateBack()
            if (that.data.islogin == 0){//搜索
              wx.redirectTo({
                url: '../search/search',
              })
            }else if(that.data.islogin == 1){//消息详情
              wx.redirectTo({
                url: '../notice/notice',
              })
            } else if (that.data.islogin == 2) {//车辆详情
              wx.redirectTo({
                url: '../carsdetails/carsdetails?id=' + that.data.carid,
                
              })
            } else if (that.data.islogin == 3) {//车主故事
              wx.redirectTo({
                url: '../carstorydetails/carstorydetails?id=' + that.data.idx + '&&title=' + that.data.title,
              })
            } else if (that.data.islogin == 4) {//banner
              wx.redirectTo({
                url: '../webview/webview?url=' + that.data.url + '&&title=' + that.data.title + '&&page=' + that.data.page
              })
            } else if (that.data.islogin == 5) {//个人中心
              wx.navigateBack()
            }
          }, 1000)
        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
})