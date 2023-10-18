//约定通用键名
const INFO_KEY = 'code_oasis_user_info'

export const getInfo = () => {
    const defaultInfo = {
        _id: '尚未登录',
        stackedLessons: {},
        selectedLesson: {},
        selectedLessonEarnedMarksCount: 0,
        selectedLessonTotalMarksCount: 0,
        selectedLessonIndex: "",
        selectedSectionInfo: ["", ["还没决定哦", "", ""]],
        mobile: '',
        registTime: '',
        lastLoginTime: '',
        lastCheckinYMD: ['', '', ''],
        consistentCheckInDays: 0,
        isPro: false,
        lastProTime: null,
        level: 0,
        avator: null,
        isNameValidated: false,
        realAge: null,
        realName: null,
        isMobileValidated: false,
        preference: {},
    }
    const result = localStorage.getItem(INFO_KEY)
    return result ? JSON.parse(result) : defaultInfo
}
export const setInfo = (obj) => {
    localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}
export const removeInfo = () => {
    localStorage.removeItem(INFO_KEY)
}