var utils = require("../../utils/common.js")
var config = require("../../utils/config.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    leaveWordId: 0, //留言id
    leaveTitle: "", //留言标题
    leaveContent: "", //留言内容
    userObj: "", //留言人
    leaveTime: "", //留言时间
    replyContent: "", //管理回复
    replyTime: "", //回复时间
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    var self = this
    var leaveWordId = params.leaveWordId
    var url = config.basePath + "api/leaveword/get/" + leaveWordId
    utils.sendRequest(url, {}, function (leavewordRes) {
      wx.stopPullDownRefresh()
      self.setData({
        leaveWordId: leavewordRes.data.leaveWordId,
        leaveTitle: leavewordRes.data.leaveTitle,
        leaveContent: leavewordRes.data.leaveContent,
        userObj: leavewordRes.data.userObj.name,
        leaveTime: leavewordRes.data.leaveTime,
        replyContent: leavewordRes.data.replyContent,
        replyTime: leavewordRes.data.replyTime,
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

