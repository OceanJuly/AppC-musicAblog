// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const rp = require('request-promise')
const db = cloud.database()

const playlistUrl = 'http://musicapi.xiecheng.live/personalized'
// 获取数据库的playlist
const playlistCollection = db.collection('playlist')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // 一般只能获取 MAX_LIMIT 条数据
  // const list = await playlistCollection.get()
  // 解决办法
  const countResult = await playlistCollection.count()
  const total = countResult.total
  const batchTime = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTime; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  const playlist = await rp(playlistUrl).then((res) => {
    return JSON.parse(res).result
  })

  const newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.length; j < len2; j++) {
      if (playlist[i]._id === list.data[j]._id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }

  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log('insert success')
    }).catch((err) => {
      console.log('insert false')
    })
  }

  return newData.length
}