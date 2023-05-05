var utils = require("../../utils/common.js")
var config = require("../../utils/config.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    doctorNumber: "", //医生工号
    password: "", //登录密码
    departmentObj: "", //所在科室
    doctorName: "", //医生姓名
    sex: "", //性别
    doctorPhotoUrl: "", //医生照片
    birthDate: "", //出生日期
    position: "", //医生职位
    experience: "", //工作经验
    contactWay: "", //联系方式
    goodAt: "", //擅长
    doctorDesc: "", //医生介绍
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var self = this
    var doctorNumber = params.doctorNumber
    var url = config.basePath + "api/doctor/get/" + doctorNumber
    utils.sendRequest(url, {}, function (doctorRes) {
      wx.stopPullDownRefresh()
      self.setData({
        doctorNumber: doctorRes.data.doctorNumber,
        password: doctorRes.data.password,
        departmentObj: doctorRes.data.departmentObj.departmentName,
        doctorName: doctorRes.data.doctorName,
        sex: doctorRes.data.sex,
        doctorPhoto: doctorRes.data.doctorPhoto,
        doctorPhotoUrl: doctorRes.data.doctorPhotoUrl,
        birthDate: doctorRes.data.birthDate,
        position: doctorRes.data.position,
        experience: doctorRes.data.experience,
        contactWay: doctorRes.data.contactWay,
        goodAt: doctorRes.data.goodAt,
        doctorDesc: doctorRes.data.doctorDesc,
      })
    })
  },


  addOrder: function() {
    var self = this
    wx.navigateTo({
      url: '../orderInfo/orderInfo_user_add?doctorNumber=' + self.data.doctorNumber ,
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

