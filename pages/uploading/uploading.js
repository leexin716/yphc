// pages/uploadimg/uploadimg.js
const qiniuUploader = require("../../utils/qiniuUploader")
const util = require("../../utils/util")
const http = require('../../utils/https.js')
Page({
  data: {
    imgs: 'http://mp.static.youpinhaoche.com/mohu.png',
    imageURL: '',
    date: '请选择',
    loveTime: '',
    array: ['马车很慢，阳光很懒，你很好看', '一日三餐与你一起', '可爱不是长久之计，可爱我是长久之计', '每天醒来，阳光和你都在，真好', '爱你是我做过最好的事', '愿得一人心，白首不分离'],
    showModal: false,
    isUpload: true,
    contentIndex: ''
  },
  onLoad: function (options) {
    // this.setData({
    //   array: ['马车很慢，阳光很懒，你很好看', '一日三餐与你一起', '可爱不是长久之计，可爱我是长久之计', '每天醒来，阳光和你都在，真好', '爱你是我做过最好的事','愿得一人心，白首不分离']
    // })
  },
  //弹出框蒙层截断touchmove事件
  preventTouchMove: function () {
  },
  //弹层确定
  onConfirm: function () {
    wx.redirectTo({
      url: '../mypage/mypage',
    })
  },
  //废话点击事件
  bindPickerChange: function (e) {
    console.log(e)
    this.setData({
      index: e.detail.value,
      contentIndex: e.detail.value
    })
  },
  //点击上传
  upload: function () {
    let that = this
    var timestamp = Date.parse(new Date())
    var filename = util.formatDate(new Date()) + '/' + timestamp + 'imgs'
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          imgs: res.tempFilePaths[0],
          isUpload: false,
          isUploader: true
        })
        var filePath = res.tempFilePaths[0];
        qiniuUploader.upload(filePath, (res) => {
          wx.showLoading({
            title: '上传中...'
          })
          that.setData({
            imageURL: res.key,
            imgs: wx.getStorageSync('qiniuDomain') + res.key + '!h500'
          })
          setTimeout(() => {
            wx.hideLoading()
          }, 3000)
        }, (error) => {
          console.log('error: ' + error);
          wx.showModal({
            title: '提示',
            content: error,
            confirmColor: '#549c98',
            showCancel: 'false'
          })
        },
          {
            uploadURL: 'https://up.qbox.me',
            region: 'ECN',
            uptoken: wx.getStorageSync("qiniuToken"),
            key: filename
          }
        )
      }
    })
  },
  //生成图片
  getPhoneNumber: function (e) {
    let that = this
    wx.login({
      success: function (res) {
        let code = res.code
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
          // 判断
          if (that.data.imageURL == '') {
            wx.showToast({
              title: '请上传照片',
              icon: 'none',
              duration: 2000
            })
            return
          }
          if (that.data.date == '请选择') {
            wx.showToast({
              title: '请选择时间',
              icon: 'none',
              duration: 2000
            })
            return
          }
          if (that.data.contentIndex == '') {
            wx.showToast({
              title: '请选择情话',
              icon: 'none',
              duration: 2000
            })
            return
          }
          http.postReq('ss/user/makelove', {
            code: code,
            loveTime: that.data.date,
            uuid: wx.getStorageSync('uuid'),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            loveImg: that.data.imageURL,
            contentIndex: that.data.contentIndex
          }, function (res1) {
            wx.showLoading({
              title: '生成中...',
            })
            if (res1.code == 0) {
              console.log(res1.data)
              that.saveImg(res1.data)
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '授权失败，请重新发起授权',
            confirmColor: '#549c98',
            showCancel: false
          })
        }
      }
    })
  },
  //时间选择
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  saveImg: function (imgSrc) {
    let that = this
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            wx.hideLoading()
            that.setData({
              showModal: true
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              console.log("当初用户拒绝，再次发起授权")
              //获取相册授权
              wx.getSetting({
                success(res) {
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                        console.log('授权成功')
                      }
                    })
                  }
                }
              })
              // wx.openSetting({
              //   success(settingdata) {
              //     console.log(settingdata)
              //     if (settingdata.authSetting['scope.writePhotosAlbum']) {
              //       console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
              //     } else {
              //       console.log('获取权限失败，给出不给权限就无法正常使用的提示')
              //     }
              //   }
              // })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  }
})