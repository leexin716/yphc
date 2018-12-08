//index.js
//获取应用实例
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js')
const http = require('../../utils/http.js')
const mdsign = require('../../utils/md5.min.js')
Page({
  data: {
    loading:true,
    price_tabs:[
     {
        'interval': '0', 
        'price':'10万以下'
     },
     {
       'interval': '1',
       'price': '10-15万'
     },
     {
       'interval': '2',
       'price': '15-20万'
     },
    ],
    currentTab: '0',
    imgBanner: [],
    logo_tabs:[],
    pcar_list:[],
    minPrice:'0',
    maxPrice:'100000',
    PriceInfo:'',
    isShowPriceCartype:false,
    recommend_list:[],
    carStory_list:[],
    cityname: app.globaData.currentCity,
    cityid: wx.getStorageSync("cityid"),
    isBack:false
  },
  onShow:function(){
    // let that = this
    // wx.getStorage({
    //   key: 'apiToken',
    //   success: function (res) {
    //     that.setData({
    //       isLogin: true,
    //     })
    //   }
    // })
    // console.log(util.IsLogin())
    // console.log(mdsign.md5('bookerName=测试&carTypeId=258&code=0000&phone=15258117060&reservationTime=1530523904&sex=1&shopId=4&timestamp=153052478948da9f3b5aa949f889cf8d8d6cb67003'))
    // let data = {
    //   content: '123456',
    //   phone: '15258117060'
    // }
    // let newData = util.addObj(data,'timestamp', Math.round(new Date() / 1000))
    // http.header.sign = mdsign.md5(util.reData(newData))
    // http.postReq('yphc/feedback', {
    //   content: '123456',
    //   phone: '15258117060'
    // }, function (res) {
    //   if (res) {
    //     // console.log(res)
    //   }
    // })
  },
  //页面加载前
  onLoad:function(e){
    let that = this
    setTimeout(function(){
      if(e.cityname){
        wx.setStorage({
          key: "cityid",
          data: e.cityid
        })
        that.setData({
          cityname: e.cityname
        })
      }
      that.getBanner()
      that.getPriceCartypes()
      that.getRecommendCartypes()
      that.getCarLogo()
      that.getCarStoryList()
    },500)
  },
  //判断
  prleft_login:function(e){
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
  story_login:function(e){
    let that = this
    wx.getStorage({
      key: 'apiToken',
      success: function (res) {
        wx.navigateTo({
          url: '../carstorydetails/carstorydetails?id=' + e.currentTarget.dataset.idx + '&&title=' + e.currentTarget.dataset.title
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '是否登录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login?islogin=' + e.currentTarget.dataset.islogin + '&&idx=' + e.currentTarget.dataset.idx + '&&title=' + e.currentTarget.dataset.title
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    })
  },
  banner_login:function(e){
    let that = this
    wx.getStorage({
      key: 'apiToken',
      success: function (res) {
        wx.navigateTo({
          url: '../webview/webview?url=' + e.currentTarget.dataset.url + '&&title=' + e.currentTarget.dataset.title + '&&page=' + e.currentTarget.dataset.page
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '是否登录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login?islogin=' + e.currentTarget.dataset.islogin + '&&page=' + e.currentTarget.dataset.page + '&&title=' + e.currentTarget.dataset.title + '&&url=' + e.currentTarget.dataset.url
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    })
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
  //获取汽车品牌列表
  getCarLogo:function(){
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api+'yphc/car-brands',
      header: {
        'content-type': 'application/json', // 默认值
        'fromBy': '5'
      },
      success: function (res) {
        let logo_tabs = []
        let obj = {
          'logo':'http://qiniu.youpinhaoche.com/2018/06/07/lookmore2.png',
          'chineseName':'更多'
        }
        for (let i = 0; i < 4;i++){
          logo_tabs[i] = res.data.data[i]
        }
        logo_tabs[logo_tabs.length] = obj
        that.setData({
          logo_tabs: logo_tabs
        })
        wx.hideLoading()
      }
    })
  },
  //价格区间推荐
  getPriceCartypes:function(){
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api +'yphc/price-cartypes',
      header: {
        'fromBy': '5'
      },
      data:{
        cityId: wx.getStorageSync("cityid"),
        minPrice: that.data.minPrice,
        maxPrice: that.data.maxPrice
      },
      success:function(res){
        if (res.data.data.length == 3){
          let pcar_list = []
          pcar_list[pcar_list.length] = res.data.data[1]
          pcar_list[pcar_list.length] = res.data.data[2]
          that.setData({
            isShowPriceCartype:true,
            PriceInfo: res.data.data[0],
            pcar_list: pcar_list
          })
        }else{
          that.setData({
            isShowPriceCartype:false
          })
        }
        wx.hideLoading()
      }
    })
  },
  //全场免首付推荐
  getRecommendCartypes:function(){
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api+'yphc/recommend-cartypes',
      header: {
        'fromBy': '5'
      },
      data:{
        category:'NEW_CAR',
        cityId: wx.getStorageSync("cityid"),
        pageSize:4
      },
      success:function(res){
        that.setData({
          recommend_list: res.data.data
        })
        wx.hideLoading()
      }
    })
  },
  //车主故事
  getCarStoryList:function(){
    let that = this;
    that.carStory_list = [];
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globaData.api +'yphc/carStory',
      header: {
        'fromBy': '5'
      },
      data:{
        pageSize:15
      },
      success:function(res){
        let carStory_list = []
        let replyArr = []
        // WxParse.wxParseTemArray("replyTemArray", 'reply', res.data.data.length, that)
        for (let i = 0; i < res.data.data.length;i++){
          let str = '',
              all = '',
              imgReg = /<img.*?(?:>|\/>)/gi,//匹配图片
              srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;//匹配src属性
          str = res.data.data[i].content;//得到数据源里的字符串
          let arr = str.match(imgReg);//得到所有已成功匹配图片的数组
          let src = arr[0].match(srcReg);//取数组中的第一条
          //获取图片地址
          let elp = '';
          if (src[1]) {
            elp = src[1]
          }
          //正则获取列表中文字符
          let obj = /[\u4e00-\u9fa5]+/g;
          all = res.data.data[i].content;
          all = all.replace(/<[^>]+>/g,'');
          all = all.match(obj);
          // WxParse.wxParse('elper', 'html', res.data.data[i].content, that);
          carStory_list.push({
            buyTime: res.data.data[i].buyTime.split(" ")[0],
            name: res.data.data[i].name,  
            carType: res.data.data[i].carType,
            img: elp,
            title: res.data.data[i].title,
            content: res.data.data[i].content,
            everyWorld: all
          })
        }
        // WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
        // for (let i = 0; i < replyArr.length; i++) {
        //   WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
        //   if (i === replyArr.length - 1) {
        //     WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
        //   }
        // }
        that.setData({
          carStory_list: carStory_list
        })
        wx.hideLoading()
      }
    })
  },
  //下拉刷新
  onPullDownRefresh:function(){
    console.log('下拉刷新')
    this.getCarStoryList()
    wx.stopPullDownRefresh()
  },
  //tabs选项卡
  swichNav:function(e){
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
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
      }else{
        this.setData({
          minPrice: 150000,
          maxPrice: 200000
        })
      }
      this.setData({
        PriceInfo:'',
        pcar_list:[],
        currentTab: e.target.dataset.current
      })
      this.getPriceCartypes()
    }
  },
  //去选车
  gofun:function(e){
    if (e.currentTarget.dataset.name != '更多'){
      app.globaData.carname = e.currentTarget.dataset.name
      app.globaData.carbrandid = e.currentTarget.dataset.id
    }else{
      app.globaData.carname = '品牌'
      app.globaData.carbrandid = 0
    }
    wx.switchTab({
      url: '/pages/carselect/carselect'
    })
  },
  //搜索判断
  search_login: function (e) {
    let that = this
    wx.getStorage({
      key: 'apiToken',
      success: function (res) {
        wx.navigateTo({
          url: '../search/search'
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
  //消息判断
  mess_login: function (e) {
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
  //滚动
  onPageScroll:function(e){
    if (e.scrollTop > 150) {
      this.setData({
        isBack:true
      })
    }else{
      this.setData({
        isBack: false
      })
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '优品好车',
      path: '/pages/index/index',
      success: function (res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})
