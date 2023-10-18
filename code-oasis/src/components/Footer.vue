<template>
	<view class="Footer">
		<transition name="slide-fade">
            <view v-if="showNotification" class="notification">
                <span class="notificationIcon">◉</span> {{ this.notificationContent }}
            </view>
        </transition>
		<button
			class="facultyBtn"
			@click="showLearnPanel"
			:disabled="!isAblePanel"
			>探 险
		</button>
		<button
			class="facultyBtn labBtn"
			@click="showReviewPanel"
			:disabled="!isAblePanel"
			>桑 拿 室
		</button>
		<LearnPanel ref="learnPanel"
			:isLearnPanelShow="isLearnPanelShow"
			@update:isLearnPanelShow="updateIsLearnPanelShow"
			>
		</LearnPanel>
	</view>
</template>


<script>
	import LearnPanel from '@/components/LearnPanel.vue'
	import axios from 'axios';

	export default {
		name:"Footer",
		components: {
			LearnPanel,
		},
		data() {
			return {
				showNotification: false,
                notificationContent: "",
				isLearnPanelShow: false,
				isResetAble: false,
			};
		},
		methods: {
			showLearnPanel() {
				if (this.$store.state.user.info._id === "尚未登录") {
					this.showTempNotification("请先登录");
                } else {
					this.isResetAble = true;
					this.isLearnPanelShow = true;

					if (this.$store.state.user.info.preference.isOutline === true && this.$store.state.user.info.isPro === true) {
						// 准备课程大纲
						const data = [
							this.$store.state.user.info.selectedSectionInfo[0],
							this.$store.state.user.info.selectedSectionInfo[1][0],
						];
						axios({
							url: "https://dingo-endless-ghoul.ngrok-free.app/api/prepareOutline",
							method: 'post',
							data: {
								prompt: data,
							},
						})
						.then((response) => {
							if (response.data.data.trim() === "") {
								this.$refs.learnPanel.setOutline("大纲生成出错：" + response.data.message);
							} else {
								this.$refs.learnPanel.setOutline(response.data.data);
							}
						})
						.catch((error) => {
							console.log('request fail', error);
							this.$refs.learnPanel.setOutline("大纲生成出错：" + error.message);
						})
					} else {
						this.$refs.learnPanel.skipOutlinePrepare();
						this.$refs.learnPanel.setOutline("教学大纲未开启");
					}
				}
			},
			showReviewPanel() {
				if (this.$store.state.user.info._id === "尚未登录") {
					this.showTempNotification("请先登录");
				} else {
					this.showTempNotification("桑拿室暂未开放");
				}
			},
			resetPanel() {
				this.$refs.learnPanel.resetState();
			},
			resetService() {
				this.$refs.learnPanel.resetState();
				this.isResetAble = false;
				this.showTempNotification("剧情已重置");
			},
			updateIsLearnPanelShow(newValue) {
				this.isLearnPanelShow = newValue;
			},
			showTempNotification(content) {
                this.notificationContent = content;
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            },
		},
		props: {
			isAblePanel: {
				type: Boolean,
				default: true
			},
			isResetBtnShow: {
				type: Boolean,
				default: false
			},
		},
		watch: {
			'$store.state.user.info.selectedLessonIndex'(newVal, oldVal) {
				this.$emit('update:isAblePanel', false);
				this.$emit('update:isResetBtnShow', false);
			}
		}
	}
</script>

<style scoped lang="less">
	.Footer {
		display: flex;
		justify-content: center;
		width: 100%;
		z-index: 1;
	}
	
	.selectLessonBtn:hover {
		color: #3F48CC;
		background: #D8DEFF;
		align-items: center;
	}
	
	.facultyBtn {
		width: 45%;
		height: 100px;
      	border: 2px solid #00000054;
		border-radius: 20px 10px 10px 20px;
		background-size: contain;
		background-repeat: no-repeat;
		background: linear-gradient(90deg, rgba(216, 222, 255, 0.784) 0%, rgb(234, 216, 255) 100%);
		color: #3F48CC;
		font-family: Inter;
		font-size: 18px;
		text-shadow: 0px 2px 4px #7d31ff45;
		font-weight: 800;
		margin: 1px;
		cursor: pointer;
		display: flex;            /* Add flex display */
		justify-content: center;  /* Center items horizontally */
		align-items: center;      /* Center items vertically */
		text-align: center;       /* Center text */
		transition: color 0.6s ease, box-shadow 0.3s ease, transform 0.1s ease;
	}
	
	.facultyBtn:hover {
		border: none;
        color: #00000072;
        background: linear-gradient(135deg, #50c79f 0%, #95d155 70%);
	}
	
	.facultyBtn:active {
		box-shadow: 0px 0px 2px 2px #757df4;
	}

	.labBtn {
		border-radius: 10px 20px 20px 10px;
		background: linear-gradient(270deg, rgba(216, 222, 255, 0.784) 0%, rgb(234, 216, 255) 100%);
		background-size: contain;
		background-repeat: no-repeat;
	}
	
	.labBtn:hover {
        background: linear-gradient(135deg, #5f80f4 0%, #3fa7f3 100%);
	}
	
	.labBtn:active {
		box-shadow: 0px 1px 1px 1px #757df4;
	}

	@media (max-width: 1220px) {
        .resetBtn {
			display: none;
		}

		.facultyBtn {
			font-size: medium;
			width: 40%;
		}
    }
</style>