//app.js
App({
  onLaunch: function () {
    this.upDate()
    wx.setStorage({
      key: "cityid",
      data: 1
    })
    this.getLocation()
  },
  onShow: function () {
    //获取相册授权
    // let that = this
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.writePhotosAlbum']) {
    //       console.log('判断')
    //       that.authorizer()
    //     }
    //   }
    // })
  },
  data: {
    // cityid: ''
  },
  globaData: {
    api: 'https://clapi2.youpinhaoche.com/',//正式
    // api: 'http://clapi.qa.youpinhaoche.com/',//测试
    cityid: '1',
    lat: '',
    lng: '',
    carname: '品牌',
    carbrandid: 0,
    currentCity: ''
  },
  //获取地理位置
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.globaData.lat = res.latitude//全局经纬度
        that.globaData.lng = res.longitude
        console.log(res)
        that.loadCity(res.longitude, res.latitude)
        setTimeout(function () {
          wx.request({
            url: that.globaData.api + 'area/topAreaByName',
            header: {
              'fromBy': '5'
            },
            data: {
              name: that.globaData.currentCity,
              sign: '123456'
            },
            success: function (res) {
              that.globaData.cityid = res.data.data.id//全局cityid
              //设cityid缓存
              wx.setStorage({
                key: "cityid",
                data: res.data.data.id
              })
            }
          })
        })
      },
      fail: function () {
        wx.navigateTo({
          url: './citys/citys'
        })
      }
    });
  },
  loadCity: function (longitude, latitude) {
    let that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=WGSGsQC5tNY29sOTiKWycGKMzv0yis4Z&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var city = res.data.result.addressComponent.city;
        city = city.substring(0, city.length - 1)
        that.globaData.currentCity = city
        console.log(that.globaData.currentCity)
      },
      fail: function () {
        console.log('失败')
      }
    })
  },
  //再次发起授权提示
  showModal: function () {
    let that = this
    wx.showModal({
      title: '提示',
      content: '请允许相册使用权限',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.openSetting({
            success: (res) => {
              if (res.authSetting) {
                if (!res.authSetting.scope.writePhotosAlbum) {
                  that.authorizer()
                }
              }
            }
          })
        }
      }
    })
  },
  //授权
  authorizer: function () {
    let that = this
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        console.log('授权成功')
      },
      fail() {
        that.showModal()
        console.log('失败再发起')
      }
    })
  },
  //更新
  upDate: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  }
})