<template>
	<view class="index">
		<view class="HMFGap">
			<Header
				:lessonName="selectedLessonName"
				:markNum="markNum"
				:curStuID="curStuID"
				@update:curStuID="updateCurStuID"
				>
			</Header>
			<Main
				:lessonName="selectedLessonName"
				:level="level"
				:curStuID="curStuID"
				>
			</Main>
		</view>
	</view>
</template>

<script>
	import Header from '@/components/Header.vue'
	import Main from '@/components/Main.vue'

	export default {
		components: {
			Header,
			Main,
		},
		data() {
			return {
				selectedLessonName: '还没决定哦',
				level: {},
				markNum: null,
				curStuID: "尚未登录",
			};
		},
		methods: {
			updateShowTitle(newShowTitle) {
				this.showTitle = newShowTitle;
			},
			updateCurStuID(newCurStuID) {
				this.curStuID = newCurStuID;
			},
		},
		computed: {
			progressPercentage() {
				return this.level.progress;
			},
		},
		watch: {
			progressPercentage(newProgress) {
				this.markNum = newProgress;
			},
		},
	};
</script>


<style scoped>
	.index {
		padding: 36px;
	}

	@media (max-width: 530px) {
        .index {
            padding: 0px;
        }
    }
</style>