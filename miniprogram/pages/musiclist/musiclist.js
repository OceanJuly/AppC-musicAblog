// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        playlistId: options.playlistId,
        $url: "musiclist"
      }
    }).then((res) => {
      this.setData({
        musiclist: res.result.playlist.tracks,
        listInfo: {
          coverImgUrl: res.result.playlist.coverImgUrl,
          name: res.result.playlist.name
        }
      })
      this._setMusiclist()
      wx.hideLoading()
    })
  },
  _setMusiclist () {
    wx.setStorageSync('musiclist', this.data.musiclist)
  }
})