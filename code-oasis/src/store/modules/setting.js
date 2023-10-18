export default {
    namespaced: true,
    state () {
        return {
            defaultLessonRules: [
                '尽量用生活中的例子，举例说明点，便于学生理解；',
                '学生是否有语法错误，比如name=MyName，这里的MyName没有加引号；',
                '学生是否有逻辑错误，比如add_numbers(2, 3)的结果就是5，而不是6；',
                '您可以偶尔通过括号透露自己的情绪，比如（疑惑...）（洋溢着笑容）等等；',
            ],
        }
    },
    mutations: {
    },
    actions: {},
    getters: {}
}