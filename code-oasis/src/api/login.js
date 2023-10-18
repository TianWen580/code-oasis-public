// 1.获取图形验证码
import request from '@/utils/request'

export const getImageCode = () => {
    return request.get('/captcha/image')
}

export const getSmsCode = (captchaCode, captchaKey) => {
    return request.post('/captcha/sendSmsCaptcha', {
        captcha: captchaCode,
        captchaKey: captchaKey,
    })
}