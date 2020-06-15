let userInfo = {}
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  externalClasses: ['iconfont',  'icon-pinglun','icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    modalShow: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      if (app.getIslogin()) {

      } else {
        this.setData({
          loginShow: true
        })
      }
    },
    onLoginsuccess () {
      this.setData({
        loginShow: false
      })
    },
    onLoginfail () {

    }
  }
})
