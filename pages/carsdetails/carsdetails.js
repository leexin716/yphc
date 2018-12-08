// pages/carsdetails/carsdetails.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const http = require('../../utils/http.js')
const mdsign = require('../../utils/md5.min.js')
const util = require('../../utils/util.js')
Page({
  data: {
    imgUrls: [],
    swiperIndex: 0,
    currentIndex:1,
    planList:['购车','租车','试车'],
    showIndex:1,
    configureList:[],
    isfav:true,
    CarInfor:'',
    guidePrice:'',
    FinancingPlansList:[],
    firstShop:'',
    cartypeid:'',
    configs:'',
    shopInfor:'',
    shareTitle:'',
    swiperCurrent: 0,
    swiper_data_num:0
  },
  onLoad: function (options) {
    this.setData({
      cartypeid: options.id
    })
    this.getCarInfor(options.id)
    this.getFinancingPlans(options.id)
    // setTimeout(() => {
      this.getAllShops(options.id)
    // },500)
  },
  //获取车辆详情信息
  getCarInfor(id) {
    let that = this;
    let data = {};
    let timestap = Math.round(new Date() / 1000);
    let newData = util.addObj(data, 'timestamp', timestap);
    http.header.timestamp = timestap;
    http.header.sign = mdsign.md5(util.reData(newData));
    http.getReq('yphc/cartypes/'+id,{},function(res){
      if (res.errcode == 0){
        let shopInfor = {
          brand: res.data.brand,
          name: res.data.name,
          colour: res.data.colour,
          guidePrice: (res.data.guidePrice / 10000).toFixed(2),
          imgUrl: res.data.imgUrl,
          carTypeId: id
        }
        //取前四配置
        let obj = []
        let hh = JSON.parse(res.data.configs)
        for (let i = 0; i < hh.length; i++) {
          obj = obj.concat(hh[i].list)
        }
        obj.length = 4
        that.setData({
          shopInfor: JSON.stringify(shopInfor),
          imgUrls: res.data.carImgList,
          swiper_data_num: res.data.carImgList.length,
          configureList: obj,
          isfav: res.data.favorited,
          CarInfor:res.data,
          guidePrice: (res.data.guidePrice / 10000).toFixed(2),
          configs: res.data.configs,
          shareTitle: res.data.name
        })
        //是否有车型亮点
        if (res.data.lightspot) {
          WxParse.wxParse('elp', 'html', res.data.lightspot, that, 5)
        }
      }
    })
  },
  //获取分期购车金融方案
  getFinancingPlans(id){
    let that = this;
    let data = { carTypeId: id};
    let timestap = Math.round(new Date() / 1000);
    let newData = util.addObj(data, 'timestamp', timestap);
    http.header.timestamp = timestap;
    http.header.sign = mdsign.md5(util.reData(newData));
    http.getReq('yphc/financingPlans', { carTypeId: id},function(res){
      if (res.errcode == 0){
        that.setData({
          FinancingPlansList: res.data
        })
      }
    })
  },
  //获取附近门店
  getAllShops(id){
    let that = this;
    let data = {
      lng: app.globaData.lng,
      lat: app.globaData.lat,
      cityId: wx.getStorageSync("cityid"),
      districtId: '0',
      carTypeId: id
    };
    let timestap = Math.round(new Date() / 1000);
    let newData = util.addObj(data, 'timestamp', timestap);
    http.header.timestamp = timestap;
    http.header.sign = mdsign.md5(util.reData(newData));
    http.getReq('yphc/shops',{
      lng: app.globaData.lng,
      lat: app.globaData.lat,
      cityId: wx.getStorageSync("cityid"),
      districtId: '0',
      carTypeId: id
    },function(res){
      if (res.errcode == 0){
        that.setData({
          firstShop: res.data[0]
        })
      }
    })
  },
  //轮播改变样式赋值
  bindchange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //购车方案选项卡
  TipPlan(e){
    let that = this;
    if (that.data.currentIndex == e.target.dataset.current) {
      return false
    }else{
      that.setData({
        currentIndex: e.target.dataset.current,
        showIndex: e.target.dataset.current
      })
    }
  },
  //门店拨打电话
  callshop_phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //查看地图
  callshop_map: function (e) {
    let lat = e.currentTarget.dataset.lat;
    let lng = e.currentTarget.dataset.lng;
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },
  //关注
  add_remove_fav: function () {
    let that = this;
    let data = {
      carTypeId: that.data.cartypeid
    };
    let timestap = Math.round(new Date() / 1000);
    let newData = util.addObj(data, 'timestamp', timestap);
    http.header.timestamp = timestap;
    http.header.sign = mdsign.md5(util.reData(newData));
    if (!that.data.isfav) {
      http.postReq('yphc/add-favorite', { carTypeId: that.data.cartypeid},function(res){
        if(res){
          wx.showToast({
            title: '关注成功'
          })
          that.setData({
            isfav: true,
            favpng: 'http://qiniu.youpinhaoche.com/2018/06/07/icon_unfav.png'
          })
        }
      })
    } else {
      http.postReq('yphc/add-favorite', { carTypeId: that.data.cartypeid }, function (res) {
        if (res) {
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
  },
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    let that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: that.data.shareTitle,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})