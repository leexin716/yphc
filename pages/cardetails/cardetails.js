// pages/cardetails/cardetails.js
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    loading:false,
    imgBanner: [],
    planShowone:true,
    checked:true,
    CarInfor:'',
    guidePrice:'',
    FinancingPlansList:[],
    sercontent:'',
    firstShop:'',
    firstShopLength:'',
    configure_lister:[],
    cartypeid:'',
    configs:'',
    backtoTop:false,
    tabTop:false,
    price_tabs: [
      {
        'interval': '0',
        'price': '金融方案'
      },
      {
        'interval': '1',
        'price': '车辆信息'
      },
      {
        'interval': '2',
        'price': '购车说明'
      },
    ],
    currentTab: '0',
    shopInfor:'',
    fav:'关注',
    isfav:true,
    favpng:'http://qiniu.youpinhaoche.com/2018/06/07/icon_unfav.png',
    ids:'',
    currentId:'',
    brightspot:false
  },
  onLoad:function(e){
    console.log(e.id)
    // this.setData({
    //   ids: e.id
    // })
    this.setData({
      cartypeid: e.id
    })
    this.getCarInfor(e.id)
    this.getFinancingPlans(e.id)
    this.getAllShops(e.id)
    this.setData({
      ids: e.id
    })
  },
  onShow: function (e) {
    let that = this
      // console.log(that.data.ids)
      // that.setData({
      //   cartypeid: that.data.ids
      // })
      // that.getCarInfor(that.data.ids)
      // that.getFinancingPlans(that.data.ids)
      // that.getAllShops(that.data.ids)
  },
  //方案点击事件
  showOne:function(e){
    let that = this;
    let currentId = e.currentTarget.dataset.index
    // that.setData({
    //   currentId: e.currentTarget.dataset.index
    // })
    let data = that.data.FinancingPlansList
    data[currentId].checked = !data[currentId].checked
    that.setData({
      FinancingPlansList: data
    })
  },
  //获取车辆详情信息
  getCarInfor:function(id){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globaData.api +'yphc/cartypes/'+id,
      header:{
        'auth': wx.getStorageSync('apiToken'),
        'fromBy': '5'
      },
      success: function(res) {
        let shopInfor = {
          brand: res.data.data.brand,
          name: res.data.data.name,
          colour: res.data.data.colour,
          guidePrice: (res.data.data.guidePrice / 10000).toFixed(2),
          imgUrl: res.data.data.imgUrl,
          carTypeId: id
        }
        that.setData({
          shopInfor: JSON.stringify(shopInfor),
          CarInfor: res.data.data,
          guidePrice: (res.data.data.guidePrice / 10000).toFixed(2),
          imgBanner: res.data.data.carImgList,
          configs: res.data.data.configs,
          isfav: res.data.data.favorited
        })
        if (res.data.data.lightspot){
          WxParse.wxParse('elp', 'html', res.data.data.lightspot, that, 5)
          that.setData({
            brightspot: true
          })
        }
        let obj = []
        let hh = JSON.parse(res.data.data.configs)
        for(let i= 0;i < hh.length;i++){
          obj = obj.concat(hh[i].list)
        }
        obj.length = 7
        that.setData({
          configure_lister:obj
        })
        wx.hideLoading()
      }
    })
  },
  //获取金融方案
  getFinancingPlans:function(id){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globaData.api + 'yphc/financingPlans',
      header: {
        'fromBy': '5'
      },
      data:{
        carTypeId:id
      },
      success:function(res){
        that.setData({
          FinancingPlansList: res.data.data
        })
        wx.hideLoading()
        for (let i = 0; i < res.data.data.length;i++){
          that.setData({
            sercontent: res.data.data[i].remark
          })
        }
      }
    })
  },
  //服务费说明弹层
  serToast:function(){
    let sercontent = ''
    sercontent = this.data.sercontent
    wx.showModal({
      title: '服务费说明',
      content: sercontent,
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //全部门店
  getAllShops:function(id){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globaData.api + 'yphc/shops',
      header: {
        'fromBy': '5'
      },
      data:{
        lng: app.globaData.lng,
        lat: app.globaData.lat,
        cityId: wx.getStorageSync("cityid"),
        districtId:'0',
        carTypeId:id
      },
      success:function(res){
        that.setData({
          firstShop: res.data.data[0],
          firstShopLength:res.data.data.length
        })
        wx.hideLoading()
      }
    })
  },
  //电话咨询
  makePhoneCall:function(){
    wx.makePhoneCall({
      phoneNumber: '4001540018'
    })
  },
  //门店拨打电话
  callshop_phone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //查看地图
  callshop_map:function(e){
    let lat = e.currentTarget.dataset.lat;
    let lng = e.currentTarget.dataset.lng;
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },
  //页面滚动
  // onPageScroll: function (e) {
  //   if (e.scrollTop > 150){
  //     this.setData({
  //       backtoTop:true
  //     })
  //   }else{
  //     this.setData({
  //       backtoTop: false
  //     })
  //   }
  //   if (e.scrollTop > 265) {
  //     this.setData({
  //       tabTop: true
  //     })
  //   } else {
  //     this.setData({
  //       tabTop: false
  //     })
  //   }
  //   if (e.scrollTop > 265 && e.scrollTop < 545){
  //     this.setData({
  //       currentTab: 0
  //     })
  //   } else if (e.scrollTop > 545 && e.scrollTop < 1165){
  //     this.setData({
  //       currentTab: 1
  //     })
  //   } else if (e.scrollTop > 1165){
  //     this.setData({
  //       currentTab: 2
  //     })
  //   }
  // },
  //滚动到顶部
  gobacktoTop:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    this.getCarInfor(this.data.ids)
    this.getFinancingPlans(this.data.ids)
    this.getAllShops(this.data.ids)
    wx.stopPullDownRefresh()
  },
  //tabs选项卡
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 0) {
        wx.pageScrollTo({
          scrollTop: 265,
          duration: 100
        })
      } else if (e.target.dataset.current == 1) {
        wx.pageScrollTo({
          scrollTop: 545,
          duration: 100
        })
      } else {
        wx.pageScrollTo({
          scrollTop: 1165,
          duration: 100
        })
      }
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //关注
  add_remove_fav:function(){
    let that = this
    if (!that.data.isfav){
      wx.request({
        url: app.globaData.api + 'yphc/add-favorite',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'auth': wx.getStorageSync('apiToken'),
          'fromBy': '5'
        },
        method: 'POST',
        data: {
          carTypeId: that.data.cartypeid
        },
        success: function (res) {
          wx.showToast({
            title: '关注成功'
          })
          that.setData({
            isfav: true,
            favpng: 'http://qiniu.youpinhaoche.com/2018/06/07/icon_unfav.png'
          })
        }
      })
    }else{
      wx.request({
        url: app.globaData.api + 'yphc/remove-favorite',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'auth': wx.getStorageSync('apiToken'),
          'fromBy': '5'
        },
        method: 'POST',
        data: {
          carTypeId: that.data.cartypeid
        },
        success: function (res) {
          wx.showToast({
            title: '取消关注成功'
          })
          that.setData({
            isfav: false,
            favpng: 'http://qiniu.youpinhaoche.com/2018/06/07/icon_fav.png'
          })
        }
      })
    }
  }
})