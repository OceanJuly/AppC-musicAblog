// 最多输入的字数
let MAX_WORDS_NUM = 140
// 添加的最多图片数
let MAX_IMG_NUM = 9

const db = wx.cloud.database()
let userInfo = {}
let content = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true
  },

  onPreviewImg (ev) {
    wx.previewImage({
      urls: this.data.images,
      current: ev.target.dataset.imgsrc
    })
  },

  onDelImage (ev) {
    this.data.images.splice(ev.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == 8) {
      this.setData({
        selectPhoto: true
      })
    }
  },

  onChooseImage () {
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      complete: (res) => {
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          images: res.tempFilePaths,
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },

  onInput (ev) {
    const len = ev.detail.value.length
    if (len >= MAX_WORDS_NUM) {
      this.setData({
        wordsNum: '字数不能超过140'
      })
    } else {
      this.setData({
        wordsNum: len
      })
      content = ev.detail.value
    }
  },

  onFucus (ev) {
    this.setData({
      footerBottom: ev.detail.height
    })
  },
  
  onblur () {
    this.setData({
      footerBottom: 0
    })
  },

  send () {
    // 2、数据 -> 云数据库
    // 数据库：内容、图片fileID、openid、昵称、头像、时间
    // 1、图片 -> 云存储 fileID 云文件ID

    if (content.trim() === '') {
      wx.showModal({
        title: '文字不能为空!',
        content: ''
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true
    })

    let promiseArr = []
    let fileIds = []
    // 图片上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        // 文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate()
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功!',
        })
        wx.navigateBack()
        // 刷新页面
        const page = getCurrentPages()
        // 取到上一个页面
        const prePage = page[page.length - 2]
        prePage.onPullDownRefresh()
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败!',
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})