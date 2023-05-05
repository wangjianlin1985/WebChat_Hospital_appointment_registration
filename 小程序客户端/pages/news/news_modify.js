var utils = require("../../utils/common.js")
var config = require("../../utils/config.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newsId: 0, //新闻id
    newsTitle: "", //新闻标题
    newsPhoto: "upload/NoImage.jpg", //新闻图片
    newsPhotoUrl: "",
    newsPhotoList: [],
    newsContent: "", //新闻内容
    newsDate: "", //新闻日期
    newsFrom: "", //新闻来源
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  //选择新闻日期事件
  bind_newsDate_change: function (e) {
    this.setData({
      newsDate: e.detail.value
    })
  },
  //清空新闻日期事件
  clear_newsDate: function (e) {
    this.setData({
      newsDate: "",
    });
  },

  //选择新闻图片上传
  select_newsPhoto: function (e) {
    var self = this
    wx.chooseImage({
      count: 1,   //可以上传一张图片
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        self.setData({
          newsPhotoList: tempFilePaths,
          loadingHide: false, 
        });

        utils.sendUploadImage(config.basePath + "upload/image", tempFilePaths[0], function (res) {
          wx.stopPullDownRefresh()
          setTimeout(function () {
            self.setData({
              newsPhoto: res.data,
              loadingHide: true
            })
          }, 200)
        })
      }
    })
  },

  //提交服务器修改新闻信息信息
  formSubmit: function (e) {
    var self = this
    var formData = e.detail.value
    var url = config.basePath + "api/news/update"
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 500
      })

      //服务器修改成功返回列表页更新显示为最新的数据
      var pages = getCurrentPages()
      var newslist_page = pages[pages.length - 2];
      var newss = newslist_page.data.newss
      for(var i=0;i<newss.length;i++) {
        if(newss[i].newsId == res.data.newsId) {
          newss[i] = res.data
          break
        }
      }
      newslist_page.setData({newss:newss})
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
    var newsId = params.newsId
    var url = config.basePath + "api/news/get/" + newsId
    utils.sendRequest(url, {}, function (newsRes) {
      wx.stopPullDownRefresh()
      self.setData({
        newsId: newsRes.data.newsId,
        newsTitle: newsRes.data.newsTitle,
        newsPhoto: newsRes.data.newsPhoto,
        newsPhotoUrl: newsRes.data.newsPhotoUrl,
        newsContent: newsRes.data.newsContent,
        newsDate: newsRes.data.newsDate,
        newsFrom: newsRes.data.newsFrom,
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

