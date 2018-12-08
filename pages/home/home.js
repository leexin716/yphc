// pages/home/home.js
const app = getApp()
const http = require('../../utils/http.js')
Page({
  data: {
    imgBanner: [],
    account:['5万以下','5-8万','8-10万','10万以上'],
    currentTab:'0',
    logo_tabs:[],
    GroomList:[],
    minPrice: '0',
    maxPrice: '100000',
    tabTagList: ['默认排序', '品牌','月供','筛选'],
    defaultTitle:'默认排序',
    brandTitle:'品牌',
    monsupplyTitle:'月供',
    filterTitle:'筛选',
    defaulter:['默认排序','车价最高','车辆最低','月供最低'],
    brander: ['品牌','别克别克别克','本田'],
    monsupply:['月供','1500以内','1500000-3000元'],
    filter:['筛选','租车','购车'],
    dialogShow:false,
    top:0,
    carTableData: [],//返回数据的数组
    isFromSearch: true,// 用于判断carTableData数组是不是空数组
    defaultid:0,//默认
    brandid:0,//品牌
    page: 0,  //分页
    minDownPayment: 0,
    maxDownPayment: 0,
    minMonthlyPayment: 0,
    maxMonthlyPayment: 0,
    scrollHeight:'',
    scrollTop: 0,
    isFixed:false,
    tabId:-1,
    dialogId0: -1,
    dialogId1: -1,
    dialogId2: -1,
    dialogId3: -1,
  },
  onLoad: function (options) {
    let that = this
    that.getBanner()
    that.getCarLogo()
    that.getPriceCartypes()
    that.carLister()
    wx.getSystemInfo({
      success: function (res) {
        // that.setData({ scrollHeight: res.windowHeight - 45 });
      }
    });
  },
  onShow: function () {

  },
  //获取bannner
  getBanner: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api + 'yphc/actives',
      header: {
        'fromBy': '5'
      },
      data: {
        cityId: wx.getStorageSync("cityid"),
        districtId: '0',
        position: 'app_index'
      },
      success: function (res) {
        that.setData({
          imgBanner: res.data.data
        })
        wx.hideLoading()
      }
    })
  },
  //点击图标事件
  TipBrand:function(e){
    if (this.data.currentTab == e.target.dataset.current){
      console.log(1)
      return false
    }else{
      if (e.target.dataset.current == 0){
        this.setData({
          minPrice: 0,
          maxPrice: 100000
        })
      } else if (e.target.dataset.current == 1){
        this.setData({
          minPrice: 100000,
          maxPrice: 150000
        })
      } else if (e.target.dataset.current == 2) {
        this.setData({
          minPrice: 150000,
          maxPrice: 200000
        })
      } else if (e.target.dataset.current == 3) {
        this.setData({
          minPrice: 200000,
          maxPrice: 250000
        })
      }
      this.setData({
        currentTab: e.target.dataset.current
      })
      this.getPriceCartypes()
    }
  },
  //获取汽车品牌列表
  getCarLogo: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api + 'yphc/car-brands',
      header: {
        'content-type': 'application/json', // 默认值
        'fromBy': '5'
      },
      success: function (res) {
        let logo_tabs = []
        for (let i = 0; i < 5; i++) {
          logo_tabs[i] = res.data.data[i]
        }
        that.setData({
          logo_tabs: logo_tabs
        })
        wx.hideLoading()
      }
    })
  },
  //价格区间推荐
  getPriceCartypes: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api + 'yphc/price-cartypes',
      header: {
        'fromBy': '5'
      },
      data: {
        cityId: wx.getStorageSync("cityid"),
        minPrice: that.data.minPrice,
        maxPrice: that.data.maxPrice,
        pageSize:15
      },
      success: function (res) {
        if (res.data.data) {
          that.setData({
            isShowPriceCartype: true,
            GroomList: res.data.data
          })
        } else {
          that.setData({
            isShowPriceCartype: false
          })
        }
        wx.hideLoading()
      }
    })
  },
  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
  },
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    })
    console.log(event)
  },
  //tab选项卡点击事件
  filterFn(e){
    console.log(e.target.dataset.id)
    // wx.pageScrollTo({
    //   scrollTop: 400
    // })
    this.setData({
      isFixed:true,
      dialogShow:true,
      tabId: e.target.dataset.id
    })
  },
  //关闭遮罩
  closeDialog(){
    this.setData({
      isFixed: false,
      dialogShow: false,
      tabId: -1
    })
  },
  //筛选类型选择
  tapDefault(e) {// 默认列表
    if (e.target.dataset.id != 0){
      this.setData({
        dialogId0: e.target.dataset.id,
      })
    }else{
      this.setData({
        dialogId0: -1
      })
    }
    this.setData({
      defaultTitle: e.target.dataset.name,
    })
  },
  tapBrand(e) {// 品牌列表
    if(e.target.dataset.id != 0){
      this.setData({
        dialogId1: e.target.dataset.id,
      })
    }else {
      this.setData({
        dialogId1: -1
      })
    }
    this.setData({
      brandTitle: e.target.dataset.name,
    })
  },
  tapMonsupply(e) {// 月供列表
    if (e.target.dataset.id != 0) {
      this.setData({
        dialogId2: e.target.dataset.id,
      })
    } else {
      this.setData({
        dialogId2: -1
      })
    }
    this.setData({
      monsupplyTitle: e.target.dataset.name,
    })
  },
  tapFilter(e) {// 筛选列表
    if (e.target.dataset.id != 0) {
      this.setData({
        dialogId3: e.target.dataset.id,
      })
    } else {
      this.setData({
        dialogId3: -1
      })
    }
    this.setData({
      filterTitle: e.target.dataset.name,
    })
  },
  // bindscroll(e){
  //   this.data.top = e.detail.scrollTop
  //   console.log(this.data.top )
  // }
  //判断
  prleft_login: function (e) {
    let that = this
    wx.getStorage({
      key: 'apiToken',
      success: function (res) {
        wx.navigateTo({
          url: '../carsdetails/carsdetails?id=' + e.currentTarget.dataset.id
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '是否登录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login?islogin=' + e.currentTarget.dataset.islogin + '&&id=' + e.currentTarget.dataset.id
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    })
  },
  //车辆列表
  carLister(){
    let that = this;
    wx.request({
      url: app.globaData.api + 'yphc/cartypes',
      header: {
        'fromBy': '5'
      },
      data: {
        cityId: wx.getStorageSync("cityid"),
        sort: that.data.defaultid,
        brandId: that.data.brandid,
        pageNo: that.data.page,
        pageSize: 15,
        minMonthlyPayment: that.data.minMonthlyPayment,
        maxMonthlyPayment: that.data.maxMonthlyPayment,
        minDownPayment: that.data.minDownPayment,
        maxDownPayment: that.data.maxDownPayment
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          if (res.data.data.length != 0) {
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? searchList = res.data.data : searchList = that.data.carTableData.concat(res.data.data)
            that.setData({
              carTableData: searchList,
              searchLoading: true
            });
          } else {
            that.setData({
              searchLoadingComplete: true,
              searchLoading: false
            });
          }
        }
      }
    })
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    console.log(1)
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1,
        isFromSearch: false
      });
      that.carLister();
    }
  },
})