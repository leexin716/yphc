// pages/search/search.js
const app = getApp()
Page({
  data: {
    arrData:[],
    isHis:false,
    isList:false,
    page:0,
    isFromSearch:true,
    nolength:false,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    searchLogList: [], // 存储搜索历史记录信息
    inputVal:''
  },
  onLoad: function (options) {
    this.reLoadHistory()
  },
  onShow:function(){

  },
  //获取历史缓存
  reLoadHistory:function(){
    let that = this
    if (wx.getStorageSync('searchLog') != '') {
      that.setData({
        searchLogList: wx.getStorageSync('searchLog'),
        isHis: true
      })
    }
  },
  //列表
  fetchSearchList:function(p){
    let that = this
    wx.request({
      url: app.globaData.api + 'yphc/cartypes',
      header: {
        'fromBy': '5'
      },
      data: {
        cityId: wx.getStorageSync("cityid"),
        searchText: p,
        pageNo: that.data.page,
        pageSize: 15
      },
      success: function (res) {
        if (res.data.errcode == 0) {
          if (res.data.data.length == 0) {//暂无信息
            that.setData({
              nolength: true
            })
            wx.hideLoading()
            return
          }
          if (res.data.data.length != 0) {
            let searchList = [];
            that.data.isFromSearch ? searchList = res.data.data : searchList = that.data.arrData.concat(res.data.data)
            that.setData({
              arrData: searchList, //获取数据数组
              searchLoading: true
            })
            wx.hideLoading()
          } else {
            that.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示  
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
            })
          }
        }
      }
    })
  },
  //去重
  removeDuplicatedItem: function (arr){
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j]) {
          arr.splice(j, 1);//console.log(arr[j]);
          j--;
        }
      }
    }
    return arr;
  },
  //搜索
  searchFind:function(e){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    if (e.detail.value == ''){
      wx.showToast({
        title: '请输入关键字',
        icon:'none'
      })
      return
    }
    //设搜索缓存
    let searchLogData = that.data.searchLogList;
    searchLogData.unshift(e.detail.value);
    searchLogData = that.removeDuplicatedItem(searchLogData);
    wx.setStorageSync('searchLog', searchLogData);

    that.setData({
      isHis:false,
      isList:true,
      nolength: false,
      arrData:[],
      page:0
    })
    that.fetchSearchList(e.detail.value)
  },
  //监听
  listenFind:function(e){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    that.setData({
      arrData:[],
      nolength: false,
      page:0
    })
    if (e.detail.value == ''){
      if (wx.getStorageSync('searchLog')) {
        that.reLoadHistory()
        that.setData({
          isHis: true,
          isList: false
        })
      }
      wx.hideLoading()
      return
    }else{
      that.setData({
        isHis: false,
        isList: true,
        inputVal: e.detail.value
      })
    }
    that.fetchSearchList(e.detail.value)
  },
  //取消
  navigateBack:function(){
    wx.navigateBack()
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList(that.data.inputVal);
    }
  },
  // 通过搜索记录查询数据  
  searchDataByLog: function (e) {
    let that = this;
    that.setData({
      page:0,
      arrData: [],
      isHis: false,
      isList: true,
      inputVal: e.currentTarget.dataset.log
    });
    that.fetchSearchList(e.currentTarget.dataset.log);
  },
  // 清除搜索记录  
  clearSearchLog: function () {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定清空历史记录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync("searchLog")
          that.setData({
            isHis: false,
            isList: true,
            searchLogList:[]
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})