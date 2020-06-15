let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String
  },

  observers: {
    lyric (lrc) {
      if (lrc == '暂无歌词') {
        this.setData({
          lyricList: {
            lineLyric: lrc,
            time: 0
          },
          nowLyricIndex: -1
        })
      } else {
        this._parseLyric(lrc)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lyricList: [],
    nowLyricIndex: -1,
    scrollTop: 0
  },

  lifetimes: {
    // rpx 把屏幕宽度分为750份
    ready () {
      wx.getSystemInfo({
        success (res) {
          lyricHeight = res.screenWidth / 750 * 64
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update (currentTime) {
      let lyric = this.data.lyricList
      if (lyric.length == 0) {
        return
      }
      if (currentTime > lyric[lyric.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lyric.length * lyricHeight
          })
        }
      }
      for (let i = 0, len = lyric.length; i < len; i++) {
        if (currentTime <= lyric[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    _parseLyric (lrc) {
      let line = lrc.split('\n')
      let _lyricList = []
      line.forEach((ele) => {
        let time = ele.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lineLyric = ele.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let time2Second = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lyricList.push({
            lineLyric,
            time: time2Second,
          })
        }
      })
      this.setData({
        lyricList: _lyricList
      })
    }
  }
})
