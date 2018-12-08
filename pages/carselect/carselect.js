// pages/carselect/carselect.js
const app = getApp()
Page({
  data: {
    filterdata: {},
    showfilter: false,
    showfilterindex: null,

    firstpayindex: 0,
    firstpayid: 0,

    monthpayindex: 0,
    monthpayid: 0,

    brandindex: 0,
    brandid: 0,
    brandData: [],

    defaultindex: 0,
    defaultid: 0,

    defaulttitle: '默认',
    brandtitle: '品牌',
    firstpaytitle: '首付',
    monthpaytitle: '月供',

    scrolltop: null, //滚动位置
    page: 0,  //分页
    minDownPayment: 0,
    maxDownPayment: 0,
    minMonthlyPayment: 0,
    maxMonthlyPayment: 0,
    arrData: [],
    screenWidth: 0,
    screenHeight: 0,
    inSaleHeight: 0,
    hasmore: 0,
    searchLoading:false,
    searchLoadingComplete:false,
    isFromSearch:true,
    scrollHeight:0,
    isMoreContent:false,
    isLogin:false
  },
  onLoad: function () {
    let that = this
    wx.setStorage({
      key: "carname",
      data: app.globaData.carname
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ scrollHeight: res.windowHeight - 80 });
      }
    });
    that.setData({
      page: 0,
      arrData: [],
      brandtitle: app.globaData.carname,
      brandid: app.globaData.carbrandid
    })
    that.fetchFilterData();
    that.requestBarndData();
    that.requestData();
  },
  onShow:function(){
    let that = this
    if (wx.getStorageSync('carname') != app.globaData.carname){
      that.setData({
        page:0,
        arrData:[],
        brandtitle: app.globaData.carname,
        brandid: app.globaData.carbrandid
      })
      wx.setStorage({
        key: "carname",
        data: app.globaData.carname
      })
      that.requestData();
    }
  },
  //搜索判断
  search_login:function(e){
    let that = this
    wx.getStorage({
      key: 'apiToken',
      success: function (res) {
        wx.navigateTo({
          url: '../search/search'
        })
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          content: '是否登录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login?islogin=' + e.currentTarget.dataset.islogin
              })
            } else if (res.cancel) {
              
            }
          }
        })
      }
    })
  },
  //消息判断
  mess_login:function(e){
    let that = this
    wx.getStorage({
      key: 'apiToken',
      success: function (res) {
        wx.navigateTo({
          url: '../notice/notice'
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '是否登录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login?islogin=' + e.currentTarget.dataset.islogin
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    })
  },
  //列表判断
  carlist_login:function(e){
    let that = this
    wx.getStorage({
      key: 'apiToken',
      success: function (res) {
        wx.navigateTo({
          url: '../cardetails/cardetails?id=' + e.currentTarget.dataset.id
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
  //获取筛选条件
  fetchFilterData: function () {
    this.setData({
      filterdata: {
        "default": [{
          "id": 0,
          "name": "默认"
        },
        {
          "id": 1,
          "name": "首付最低",
        },
        {
          "id": 2,
          "name": "首付最高",
        },
        {
          "id": 3,
          "name": "月供最低",
        },
        {
          "id": 4,
          "name": "月供最高",
        },
        ],

        "firstPay": [{
          "id": 0,
          "name": "首付"
        },
        {
          "id": 1,
          "name": "1万以内",
        },
        {
          "id": 2,
          "name": "1-2万",
        },
        {
          "id": 3,
          "name": "2-3万",
        },
        {
          "id": 4,
          "name": "3-4万",
        },
        {
          "id": 5,
          "name": "4-5万",
        },
        {
          "id": 6,
          "name": "5万以上",
        },
        ],

        "monthPay": [{
          "id": 0,
          "name": "月供"
        },
        {
          "id": 1,
          "name": "2000元以内",
        },
        {
          "id": 2,
          "name": "2000-3000元",
        },
        {
          "id": 3,
          "name": "3000-4000元",
        },
        {
          "id": 4,
          "name": "4000-5000元",
        },
        {
          "id": 5,
          "name": "5000元以上",
        },
        ]
      }
    })
  },
  requestData: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const d = this.data;
    if (d.firstpayid == 0) {
      this.setData({
        minDownPayment: 0,
        maxDownPayment: 0,
      })
    }
    else if (d.firstpayid == 1) {
      this.setData({
        minDownPayment: 0,
        maxDownPayment: 10000,
      })
    }
    else if (d.firstpayid == 2) {
      this.setData({
        minDownPayment: 10000,
        maxDownPayment: 20000,
      })
    }
    else if (d.firstpayid == 3) {
      this.setData({
        minDownPayment: 20000,
        maxDownPayment: 30000,
      })
    }
    else if (d.firstpayid == 4) {
      this.setData({
        minDownPayment: 30000,
        maxDownPayment: 40000,
      })
    }
    else if (d.firstpayid == 5) {
      this.setData({
        minDownPayment: 40000,
        maxDownPayment: 50000,
      })
    }
    else if (d.firstpayid == 6) {
      this.setData({
        minDownPayment: 50000,
        maxDownPayment: 0,
      })
    }
    //月供赋值
    if (d.monthpayid == 0) {
      this.setData({
        minMonthlyPayment: 0,
        maxMonthlyPayment: 0,
      })
    }
    else if (d.monthpayid == 1) {
      this.setData({
        minMonthlyPayment: 0,
        maxMonthlyPayment: 2000,
      })
    }
    else if (d.monthpayid == 2) {
      this.setData({
        minMonthlyPayment: 2000,
        maxMonthlyPayment: 3000,
      })
    }
    else if (d.monthpayid == 3) {
      this.setData({
        minMonthlyPayment: 3000,
        maxMonthlyPayment: 4000,
      })
    }
    else if (d.monthpayid == 4) {
      this.setData({
        minMonthlyPayment: 4000,
        maxMonthlyPayment: 5000,
      })
    }
    else if (d.monthpayid == 5) {
      this.setData({
        minMonthlyPayment: 5000,
        maxMonthlyPayment: 0,
      })
    }
    let that = this
    wx.request({
      url: app.globaData.api + 'yphc/cartypes',
      header: {
        'fromBy': '5'
      },
      data:{
        cityId: wx.getStorageSync("cityid"),
        sort: d.defaultid,
        brandId: d.brandid,
        pageNo: d.page,
        pageSize:15,
        minMonthlyPayment: d.minMonthlyPayment,
        maxMonthlyPayment: d.maxMonthlyPayment,
        minDownPayment: d.minDownPayment,
        maxDownPayment: d.maxDownPayment
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          if(res.data.data.length != 0){
            let searchList = [];
            that.data.isFromSearch ? searchList = res.data.data : searchList = that.data.arrData.concat(res.data.data)
            that.setData({
              arrData: searchList, //获取数据数组
              searchLoading: true,   //把"上拉加载"的变量设为false，显示
              isMoreContent: false
            });
          }else{
            that.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示  
              searchLoading: false,  //把"上拉加载"的变量设为false，隐藏 
              isMoreContent:true
            })
          }
          wx.hideLoading()
        }
      }
    })
  },
  requestBarndData: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api + 'yphc/car-brands',
      header: {
        'fromBy': '5'
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          let bands = [
            {
              id:0,
              chineseName:'品牌'
            }
          ]
          bands = bands.concat(res.data.data)
          that.setData({
            brandData: bands
          })
          wx.hideLoading()
        }
      }
    })
  },
  setFilterPanel: function (e) { //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }
  },
  //默认选择
  setDefaultIndex: function (e) {
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      defaultindex: dataset.defaultindex,
      defaultid: dataset.defaultid,
      defaulttitle: d.filterdata['default'][dataset.defaultindex]['name'],
    })
    this.hideFilter();
    this.setData({
      page: 0,
      arrData: [],
      searchLoading: false,
      searchLoadingComplete: false,
      isFromSearch: true,
    })
    this.requestData();
  },

  //品牌选择
  setBrandIndex: function (e) {
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      brandindex: dataset.brandindex,
      brandid: dataset.brandid,
      brandtitle: d.brandData[dataset.brandindex]['chineseName'],
    })
    this.hideFilter();
    this.setData({
      page: 0,
      arrData: [],
      searchLoading: false,
      searchLoadingComplete: false,
      isFromSearch: true,
    })
    this.requestData();
  },

  //首付选择
  setFirstPayIndex: function (e) {
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      firstpayindex: dataset.firstpayindex,
      firstpayid: dataset.firstpayid,
      firstpaytitle: d.filterdata['firstPay'][dataset.firstpayindex]['name'],
    })
    this.hideFilter();
    this.setData({
      page: 0,
      arrData: [],
      searchLoading: false,
      searchLoadingComplete: false,
      isFromSearch: true,
    })
    this.requestData();
  },

  //月供选择
  setMonthPayIndex: function (e) {
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      monthpayindex: dataset.monthpayindex,
      monthpayid: dataset.monthpayid,
      monthpaytitle: d.filterdata['monthPay'][dataset.monthpayindex]['name'],
    })
    this.hideFilter();
    this.setData({
      page: 0,
      arrData: [],
      searchLoading: false,
      searchLoadingComplete: false,
      isFromSearch: true,
    })
    this.requestData();
  },

  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  //分页
  scrollLoading:function(){
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.requestData();
    }
  },
  goSearch:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  }
})