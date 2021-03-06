// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const tcbRouter = require('tcb-router')
const db = cloud.database()
const blogCollection = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({
    event
  })

  app.router('list', async(ctx, next) => {
    let keyword = event.keyword
    let obj = {}
    if (keyword.trim() != '') {
      obj = {
        content: new db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }

    let blogList = await blogCollection
    .where(obj)
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime', 'desc')
    .get()
    .then((res) => {
      return res.data
    })
    ctx.body = blogList
  })

  return app.serve()
}