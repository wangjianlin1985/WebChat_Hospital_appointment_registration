var utils = require("../../utils/common.js");
var config = require("../../utils/config.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    leaveWordId: 0, //留言id
    leaveTitle: "", //留言标题
    leaveContent: "", //留言内容
    userObj_Index: "0", //留言人
    userInfos: [],
    leaveTime: "", //留言时间
    replyContent: "", //管理回复
    replyTime: "", //回复时间
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  //初始化下拉框的信息
  init_select_params: function () { 
    var self = this;
    var url = null;
    url = config.basePath + "api/userInfo/listAll";
    utils.sendRequest(url, null, function (res) {
      wx.stopPullDownRefresh();
      self.setData({
        userInfos: res.data,
      });
    });
  },
  //留言人改变事件
  bind_userObj_change: function (e) {
    this.setData({
      userObj_Index: e.detail.value
    })
  },

  //选择留言时间
  bind_leaveTime_change: function (e) {
    this.setData({
      leaveTime: e.detail.value
    })
  },
  //清空留言时间
  clear_leaveTime: function (e) {
    this.setData({
      leaveTime: "",
    });
  },

  //选择回复时间
  bind_replyTime_change: function (e) {
    this.setData({
      replyTime: e.detail.value
    })
  },
  //清空回复时间
  clear_replyTime: function (e) {
    this.setData({
      replyTime: "",
    });
  },

  /*提交添加留言到服务器 */
  formSubmit: function (e) {
    var self = this;
    var formData = e.detail.value;
    var url = config.basePath + "api/leaveword/add";
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 500
      })

      //提交成功后重置表单数据
      self.setData({
        leaveWordId: 0,
    leaveTitle: "",
    leaveContent: "",
        userObj_Index: "0",
    leaveTime: "",
    replyContent: "",
    replyTime: "",
        loadingHide: true,
        loadingText: "网络操作中。。",
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init_select_params();
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

