import { getInfo, setInfo, removeInfo } from '@/utils/storage'
import axios from 'axios'

export default {
    namespaced: true,
    state () {
        return {
            info: getInfo()
        }
    },
    mutations: {
        setUserInfo (state, obj) {
            state.info._id = obj._id
            state.info.stackedLessons = obj.defaultStackedLessons
            state.info.mobile = obj.mobile
            state.info.registTime = obj.registTime
            state.info.lastCheckinYMD = obj.lastCheckinYMD
            state.info.consistentCheckInDays = obj.consistentCheckInDays
            const registTime = new Date().getTime();
            const timeString = new Date(registTime).toISOString()
            state.info.lastLoginTime = timeString
            state.info.isPro = obj.isPro
            state.info.lastProTime = obj.lastProTime
            state.info.level = obj.level
            state.info.avator = obj.avator
            state.info.isNameValidated = obj.isNameValidated
            state.info.realAge = obj.realAge
            state.info.realName = obj.realName
            state.info.isMobileValidated = obj.isMobileValidated
            state.info.preference = obj.preference
            setInfo(state.info)
        },
        addToStackedLessons (state, obj) {
            const index = obj.index
            const modifiedLesson = obj.lesson
            state.info.stackedLessons[index] = modifiedLesson
            if (state.info._id !== '尚未登录') {
                setInfo(state.info)
                uniCloud.callFunction({
                    name: "updateUserInfo",
                    data: {
                        id: state.info._id,
                        stackedLessons: state.info.stackedLessons,
                    },
                }).then(res => {
                    console.log(res)
                })
            }
        },
        refreshMarksCount (state) {
            for (var i = 0; i < state.info.selectedLesson.contentTitles.length; i++) {
                state.info.selectedLessonTotalMarksCount += state.info.selectedLesson.contentTitles[i][2];
                state.info.selectedLessonEarnedMarksCount += state.info.selectedLesson.contentTitles[i][1];
            }
            state.info.selectedLesson.progress = Math.round(state.info.selectedLessonEarnedMarksCount / state.info.selectedLessonTotalMarksCount * 100) + ' %'
            state.info.stackedLessons[state.info.selectedLessonIndex] = state.info.selectedLesson
        },
        setSelectedLesson (state, obj) {
            const index = obj.index
            const lesson = obj.lesson
            state.info.selectedLesson = lesson
            state.info.selectedLessonIndex = index
            this.commit('user/refreshMarksCount')
            if (state.info._id !== '尚未登录') {
                setInfo(state.info)
            }
        },
        deleteFromStackedLessons (state, index) {
            delete state.info.stackedLessons[index]
            if (state.info._id !== '尚未登录') {
                setInfo(state.info)
            }
        },
        refreshMarks(state, marks) {
            for (var i = 0; i < state.info.stackedLessons[state.info.selectedLessonIndex].contentTitles.length; i++) {
                if (state.info.stackedLessons[state.info.selectedLessonIndex].contentTitles[i][0] === state.info.selectedSectionInfo[1][0]) {
                    state.info.stackedLessons[state.info.selectedLessonIndex].contentTitles[i][1] = marks;
                    break;
                }
            }
            this.commit('user/refreshMarksCount')
            state.info.selectedLesson = state.info.stackedLessons[state.info.selectedLessonIndex]
            if (state.info._id !== '尚未登录') {
                setInfo(state.info)
                uniCloud.callFunction({
                    name: "updateUserInfo",
                    data: {
                        id: state.info._id,
                        stackedLessons: state.info.stackedLessons,
                    },
                }).then(res => {
                    console.log(res)
                })
            }
        },
        cleanUserInfo (state) {
            removeInfo()
            state.info = getInfo()
        },
        showAllStackedLessons (state) {
            uniCloud.callFunction({
                name: "getUserInfo",
                data: {
                    stuID: state.info._id,
                },
            }).then(res => {
                if (res.result.code === 200) {
                    state.info.stackedLessons = res.result.data.data[0].defaultStackedLessons
                    if (state.info._id !== '尚未登录') {
                        setInfo(state.info)
                    }
                }
            })
        },
        resetSelectedSectionInfo (state) {
            state.info.selectedSectionInfo = ["", ["还没决定哦", "", ""]]
        },
        refeshLastLoginTime (state) {
            const nowTime = new Date().getTime();
			const timeString = new Date(nowTime).toISOString();
            const lastLoginTime = timeString
            state.info.lastLoginTime = lastLoginTime
            if (state.info._id !== '尚未登录') {
                setInfo(state.info)
                uniCloud.callFunction({
                    name: "updateUserOtherInfo",
                    data: {
                        id: state.info._id,
                        isPro: state.info.isPro,
                        lastProTime: state.info.lastProTime,
                        lastLoginTime: lastLoginTime,
                    },
                }).then(res => {
                    console.log(res)
                })
            }
        },
        setIsPro(state) {
            state.info.isPro = true
            const registTime = new Date().getTime();
            const timeString = new Date(registTime).toISOString();
            const lastProTime = timeString.slice(0, 10);
            state.info.lastProTime = lastProTime
            if (state.info._id !== '尚未登录') {
                setInfo(state.info)
                uniCloud.callFunction({
                    name: "updateUserOtherInfo",
                    data: {
                        id: state.info._id,
                        isPro: state.info.isPro,
                        lastProTime: lastProTime,
                        lastLoginTime: state.info.lastLoginTime,
                    },
                }).then(res => {
                    console.log(res)
                })
            }
        },
        checkProStatus(state) {
            uniCloud.callFunction({
                name: "getUserInfo",
                data: {
                    stuID: state.info._id,
                },
            }).then(res => {
                if (res.result.code === 200) {
                    if (state.info._id !== '尚未登录') {
                        const lastProTimeYMD = res.result.data.data[0].lastProTime.split('-');
                        const lastProTime = new Date(lastProTimeYMD[0], lastProTimeYMD[1] - 1, lastProTimeYMD[2]).getTime();
				        const nowTime = new Date().getTime();
                        const nowTimeString = new Date(nowTime).toISOString().slice(0, 10);
                        const nowYMD = nowTimeString.split('-');
                        const nowDate = new Date(Number(nowYMD[0]), Number(nowYMD[1]) - 1, Number(nowYMD[2]));
                        const diffTime = Math.abs(nowDate - lastProTime);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays > 2) {
                            state.info.isPro = false

                            setInfo(state.info)
                            uniCloud.callFunction({
                                name: "updateUserOtherInfo",
                                data: {
                                    id: state.info._id,
                                    isPro: state.info.isPro,
                                    lastProTime: state.info.lastProTime,
                                    lastLoginTime: nowTimeString,
                                },
                            }).then(res => {
                                console.log(res)
                            })
                        }
                    }
                }
            })
        },
        async setUserApiAddress(state, data) {
            let apiQuota = 0
            await axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/apiQuota', {
                apiAddress: data.apiAddress.slice(0, -4) + '.txt'
            })
            .then(res => {
                apiQuota = res.data.data
            })
            .catch(err => {
                console.log(err)
            })

            state.info.preference = {
                apiAddress: data.apiAddress,
                isGPT4: data.isGPT4,
                isActivate: true,
                isAudio: data.isAudio,
                isOutline: data.isOutline,
                apiQuota: apiQuota
            }

            if (state.info._id !== '尚未登录') {
                setInfo(state.info)
                uniCloud.callFunction({
                    name: "updateUserPreference",
                    data: {
                        id: state.info._id,
                        preference: state.info.preference,
                    },
                }).then(res => {
                    console.log(res)
                })
            }
        },
        setUserPreference(state, data) {
            state.info.preference = {
                apiAddress: state.info.preference.apiAddress,
                isGPT4: data.isGPT4,
                isActivate: state.info.preference.isActivate,
                isAudio: data.isAudio,
                isOutline: data.isOutline,
                llmType: data.llmType,
                apiQuota: state.info.preference.apiQuota
            }

            if (state.info._id !== '尚未登录') {
                setInfo(state.info)
                uniCloud.callFunction({
                    name: "updateUserPreference",
                    data: {
                        id: state.info._id,
                        preference: state.info.preference,
                    },
                }).then(res => {
                    console.log(res)
                })
            }
        }
    },
    actions: {},
    getters: {}
}