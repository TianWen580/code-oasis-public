'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	const userID = event.id
	const lessonInfo = event.lessonInfo
	const curTime = new Date().getTime()
	const submitTime = new Date(curTime).toISOString()
	const reviewState = false

	const input = {
		"submitTime": submitTime,
		"lessonInfo": lessonInfo,
		"reviewState": reviewState
	}
	//添加到数据库userSubmitLessons表
	const res = await db.collection('userSubmitLessons').add({
		userID: input
	})

	//返回数据给客户端
	return res
};
