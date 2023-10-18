'use strict';

const crypto = require('crypto');
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	const registTime = new Date().getTime();
	const timeString = new Date(registTime).toISOString();
	const lastCheckinYMD = timeString.slice(0, 10);
	const consistentCheckinDays = 1;
	const defaultStackedLessons = {};
	const lastLoginTime = timeString;

	//手机号和密码不能为空
	if (!event.mobile || !event.password) {
		return {
			code: 10000,
			msg: '手机号或密码不能为空'
		}
	}

	//进行密码哈希加密
	const hashedPassword = crypto.createHash('sha256').update(event.password).digest('hex');

	//当手机号存在，并判断手机号或密码错误
	let resFindStu = await db.collection('uni-id-users').where({
		mobile: event.mobile
	}).get()

	if (resFindStu.data.length > 0) {
		if (resFindStu.data[0].password !== hashedPassword) {
			return {
				code: 10001,
				msg: '用户名或密码错误'
			}
		} else {
			return {
				code: 200,
				msg: '登录成功',
				data: resFindStu
			}
		}
	}

	//检查手机号是否合法
	if (!/^1[3456789]\d{9}$/.test(event.mobile)) {
		return {
			code: 10002,
			msg: '手机号不合法'
		}
	}

	//密码是否有特殊字符
	if (/[^a-zA-Z0-9]/.test(event.password)) {
		return {
			code: 10005,
			msg: '密码不能包含特殊字符'
		}
	}

	//检查密码是否过长
	if (event.password.length > 20) {
		return {
			code: 10003,
			msg: '密码过长'
		}
	}

	// 检查密码是否包含至少一个字母和一个数字，并且长度不小于9
	if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{9,}$/.test(event.password)) {
		return {
			code: 10004,
			msg: '密码过于短或简单，必须采用字母数字'
		};
	}

	//新增用户
	let resNewStu = await db.collection('uni-id-users').add({
		mobile: event.mobile,
		password: hashedPassword,
		registTime: lastCheckinYMD,
		lastCheckinYMD: lastCheckinYMD,
		consistentCheckinDays: consistentCheckinDays,
		defaultStackedLessons: defaultStackedLessons,
		lastLoginTime: lastLoginTime,
		isPro: false,
		lastProTime: null,
		level: 0,
		avator: null,
		isNameValidated: false,
		realAge: null,
		realName: null,
		isMobileValidated: false,
		preference: {
			apiAddress: 'api.zhtec.xyz/xht/chatWith16k.php'
		},
	})
	return resNewStu
};
