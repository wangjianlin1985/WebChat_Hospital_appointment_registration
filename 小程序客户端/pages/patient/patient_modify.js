var utils = require("../../utils/common.js")
var config = require("../../utils/config.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    patientId: 0, //病人id
    doctorObj_Index: "0", //医生
    doctors: [],
    patientName: "", //病人姓名
    sex: "", //性别
    cardNumber: "", //身份证号
    telephone: "", //联系电话
    illnessCase: "", //病人病例
    addTime: "", //登记时间
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  //选择登记时间事件
  bind_addTime_change: function (e) {
    this.setData({
      addTime: e.detail.value
    })
  },
  //清空登记时间事件
  clear_addTime: function (e) {
    this.setData({
      addTime: "",
    });
  },

  //医生修改事件
  bind_doctorObj_change: function (e) {
    this.setData({
      doctorObj_Index: e.detail.value
    })
  },

  //提交服务器修改病人信息信息
  formSubmit: function (e) {
    var self = this
    var formData = e.detail.value
    var url = config.basePath + "api/patient/update"
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 500
      })

      //服务器修改成功返回列表页更新显示为最新的数据
      var pages = getCurrentPages()
      var patientlist_page = pages[pages.length - 2];
      var patients = patientlist_page.data.patients
      for(var i=0;i<patients.length;i++) {
        if(patients[i].patientId == res.data.patientId) {
          patients[i] = res.data
          break
        }
      }
      patientlist_page.setData({patients:patients})
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
    var patientId = params.patientId
    var url = config.basePath + "api/patient/get/" + patientId
    utils.sendRequest(url, {}, function (patientRes) {
      wx.stopPullDownRefresh()
      self.setData({
        patientId: patientRes.data.patientId,
        doctorObj_Index: 1,
        patientName: patientRes.data.patientName,
        sex: patientRes.data.sex,
        cardNumber: patientRes.data.cardNumber,
        telephone: patientRes.data.telephone,
        illnessCase: patientRes.data.illnessCase,
        addTime: patientRes.data.addTime,
      })

      var doctorUrl = config.basePath + "api/doctor/listAll" 
      utils.sendRequest(doctorUrl, null, function (res) {
        wx.stopPullDownRefresh()
        self.setData({
          doctors: res.data,
        })
        for (var i = 0; i < self.data.doctors.length; i++) {
          if (patientRes.data.doctorObj.doctorNumber == self.data.doctors[i].doctorNumber) {
            self.setData({
              doctorObj_Index: i,
            });
            break;
          }
        }
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

