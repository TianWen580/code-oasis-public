export default {
    namespaced: true,
    state () {
        return {
            views: {}
        }
    },
    mutations: {
        toggleGridView (state, index) {
            state.views[index].showGridView = !state.views[index].showGridView
        },
        addNewLesson(state, obj) {
            const newLessonName = obj.name
            const newLesson = obj.lesson
            const userID = obj.userID
            state.views.园游会.items[newLessonName] = newLesson
            //提交给开发者
            uniCloud.callFunction({
                name: 'sendDeveloperNewLessonInfo',
                data: {
                    id: userID,
                    lessonInfo: state.views.园游会.items[newLessonName]
                }
            }).then(res => {
                console.log(res)
            })
        },
        refreshLessonViews(state) {
            uniCloud.callFunction({
                name: 'getLessonInfo',
                data: {},
                success: (res) => {
                    const lessons = res.result.data[0];
                    const { _id, ...filteredLessons } = lessons;
                    state.views = filteredLessons;
                }
            })
        },
    },
    actions: {},
    getters: {}
}