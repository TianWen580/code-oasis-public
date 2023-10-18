'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	let stuID = event.stuID;

	//检查stuID是否存在
	if (!stuID) {
		return {
			code: 10000,
			msg: 'stuID不能为空'
		}
	}

	//获取stuID对应的用户信息
	let resFindStu = await db.collection('uni-id-users').where({
		_id: stuID
	}).get()

	if (resFindStu.data.length > 0) {
		return {
			code: 200,
			msg: '获取用户信息成功',
			data: resFindStu
		}
	} else {
		return {
			code: 10001,
			msg: '获取用户信息失败'
		}
	}
};
