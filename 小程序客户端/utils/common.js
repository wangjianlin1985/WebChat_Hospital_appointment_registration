var config = require("config.js")

var utils = {
  /**
   * 封装网络请求
   * url: 请求路径
   * data: 参数
   * successCallback：成功回调
   * failCallback：失败回调-可以统一处理
   * completeCallback:完成回调
   */
  sendRequest: function (url, data, successCallback, failCallback, noRefetch) {
    wx.showNavigationBarLoading();//显示进度条
    var authToken = wx.getStorageSync('authToken');
    var self = this;
    wx.request({
      url: url,
      data: data,
      method: 'post',
      header: {
        'Content-type': 'application/x-www-form-urlencoded',
        "x-auth-token": authToken
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '0000') {
          successCallback(result);// 成功回调
        }
        else if (result && result.code == '90001') {
          // TODO 提示用户登录
          console.info("用户未登录：" + result.msg);
        }
        else if (result && result.code == "90005") {
          console.info("Token值失效：" + result.msg);
          if (!noRefetch) {
            self._refetch(url, data, successCallback, failCallback)
          }
          
        }
        else {
          wx.showToast({ title: result.msg || '系统错误', icon: 'none' });
          failCallback && failCallback(result);// 失败回调;
        }
      },
      fail: function (err) {
        wx.showToast({ title: '访问出错...', icon: 'none' });
      },
      complete: function (res) {
        wx.hideNavigationBarLoading();//停止进度条
      },
    })
  },


  _refetch: function (url, data, successCallback, failCallback) {
    var self = this;
    console.log("开始重新获取token");
    //调用小程序登录接口
    wx.login({
      success: function (res) {
        if (res.code) {
          // 请求后台登录接口，获取openId
          wx.showNavigationBarLoading();//显示进度条
          wx.request({
            url: config.basePath + "auth/appLogin",
            data: {
              'jscode': res.code
            },
            method: 'post',
            header: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data;
              if (result && result.code == '0000') {
                // 登录成功后保存token
                wx.setStorageSync('authToken', result.data.authToken);
                
                self.sendRequest(url, data, successCallback, failCallback, true);
              }
              else if (result && result.code == '90001') { 
                console.info("用户未登录：" + result.msg); 
                wx.navigateTo({
                  url: '../mobile/mobile',
                })
              }
              else {
                // 弹出错误信息;
                wx.showToast({ title: result.msg, icon: 'none' });
              }
            },
            fail: function (err) {
              // 弹出错误信息;
              wx.showToast({ title: '访问出错...', icon: 'none' });
            },
            complete: function (res) {
              wx.hideNavigationBarLoading();//停止进度条
            },
          });
        }
      }
    }); 

  },


  /**
   * 封装网络请求
   * method: 方法名
   * data: 参数
   * successCallback：成功回调
   * failCallback：失败回调-可以统一处理
   * completeCallback:完成回调
   */
  sendJsonRequest: function (method, data, successCallback, failCallback) {
    wx.showNavigationBarLoading();//显示进度条
    var authToken = wx.getStorageSync('authToken');
    wx.request({
      url: config.api[method],
      data: data,
      method: 'post',
      header: {
        'Content-type': 'application/json',
        "x-auth-token": authToken
      },
      success: function (res) {
        var result = res.data;
        if (result && result.code == '0000') {
          successCallback(result);// 成功回调
        }
        else if (result && result.code == '90001') {
          // TODO 提示用户登录
          console.info("用户未登录：" + result.msg);
        }
        else {
          wx.showToast({ title: result.msg || '系统错误', icon: 'none' });
          failCallback && failCallback(result);// 失败回调;
        }
      },
      fail: function (err) {
        wx.showToast({ title: '访问出错...', icon: 'none' });
      },
      complete: function (res) {
        wx.hideNavigationBarLoading();//停止进度条
      },
    })
  },

  /**
   * 封装网络请求
   * url: 网络接口地址
   * data: 参数
   * successCallback：成功回调
   * failCallback：失败回调-可以统一处理
   * completeCallback:完成回调
   */
  sendUploadFile: function (url, filePath, successCallback, failCallback) {
    wx.showNavigationBarLoading();//显示进度条
    var authToken = wx.getStorageSync('authToken');
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      method: 'post',
      header: {
        'Content-type': 'application/x-www-form-urlencoded',
        "x-auth-token": authToken
      },
      success: function (res) {
        var result = JSON.parse(res.data);
        if (result && result.code == '0000') {
          successCallback(result);// 成功回调
        }
        else if (result && result.code == '90001') {
          // TODO 提示用户登录
          console.info("用户未登录：" + result.msg);
        }
        else {
          wx.showToast({ title: result.msg || '系统错误', icon: 'none' });
          failCallback && failCallback(result);// 失败回调;
        }
      },
      fail: function (err) {
        wx.showToast({ title: '访问出错...', icon: 'none' });
      },
      complete: function (res) {
        wx.hideNavigationBarLoading();//停止进度条
      },
    })
  },


  /**
   * 封装网络请求
   * url: 网络接口地址
   * data: 参数
   * successCallback：成功回调
   * failCallback：失败回调-可以统一处理
   * completeCallback:完成回调
   */
  sendUploadImage: function (url, filePath, successCallback, failCallback) {
    wx.showNavigationBarLoading();//显示进度条
    var authToken = wx.getStorageSync('authToken');
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'image',
      method: 'post',
      header: {
        'Content-type': 'application/x-www-form-urlencoded',
        "x-auth-token": authToken
      },
      success: function (res) {
        var result = JSON.parse(res.data);
        if (result && result.code == '0000') {
          successCallback(result);// 成功回调
        }
        else if (result && result.code == '90001') {
          // TODO 提示用户登录
          console.info("用户未登录：" + result.msg);
        }
        else {
          wx.showToast({ title: result.msg || '系统错误', icon: 'none' });
          failCallback && failCallback(result);// 失败回调;
        }
      },
      fail: function (err) {
        wx.showToast({ title: '访问出错...', icon: 'none' });
      },
      complete: function (res) {
        wx.hideNavigationBarLoading();//停止进度条
      },
    })
  }


}


module.exports = utils;