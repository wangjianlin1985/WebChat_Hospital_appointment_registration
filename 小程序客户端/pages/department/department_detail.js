var utils = require("../../utils/common.js")
var config = require("../../utils/config.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    departmentId: 0, //科室id
    departmentName: "", //科室名称
    departmentDesc: "", //科室介绍
    birthDate: "", //成立日期
    chargeMan: "", //负责人
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var self = this
    var departmentId = params.departmentId
    var url = config.basePath + "api/department/get/" + departmentId
    utils.sendRequest(url, {}, function (departmentRes) {
      wx.stopPullDownRefresh()
      self.setData({
        departmentId: departmentRes.data.departmentId,
        departmentName: departmentRes.data.departmentName,
        departmentDesc: departmentRes.data.departmentDesc,
        birthDate: departmentRes.data.birthDate,
        chargeMan: departmentRes.data.chargeMan,
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

