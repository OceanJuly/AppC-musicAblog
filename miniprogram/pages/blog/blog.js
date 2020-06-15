let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modelShow: false,
    blogList: []
  },

  onPublish () {
    // 判断是否授权
    wx.getSetting({
      complete: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            complete: (res) => {
              this.loginsuccess({
                detail: res.userInfo
              })
            },
          })
        } else {
          this.setData({
            modelShow: true
          })
        }
      },
    })
  },

  loginsuccess (event) {
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${event.detail.nickName}&avatarUrl=${event.detail.avatarUrl}`
    })
  },

  loginfail () {
    wx.showModal({
      title: '只有授权后才能发布!'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  _loadBlogList (start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        count: 10,
        $url: 'list'
      }
    }).then((res) => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  goComment (e) {
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId=' + e.target.dataset.blogid,
    })
  },

  onSearch (e) {
    this.setData({
      blogList: []
    })
    keyword = e.detail.keyword
    this._loadBlogList()
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList: []
    })
    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})