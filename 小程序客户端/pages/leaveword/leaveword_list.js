var utils = require("../../utils/common.js");
var config = require("../../utils/config.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    queryViewHidden: true, //是否隐藏查询条件界面
    leaveTitle: "", //留言标题查询关键字
    userObj_Index:"0", //留言人查询条件
    userInfos: [{"user_name":"","name":"不限制"}],
    leaveTime: "", //留言时间查询关键字
    leavewords: [], //界面显示的留言列表数据
    page_size: 8, //每页显示几条数据
    page: 1,  //当前要显示第几页
    totalPage: null, //总的页码数
    loading_hide: true, //是否隐藏加载动画
    nodata_hide: true, //是否隐藏没有数据记录提示
  },

  // 加载留言列表
  listLeaveword: function () {
    var self = this
    var url = config.basePath + "api/leaveword/list"
    //如果要显示的页码超过总页码不操作
    if(self.data.totalPage != null && self.data.page > self.data.totalPage) return
    self.setData({
      loading_hide: false,  //显示加载动画
    })
    //提交查询参数到服务器查询数据列表
    utils.sendRequest(url, {
      "leaveTitle": self.data.leaveTitle,
      "userObj.user_name": self.data.userInfos[self.data.userObj_Index].user_name,
      "leaveTime": self.data.leaveTime,
      "page": self.data.page,
      "rows": self.data.page_size,
    }, function (res) { 
      wx.stopPullDownRefresh()
      setTimeout(function () {  
        self.setData({
          leavewords: self.data.leavewords.concat(res.data.list),
          totalPage: res.data.totalPage,
          loading_hide: true
        })
      }, 500)
      //如果当前显示的是最后一页，则显示没数据提示
      if(self.data.page == self.data.totalPage) {
        self.setData({
          nodata_hide: false,
        })
      }
    })
  },

  //显示或隐藏查询视图切换
  toggleQueryViewHide: function () {
    this.setData({
      queryViewHidden: !this.data.queryViewHidden,
    })
  },

  //点击查询按钮的事件
  queryLeaveword: function(e) {
    var self = this
    self.setData({
      page: 1,
      totalPage: null,
      leavewords: [],
      loading_hide: true, //隐藏加载动画
      nodata_hide: true, //隐藏没有数据记录提示 
      queryViewHidden: true, //隐藏查询视图
    })
    self.listLeaveword()
  },

  //查询参数留言时间选择事件
  bind_leaveTime_change: function (e) {
    this.setData({
      leaveTime: e.detail.value
    })
  },
  //清空查询参数留言时间
  clear_leaveTime: function (e) {
    this.setData({
      leaveTime: "",
    })
  },

  //绑定查询参数输入事件
  searchValueInput: function (e) {
    var id = e.target.dataset.id
    if (id == "leaveTitle") {
      this.setData({
        "leaveTitle": e.detail.value,
      })
    }

  },

  //查询参数留言人选择事件
  bind_userObj_change: function(e) {
    this.setData({
      userObj_Index: e.detail.value
    })
  },

  init_query_params: function() { 
    var self = this
    var url = null
    //初始化留言人下拉框
    url = config.basePath + "api/userInfo/listAll"
    utils.sendRequest(url,null,function(res){
      wx.stopPullDownRefresh();
      self.setData({
        userInfos: self.data.userInfos.concat(res.data),
      })
    })
  },

  //删除留言记录
  removeLeaveword: function (e) {
    var self = this
    var leaveWordId = e.currentTarget.dataset.leavewordid
    wx.showModal({
      title: '提示',
      content: '确定要删除leaveWordId=' + leaveWordId + '的记录吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var url = config.basePath + "api/leaveword/delete/" + leaveWordId
          utils.sendRequest(url, null, function (res) {
            wx.stopPullDownRefresh();
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 500
            })
            //删除留言后客户端同步删除数据
            var leavewords = self.data.leavewords;
            for (var i = 0; i < leavewords.length; i++) {
              if (leavewords[i].leaveWordId == leaveWordId) {
                leavewords.splice(i, 1)
                break
              }
            }
            self.setData({ leavewords: leavewords })
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listLeaveword()
    this.init_query_params()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var self = this
    self.setData({
      page: 1,  //显示最新的第1页结果
      leavewords: [], //清空留言数据
      nodata_hide: true, //隐藏没数据提示
    })
    self.listLeaveword()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this
    if (self.data.page < self.data.totalPage) {
      self.setData({
        page: self.data.page + 1, 
      })
      self.listLeaveword()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})

