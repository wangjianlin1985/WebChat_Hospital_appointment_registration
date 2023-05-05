var utils = require("../../utils/common.js")
var basePath = 'http://localhost:8080/JavaWebProject/'
var app = getApp()
var maxTime = 60
var currentTime = maxTime 
var interval = null
Page({
  data: {
    userInfo: {},
    btnName: '获取验证码',
    disabled: false,
    mobile: '1234567890',
    msCodes: '0',
    openid: 0
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo
    })
  },
  mobileInputEvent: function (ev) {
    var mobile = ev.detail.value;
    if (mobile.length == 11){
      this.setData({
        mobile: ev.detail.value
      })
    }
  },

  reSendPhoneNum: function (e) {
    var that = this;
    var tel = that.data.mobile;
    if (tel == '1234567890') {
      wx.showToast({
        title: '请填手机号',
        icon: 'loading',
        duration: 500
      })
    } else {
        currentTime = maxTime;
        interval = setInterval(function () {
          currentTime--
          that.setData({
            time: '(' + currentTime + 's)',
            disabled: true,
            btnName: '请稍后'
          })
          if (currentTime <= 0) {
            currentTime = -1
            clearInterval(interval)
            that.setData({
              time: '',
              disabled: false,
              btnName: '重新获取'
            })
          }
        }, 1000)
        setTimeout(function () {
          wx.request({
            url: basePath + 'auth/mobile/code',
            method: 'post',
            data: {"tel": tel},
            header: {
              'Content-Type': 'application/json'
            },
            success: function (e) {
              that.setData({
                msCodes: e.data.data
              })
            }
          })
        }, 1000)
        wx.showToast({
          title: '发送成功',
          icon: 'loading',
          duration: 500
        })
    }
  },

  formBindsubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    var openid = that.data.openid;
    var msCode = that.data.msCodes; 
    var telCode = e.detail.value.telCode;
    var mobile = that.data.mobile;
	
    //判断下是否点击了授权按钮 
    if(JSON.stringify(that.data.userInfo) == "{}") {
      wx.showToast({
        title: '请先授权登录',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
		
    if (mobile == '1234567890'){
      wx.showToast({
        title: '请填手机号',
        icon: 'loading',
        duration: 500
      })
    }else{
      if (msCode == telCode) {
        wx.login({
          success: function (res) {
            var url = basePath + "auth/register"
            formData["jsCode"] = res.code
            utils.sendRequest(url, formData, function(res){
             
              wx.showToast({
                title: '验证通过',
                icon: 'loading',
                duration: 1000
              })

              wx.setStorageSync('authToken', res.data.authToken);

              setTimeout(function () {
                wx.navigateBack({});
                /*
                wx.switchTab({
                  url: '../add/add',
                })*/
              }, 1200)
            })
          }
        })

        
      } else {
        wx.showToast({
          title: '验证码错误',
          icon: 'loading',
          duration: 500
        })
      }
    }
  },

  onLoad: function (options) {
    
    var self = this
    /*
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: API_URL + '/GetOpenid/code/' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              openid: res.data
            })
          }
        })
      }
    })*/


    app.getUserInfo(function (userInfo) {
      self.setData({
        userInfo: userInfo
      })
    })
  }
})