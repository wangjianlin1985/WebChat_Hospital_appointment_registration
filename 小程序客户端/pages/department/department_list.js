var utils = require("../../utils/common.js");
var config = require("../../utils/config.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    queryViewHidden: true, //是否隐藏查询条件界面
    departmentName: "", //科室名称查询关键字
    birthDate: "", //成立日期查询关键字
    departments: [], //界面显示的科室信息列表数据
    page_size: 8, //每页显示几条数据
    page: 1,  //当前要显示第几页
    totalPage: null, //总的页码数
    loading_hide: true, //是否隐藏加载动画
    nodata_hide: true, //是否隐藏没有数据记录提示
  },

  // 加载科室信息列表
  listDepartment: function () {
    var self = this
    var url = config.basePath + "api/department/list"
    //如果要显示的页码超过总页码不操作
    if(self.data.totalPage != null && self.data.page > self.data.totalPage) return
    self.setData({
      loading_hide: false,  //显示加载动画
    })
    //提交查询参数到服务器查询数据列表
    utils.sendRequest(url, {
      "departmentName": self.data.departmentName,
      "birthDate": self.data.birthDate,
      "page": self.data.page,
      "rows": self.data.page_size,
    }, function (res) { 
      wx.stopPullDownRefresh()
      setTimeout(function () {  
        self.setData({
          departments: self.data.departments.concat(res.data.list),
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
  queryDepartment: function(e) {
    var self = this
    self.setData({
      page: 1,
      totalPage: null,
      departments: [],
      loading_hide: true, //隐藏加载动画
      nodata_hide: true, //隐藏没有数据记录提示 
      queryViewHidden: true, //隐藏查询视图
    })
    self.listDepartment()
  },

  //查询参数成立日期选择事件
  bind_birthDate_change: function (e) {
    this.setData({
      birthDate: e.detail.value
    })
  },
  //清空查询参数成立日期
  clear_birthDate: function (e) {
    this.setData({
      birthDate: "",
    })
  },

  //绑定查询参数输入事件
  searchValueInput: function (e) {
    var id = e.target.dataset.id
    if (id == "departmentName") {
      this.setData({
        "departmentName": e.detail.value,
      })
    }

  },

  init_query_params: function() { 
    var self = this
    var url = null
  },

  //删除科室信息记录
  removeDepartment: function (e) {
    var self = this
    var departmentId = e.currentTarget.dataset.departmentid
    wx.showModal({
      title: '提示',
      content: '确定要删除departmentId=' + departmentId + '的记录吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var url = config.basePath + "api/department/delete/" + departmentId
          utils.sendRequest(url, null, function (res) {
            wx.stopPullDownRefresh();
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 500
            })
            //删除科室信息后客户端同步删除数据
            var departments = self.data.departments;
            for (var i = 0; i < departments.length; i++) {
              if (departments[i].departmentId == departmentId) {
                departments.splice(i, 1)
                break
              }
            }
            self.setData({ departments: departments })
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
    this.listDepartment()
    this.init_query_params()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var self = this
    self.setData({
      page: 1,  //显示最新的第1页结果
      departments: [], //清空科室信息数据
      nodata_hide: true, //隐藏没数据提示
    })
    self.listDepartment()
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
      self.listDepartment()
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

