'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	//从服务器获取最新课程市场信息
	let res = await db.collection('lessons').get()

	//返回数据给客户端
	return res
};
