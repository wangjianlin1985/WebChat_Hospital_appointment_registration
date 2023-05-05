var utils = require("../../utils/common.js")
var config = require("../../utils/config.js")

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
    doctorPhotoUrl: "",
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

  //选择出生日期事件
  bind_birthDate_change: function (e) {
    this.setData({
      birthDate: e.detail.value
    })
  },
  //清空出生日期事件
  clear_birthDate: function (e) {
    this.setData({
      birthDate: "",
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
          loadingHide: false, 
        });

        utils.sendUploadImage(config.basePath + "upload/image", tempFilePaths[0], function (res) {
          wx.stopPullDownRefresh()
          setTimeout(function () {
            self.setData({
              doctorPhoto: res.data,
              loadingHide: true
            })
          }, 200)
        })
      }
    })
  },

  //所在科室修改事件
  bind_departmentObj_change: function (e) {
    this.setData({
      departmentObj_Index: e.detail.value
    })
  },

  //提交服务器修改医生信息信息
  formSubmit: function (e) {
    var self = this
    var formData = e.detail.value
    var url = config.basePath + "api/doctor/update"
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 500
      })

      //服务器修改成功返回列表页更新显示为最新的数据
      var pages = getCurrentPages()
      var doctorlist_page = pages[pages.length - 2];
      var doctors = doctorlist_page.data.doctors
      for(var i=0;i<doctors.length;i++) {
        if(doctors[i].doctorNumber == res.data.doctorNumber) {
          doctors[i] = res.data
          break
        }
      }
      doctorlist_page.setData({doctors:doctors})
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
    var doctorNumber = params.doctorNumber
    var url = config.basePath + "api/doctor/get/" + doctorNumber
    utils.sendRequest(url, {}, function (doctorRes) {
      wx.stopPullDownRefresh()
      self.setData({
        doctorNumber: doctorRes.data.doctorNumber,
        password: doctorRes.data.password,
        departmentObj_Index: 1,
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

      var departmentUrl = config.basePath + "api/department/listAll" 
      utils.sendRequest(departmentUrl, null, function (res) {
        wx.stopPullDownRefresh()
        self.setData({
          departments: res.data,
        })
        for (var i = 0; i < self.data.departments.length; i++) {
          if (doctorRes.data.departmentObj.departmentId == self.data.departments[i].departmentId) {
            self.setData({
              departmentObj_Index: i,
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

