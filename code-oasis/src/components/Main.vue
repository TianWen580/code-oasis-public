<template>
	<view class="Main">
		<view class="mainContainer horLayout">
			<view class="leftbar">
				<stuIDCard
					>
				</stuIDCard>
				<LessonMap
					:isPopupVisible.sync="isPopupVisible"
					@update:isPopupVisible="updateIsPopupVisible"
				></LessonMap>
			</view>
			<view class="rightbar">
				<LessonInfoCard
					:rules="rules"
				></LessonInfoCard>
			</view>
		</view>
		<LessonCreator
			v-if="isPopupVisible"
			@close="hidePopup"
			:rules="rules"
		/>
		</view>
  </template>

  <script>
	import stuIDCard from '@/components/stuIDCard.vue';
	import LessonMap from '@/components/LessonMap.vue';
	import LessonInfoCard from '@/components/LessonInfoCard.vue';
	import LessonCreator from './LessonCreator.vue';

	export default {
		components: {
			stuIDCard,
			LessonMap,
			LessonInfoCard,
			LessonCreator,
		},
		data() {
			return {
                isPopupVisible: false,
				rules: [
                    '发言确保{stuAge}岁的人也能够看懂；',
                    '尽量用生活中的例子，举例说明点，便于学生理解；',
                    '学生是否有语法错误，比如name=MyName，这里的MyName没有加引号；',
                    '批改学生答案时，先展示自己的做题过程，再与学生的答案进行对比；',
                    '学生是否有逻辑错误，比如add_numbers(2, 3)的结果就是5，而不是6；',
                    '您给的代码一定要有ToDo注释，解释任务，并引导学生填写；',
                    '可能会遇到调皮的学生，避免被学生引导离开主题；',
                    '不要帮学生做一些与课堂无关的事情，比如帮忙生成文章、闲聊等等；',
                    '不要为学生做与课程无关的事情或者闲聊，不要在课堂上谈论个人生活、家庭、爱好等个人话题；',
                    '{info2} 才是教学重点，{info1} 只是一个引子，要把重点放在 {info2} 上；',
                    '通过提问引导学生，不直接回答他们关于 {info2} 的问题；',
                    '如果学生以任何理由打扰课堂，不要生气，要积极引导他们回到课堂并继续布置练习；',
                    '您可以偶尔通过括号透露自己的情绪，比如（疑惑...）（洋溢着笑容）等等；',
                    '当学生提交作业时，您认可的话，必须在回复的最后面显示（⭐）。',
                ],
			};
		},
		methods: {
			closeLessonCreator() {
				this.isCreatorPanelShow = false;
			},
			hidePopup() {
                this.isPopupVisible = false;
            },
			updateIsPopupVisible(newValue) {
				this.$emit('update:isPopupVisible', newValue);
			},
		},
	};
  </script>
  
  <style scoped lang="less">
	.Main {
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 3px;
	}

	.Main::-webkit-scrollbar {
		width: 0px;
	}

	.mainContainer {
		gap: 16px;
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
	}

	.leftbar {
		width: 400px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	.rightbar {
		width: 60%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	@media (max-width: 1220px) {
		.rightbar {
			width: 60%;
		}

		.mainContainer {
			gap: 0px;
		}
	}

	@media (max-width: 530px) {
		.mainContainer {
			flex-wrap: wrap;
		}

        .leftbar {
            width: 90%;
        }

		.rightbar {
			width: 90%;
		}
    }
  </style>
  