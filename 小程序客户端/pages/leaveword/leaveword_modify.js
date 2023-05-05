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
    userObj_Index: "0", //留言人
    userInfos: [],
    leaveTime: "", //留言时间
    replyContent: "", //管理回复
    replyTime: "", //回复时间
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  //选择留言时间事件
  bind_leaveTime_change: function (e) {
    this.setData({
      leaveTime: e.detail.value
    })
  },
  //清空留言时间事件
  clear_leaveTime: function (e) {
    this.setData({
      leaveTime: "",
    });
  },

  //选择回复时间事件
  bind_replyTime_change: function (e) {
    this.setData({
      replyTime: e.detail.value
    })
  },
  //清空回复时间事件
  clear_replyTime: function (e) {
    this.setData({
      replyTime: "",
    });
  },

  //留言人修改事件
  bind_userObj_change: function (e) {
    this.setData({
      userObj_Index: e.detail.value
    })
  },

  //提交服务器修改留言信息
  formSubmit: function (e) {
    var self = this
    var formData = e.detail.value
    var url = config.basePath + "api/leaveword/update"
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 500
      })

      //服务器修改成功返回列表页更新显示为最新的数据
      var pages = getCurrentPages()
      var leavewordlist_page = pages[pages.length - 2];
      var leavewords = leavewordlist_page.data.leavewords
      for(var i=0;i<leavewords.length;i++) {
        if(leavewords[i].leaveWordId == res.data.leaveWordId) {
          leavewords[i] = res.data
          break
        }
      }
      leavewordlist_page.setData({leavewords:leavewords})
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
    var leaveWordId = params.leaveWordId
    var url = config.basePath + "api/leaveword/get/" + leaveWordId
    utils.sendRequest(url, {}, function (leavewordRes) {
      wx.stopPullDownRefresh()
      self.setData({
        leaveWordId: leavewordRes.data.leaveWordId,
        leaveTitle: leavewordRes.data.leaveTitle,
        leaveContent: leavewordRes.data.leaveContent,
        userObj_Index: 1,
        leaveTime: leavewordRes.data.leaveTime,
        replyContent: leavewordRes.data.replyContent,
        replyTime: leavewordRes.data.replyTime,
      })

      var userInfoUrl = config.basePath + "api/userInfo/listAll" 
      utils.sendRequest(userInfoUrl, null, function (res) {
        wx.stopPullDownRefresh()
        self.setData({
          userInfos: res.data,
        })
        for (var i = 0; i < self.data.userInfos.length; i++) {
          if (leavewordRes.data.userObj.user_name == self.data.userInfos[i].user_name) {
            self.setData({
              userObj_Index: i,
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

