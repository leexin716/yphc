// pages/ordershop/ordershop.js
const app = getApp()
const util = require('../../utils/util.js')
const http = require('../../utils/http.js')
const mdsign = require('../../utils/md5.min.js')
Page({
  data: {
    radiolist: [
      { name: '先生', value: 'man', checked: 'true' },
      { name: '女士', value: 'woman' }
    ],
    indexs: 0,
    shopnamelist:[],
    isshow:true,
    shopInfor:'',
    sure_address:[],
    iselp:0,
    bookername:'',
    sex:1,
    shopid:'',
    coder:'',
    phone:'',
    defalutPhone: '',
    timer:'发送验证码',
    currentTime:60,
    isTip:0
  },
  //加载前
  onLoad:function(e){
    let that = this
    that.setData({
      shopInfor: JSON.parse(e.carinfo),
      defalutPhone: wx.getStorageSync('usePhone')
    })
    that.getAddress(that.data.shopInfor.carTypeId)
  },
  //获取验证码
  sendCode:function(){
    let that = this
    let currentTime = that.data.currentTime
    if (that.data.bookername == '') {
      wx.showToast({
        title: '请输入到店人姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.isTip == 0){
      that.setData({
        timer: currentTime + 's',
        disabled: true,
        isTip:1
      })
      const interval = setInterval(function () {
        that.setData({
          timer: (currentTime - 1) + 's'
        })
        currentTime--;
        if (currentTime == 0) {
          console.log(1)
          clearInterval(interval)
          that.setData({
            timer: '重新获取',
            currentTime: 60,
            disabled: false,
            isTip:0
          })
        }
      }, 1000)
      wx.request({
        url: app.globaData.api + 'user/sms',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'fromBy': '5'
        },
        method: 'POST',
        data: {
          mobile: that.data.phone,
          type: '0',
          sign: '123456'
        },
        success: function (res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: '验证码发送成功请注意查收',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    }
  },
  //获取门店地址
  getAddress:function(id){
    let that = this
    wx.request({
      url: app.globaData.api + 'yphc/shops',
      header: {
        'fromBy': '5'
      },
      data: {
        lng: app.globaData.lng,
        lat: app.globaData.lat,
        cityId: wx.getStorageSync("cityid"),
        districtId: 0,
        carTypeId: id
      },
      success: function (res) {
        let name = [];
        let sure_address = [];
        for(let i = 0;i < res.data.data.length;i++){
          name.push(res.data.data[i].name)//店名
          sure_address.push({//地址
            name: res.data.data[i].address,
            id: res.data.data[i].id
          })
        }
        that.setData({
          shopnamelist: name,
          sure_address: sure_address,
          shopid:res.data.data[0].id//默认赋值shopid
        })
      }
    })
  },
  //checked事件
  radioChange: function (e) {
    if (e.detail.value == 'man'){
      this.setData({
        sex:1
      })
    }else{
      this.setData({
        sex: 0
      })
    }
  },
  //select选择门店
  bindPickerChange: function (e) {
    this.setData({
      indexs: e.detail.value,
      shopid: e.currentTarget.dataset.shopid
    })
  },
  //切换预约方式
  useorder:function(){
    this.setData({
      isshow: !this.data.isshow
    })
  },
  //到店人姓名输入
  bookername:function(e){
    this.setData({
      bookername: e.detail.value
    })
  },
  //监听
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
    console.log(this.data.phone)
  },
  code: function (e) {
    this.setData({
      coder: e.detail.value
    })
    console.log(this.data.coder)
  },
  //预约
  sure_order:function(){
    let that = this
    if (that.data.bookername == '') {
      wx.showToast({
        title: '请输入到店人姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    //使用默认手机号
    if (that.data.isshow == true){
      wx.request({
        url: app.globaData.api + 'yphc/reservations',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'auth': wx.getStorageSync('apiToken'),
          'fromBy': '5'
        },
        method: 'POST',
        data:{
          carTypeId: that.data.shopInfor.carTypeId,
          shopId: that.data.shopid,
          reservationTime: Math.round(new Date() / 1000),
          phone: wx.getStorageSync('usePhone'),
          sex:that.data.sex,
          bookerName: that.data.bookername
        },
        success:function(res){
          if (res.data.errcode == 0){
            wx.redirectTo({
              url: '../success/success'
            })
          }else{
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }else{//使用其他手机号
      if (that.data.bookername == '') {
        wx.showToast({
          title: '请输入到店人姓名',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if(that.data.phone == ''){
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (that.data.phone.length != 11) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (wx.getStorageSync('usePhone') == that.data.phone){
        wx.showToast({
          title: '请输入其他正确的手机号码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (that.data.coder == '') {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let data = {
        carTypeId: that.data.shopInfor.carTypeId,
        shopId: that.data.shopid,
        reservationTime: Math.round(new Date() / 1000),
        phone: that.data.phone,
        sex: that.data.sex,
        bookerName: that.data.bookername,
        code: that.data.coder
      }
      let timestap = Math.round(new Date() / 1000)
      let newData = util.addObj(data, 'timestamp', timestap)
      http.header.timestamp = timestap
      http.header.sign = mdsign.md5(util.reData(newData))
      http.postReq('yphc/reservations', {
        carTypeId: that.data.shopInfor.carTypeId,
        shopId: that.data.shopid,
        reservationTime: Math.round(new Date() / 1000),
        phone: that.data.phone,
        sex: that.data.sex,
        bookerName: that.data.bookername,
        code: that.data.coder
      }, function (res) {
        console.log(res)
        if (res.errcode == 0) {
          wx.redirectTo({
            url: '../success/success'
          })
        }else{
          wx.showToast({
            title: res.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
})