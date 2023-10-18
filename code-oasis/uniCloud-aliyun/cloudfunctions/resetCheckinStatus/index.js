'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	const nowTime = new Date().getTime();
	const timeString = new Date(nowTime).toISOString();
	const nowTimeString = event.nowTimeString;
	const consistentCheckinDays = 1;

	const collection = db.collection('uni-id-users')
	const res = await collection.doc(event.stuID).update({
		lastCheckinYMD: nowTimeString,
		consistentCheckinDays: consistentCheckinDays,
		lastLoginTime: timeString,
	})

	//返回数据给客户端
	return nowTimeString
};
