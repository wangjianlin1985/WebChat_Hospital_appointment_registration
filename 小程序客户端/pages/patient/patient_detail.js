var utils = require("../../utils/common.js")
var config = require("../../utils/config.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    patientId: 0, //病人id
    doctorObj: "", //医生
    patientName: "", //病人姓名
    sex: "", //性别
    cardNumber: "", //身份证号
    telephone: "", //联系电话
    illnessCase: "", //病人病例
    addTime: "", //登记时间
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var self = this
    var patientId = params.patientId
    var url = config.basePath + "api/patient/get/" + patientId
    utils.sendRequest(url, {}, function (patientRes) {
      wx.stopPullDownRefresh()
      self.setData({
        patientId: patientRes.data.patientId,
        doctorObj: patientRes.data.doctorObj.doctorName,
        patientName: patientRes.data.patientName,
        sex: patientRes.data.sex,
        cardNumber: patientRes.data.cardNumber,
        telephone: patientRes.data.telephone,
        illnessCase: patientRes.data.illnessCase,
        addTime: patientRes.data.addTime,
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

