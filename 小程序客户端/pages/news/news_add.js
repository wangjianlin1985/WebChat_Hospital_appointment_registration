var utils = require("../../utils/common.js");
var config = require("../../utils/config.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newsId: 0, //新闻id
    newsTitle: "", //新闻标题
    newsPhoto: "upload/NoImage.jpg", //新闻图片
    newsPhotoList: [],
    newsContent: "", //新闻内容
    newsDate: "", //新闻日期
    newsFrom: "", //新闻来源
    loadingHide: true,
    loadingText: "网络操作中。。",
  },

  //选择新闻日期
  bind_newsDate_change: function (e) {
    this.setData({
      newsDate: e.detail.value
    })
  },
  //清空新闻日期
  clear_newsDate: function (e) {
    this.setData({
      newsDate: "",
    });
  },

  /*提交添加新闻信息到服务器 */
  formSubmit: function (e) {
    var self = this;
    var formData = e.detail.value;
    var url = config.basePath + "api/news/add";
    utils.sendRequest(url, formData, function (res) {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 500
      })

      //提交成功后重置表单数据
      self.setData({
        newsId: 0,
    newsTitle: "",
        newsPhoto: "upload/NoImage.jpg",
        newsPhotoList: [],
    newsContent: "",
    newsDate: "",
    newsFrom: "",
        loadingHide: true,
        loadingText: "网络操作中。。",
      })
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
          loadingHide: false
        });
        utils.sendUploadImage(config.basePath + "upload/image", tempFilePaths[0], function (res) {
          wx.stopPullDownRefresh()
          setTimeout(function () {
            self.setData({
              newsPhoto: res.data,
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

