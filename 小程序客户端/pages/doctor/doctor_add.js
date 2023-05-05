var utils = require("../../utils/common.js");
var config = require("../../utils/config.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    doctorNumber: "", //医生工号
    password: "", //登录密码
    departmentObj_Index: "0", //所在科室
    departments: [],
    doctorName: "", //医生姓名
    sex: "", //性别
    doctorPhoto: "upload/NoImage.jpg", //医生照片
    doctorPhotoList: [],
    birthDate: "", //出生日期
    position: "", //医生职位
    experience: "", //工作经验
    contactWay: "", //联系方式
    goodAt: "", //擅长
    doctorDesc: "", //医生介绍
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  //初始化下拉框的信息
  init_select_params: function (options) { 
    var self = this;
    var url = null;
    url = config.basePath + "api/department/listAll";
    utils.sendRequest(url, null, function (res) {
      wx.stopPullDownRefresh();
      self.setData({
        departments: res.data,
      });
    });
  },
  //所在科室改变事件
  bind_departmentObj_change: function (e) {
    this.setData({
      departmentObj_Index: e.detail.value
    })
  },

  //选择出生日期
  bind_birthDate_change: function (e) {
    this.setData({
      birthDate: e.detail.value
    })
  },
  //清空出生日期
  clear_birthDate: function (e) {
    this.setData({
      birthDate: "",
    });
  },

  /*提交添加医生信息到服务器 */
  formSubmit: function (e) {
    var self = this;
    var formData = e.detail.value;
    var url = config.basePath + "api/doctor/add";
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 500
      })

      //提交成功后重置表单数据
      self.setData({
        doctorNumber: "",
    password: "",
        departmentObj_Index: "0",
    doctorName: "",
    sex: "",
        doctorPhoto: "upload/NoImage.jpg",
        doctorPhotoList: [],
    birthDate: "",
    position: "",
    experience: "",
    contactWay: "",
    goodAt: "",
    doctorDesc: "",
        loadingHide: true,
        loadingText: "网络操作中。。",
      })
    });
  },

  //选择医生照片上传
  select_doctorPhoto: function (e) {
    var self = this
    wx.chooseImage({
      count: 1,   //可以上传一张图片
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        self.setData({
          doctorPhotoList: tempFilePaths,
          loadingHide: false
        });
        utils.sendUploadImage(config.basePath + "upload/image", tempFilePaths[0], function (res) {
          wx.stopPullDownRefresh()
          setTimeout(function () {
            self.setData({
              doctorPhoto: res.data,
              loadingHide: true
            });
          }, 200);
        });
      }
    })
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

