'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const res = await uniCloud.getPhoneNumber({
		appid: '__UNI__BC035A9',
		provider: 'univerify',
		apiKey: '8f2304cdc05c7ef02b9ec31b54a39503',
		apiSecret: '61b9e98b069a21d0b2d3ca36c7b07b9f',
		access_token: event.access_token,
		openid: event.openid
	});

	console.log(res); // res里的数据格式	{ code: 0, success: true, phoneNumber: '186*****078' }

	// 执行入库等操作，正常情况下不要把完整手机号返回给前端	
	return await db.collection('regUser').add({		
		openid: event.openid, //前端提交过来的数据
		PhoneNumber:res.phoneNumber,
		createTime: Date.now()		
	})
};
