'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	//把数据更新到数据库
	const res = await db.collection('uni-id-users').doc(event.id).update({
		isPro: event.isPro,
		lastProTime: event.lastProTime,
		lastLoginTime: event.lastLoginTime,
	})

	//返回数据给客户端
	return res
};
