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

  //选择成立日期事件
  bind_birthDate_change: function (e) {
    this.setData({
      birthDate: e.detail.value
    })
  },
  //清空成立日期事件
  clear_birthDate: function (e) {
    this.setData({
      birthDate: "",
    });
  },

  //提交服务器修改科室信息信息
  formSubmit: function (e) {
    var self = this
    var formData = e.detail.value
    var url = config.basePath + "api/department/update"
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 500
      })

      //服务器修改成功返回列表页更新显示为最新的数据
      var pages = getCurrentPages()
      var departmentlist_page = pages[pages.length - 2];
      var departments = departmentlist_page.data.departments
      for(var i=0;i<departments.length;i++) {
        if(departments[i].departmentId == res.data.departmentId) {
          departments[i] = res.data
          break
        }
      }
      departmentlist_page.setData({departments:departments})
      setTimeout(function () {
        wx.navigateBack({})
      }, 500) 
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

})

