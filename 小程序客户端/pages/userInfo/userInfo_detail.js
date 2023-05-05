var utils = require("../../utils/common.js")
var config = require("../../utils/config.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_name: "", //用户名
    password: "", //登录密码
    name: "", //姓名
    gender: "", //性别
    birthDate: "", //出生日期
    userPhotoUrl: "", //用户照片
    telephone: "", //联系电话
    email: "", //邮箱
    address: "", //家庭地址
    regTime: "", //注册时间
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var self = this
    var user_name = params.user_name
    var url = config.basePath + "api/userInfo/get/" + user_name
    utils.sendRequest(url, {}, function (userInfoRes) {
      wx.stopPullDownRefresh()
      self.setData({
        user_name: userInfoRes.data.user_name,
        password: userInfoRes.data.password,
        name: userInfoRes.data.name,
        gender: userInfoRes.data.gender,
        birthDate: userInfoRes.data.birthDate,
        userPhoto: userInfoRes.data.userPhoto,
        userPhotoUrl: userInfoRes.data.userPhotoUrl,
        telephone: userInfoRes.data.telephone,
        email: userInfoRes.data.email,
        address: userInfoRes.data.address,
        regTime: userInfoRes.data.regTime,
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  }

})

