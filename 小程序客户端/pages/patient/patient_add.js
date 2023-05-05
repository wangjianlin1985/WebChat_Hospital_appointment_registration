var utils = require("../../utils/common.js");
var config = require("../../utils/config.js");

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

  //初始化下拉框的信息
  init_select_params: function (options) { 
    var self = this;
    var url = null;
    url = config.basePath + "api/doctor/listAll";
    utils.sendRequest(url, null, function (res) {
      wx.stopPullDownRefresh();
      self.setData({
        doctors: res.data,
      });
    });
  },
  //医生改变事件
  bind_doctorObj_change: function (e) {
    this.setData({
      doctorObj_Index: e.detail.value
    })
  },

  //选择登记时间
  bind_addTime_change: function (e) {
    this.setData({
      addTime: e.detail.value
    })
  },
  //清空登记时间
  clear_addTime: function (e) {
    this.setData({
      addTime: "",
    });
  },

  /*提交添加病人信息到服务器 */
  formSubmit: function (e) {
    var self = this;
    var formData = e.detail.value;
    var url = config.basePath + "api/patient/add";
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 500
      })

      //提交成功后重置表单数据
      self.setData({
        patientId: 0,
        doctorObj_Index: "0",
    patientName: "",
    sex: "",
    cardNumber: "",
    telephone: "",
    illnessCase: "",
    addTime: "",
        loadingHide: true,
        loadingText: "网络操作中。。",
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init_select_params(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('authToken');
    if (!token) {
      wx.navigateTo({
        url: '../mobile/mobile',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})

