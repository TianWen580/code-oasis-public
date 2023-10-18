<template>
	<view>
	  <view class="LessonInfoCard" @mouseover="showRestBtn" @mouseout="hideResetBtn" :style="{ 'background-image': `url(${this.$store.state.user.info.selectedLesson.tecImage})` }">
		<view class="shadowview"></view>
		<view class="InfoBox">
			<span class="lessonName">探索 | {{ animatedLessonName }}</span>
			<view class="infoRowBox">
				<view v-for="info in this.$store.state.user.info.selectedLesson.info" :key="info.info1" class="infoRow">
					<span>{{ info[0] }}</span>
					<view class="infoDetail vertLayout">
						<span>{{ info[1] }}</span>
						<span class="infoDetail2">{{ info[2] }}</span>
					</view>
				</view>
			</view>
		</view>
		<view class="selectSectionBtn" @click.stop="toggleDropdown" :disabled="!isLessonSelected">
		  	<span>🛋️ 选课：{{ this.$store.state.user.info.selectedSectionInfo[1][0] }}</span>
		</view>
		<transition name="slide-fade">
			<view class="dropdownList" v-if="showDropdown">
				<view v-for="item in this.$store.state.user.info.selectedLesson.contentTitles" :key="item[0]" class="dropdownItem" @click="refreshSelectedSection(item)">
					{{ item[0] }}
					<view class="mark">
						<span v-for="n in Math.min(item[1], item[2])" :key="n">⭐</span>
						<span v-for="n in Math.max(item[2] - item[1], 0)" :key="n">🫥</span>
					</view>
				</view>
			</view>
		</transition>
		<Footer class="Footer"
			:isAblePanel="isAblePanel"
			:isResetBtnShow="isResetBtnShow"
			@update:isResetBtnShow="updateIsResetBtnShow"
			@update:isAblePanel="updateIsAblePanel"
			ref="footer"
			>
		</Footer>
	  </view>
	</view>
  </template>

  <script>
	import Footer from '@/components/Footer.vue';

	export default {
		name: "LessonInfoCard",
		components: {
			Footer,
		},
		data() {
			return {
				showDropdown: false,
				mark: 0,
				isAblePanel: false,
				isLessonSelected: false,
				isResetBtnShow: false,
				animatedLessonName: "还没决定哦",
				typingTimer: null,
			};
		},
		methods: {
			toggleDropdown() {
				this.showDropdown = !this.showDropdown;
			},
			refreshSelectedSection(newSection) {
				this.toggleDropdown();
				this.$store.state.user.info.selectedSectionInfo = [this.$store.state.user.info.selectedLessonIndex, newSection];
				this.isAblePanel = true;
				this.$refs.footer.resetService();
			},
			hideCursor() {
				const lessonNameEl = this.$el.querySelector('.lessonName');
				lessonNameEl.style.borderRightColor = 'transparent';
			},
			showRestBtn() {
				this.isResetBtnShow = true;
			},
			hideResetBtn() {
				this.isResetBtnShow = false;
			},
			updateIsResetBtnShow(newVal) {
				this.isResetBtnShow = newVal;
			},
			updateIsAblePanel(newVal) {
				this.isAblePanel = newVal;
			},
		},
		props: {
			rules: {
				type: Array,
				default: [],
			},
		},
		mounted() {
			this.clickOutsideHandler = (event) => {
				const dropdownList = this.$el.querySelector('.dropdownList');
				if (dropdownList && !dropdownList.contains(event.target)) {
					this.showDropdown = false;
				}
			};
			document.addEventListener('click', this.clickOutsideHandler);
		},
		beforeDestroy() {
			document.removeEventListener('click', this.clickOutsideHandler);
		},
		computed: {
			LessonInfoCardStyle() {
				return { 'background-image': `url(${this.backgroundUrl})` };
			},
		},
		watch: {
			'$store.state.user.info.selectedLessonIndex'(newVal, oldVal) {
				if (newVal !== oldVal) {
					let i = 0;
					this.animatedLessonName = '';
					this.showTitle = "";
					this.$store.commit("user/resetSelectedSectionInfo");
					this.isLessonSelected = true;
					clearInterval(this.typingTimer);
					this.typingTimer = setInterval(() => {
							if (i < newVal.length) {
								this.animatedLessonName += newVal[i];
								i++;
							} else {
								clearInterval(this.typingTimer);
								this.hideCursor();
							}
						}, 70);
				}
			},
		},
	};
  </script>

<style scoped>
	.Footer {
		position: absolute;
		bottom: 5%;
	}

	.last {
		gap: 36px;
	}

	.InfoBox {
		padding: 23px;
	}

	@keyframes typewriter {
		from { width: 0; }
		to { width: 100%; }
	}

	@keyframes blinkingCursor {
		0% { border-right-color: inherit; }
		50% { border-right-color: transparent; }
		100% { border-right-color: inherit; }
	}


	.lessonName {
		color: #3F48CC;
		font-family: Inter;
		font-size: 26px;
		font-style: normal;
		font-weight: 800;
		line-height: normal;
		padding-bottom: 6px;
		border-right: 0.3em solid black;
		overflow: hidden;
		white-space: nowrap;
		animation: typewriter 1s steps(40) 1s 1 normal both, blinkingCursor 1s step-end infinite;
	}

	.LessonInfoCard {
		width: 600px;
		height: 415px;
		border-radius: 6px 16px 16px 6px;
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
		margin-top: 16px;
		background: url("") no-repeat;
		background-size: 50% auto;
		background-position: 320px 0px;
		position: relative;
		transition: box-shadow 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
	}

	.LessonInfoCard::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		border-radius: 16px;
		width: 100%;
		height: 100%; /* Change this to fit your needs */
		background: linear-gradient(135deg, #ecfff3 0%, #fffdeb 50%);
		z-index: -1; /* Make sure it is below the content */
	}

	.LessonInfoCard:hover {
		box-shadow: 0px 0px 1px 2px #7d31ff;
	}


	.selectSectionBtn {
		width: auto;
		height: auto;
		padding: 10px 20px;
		align-items: center;
		justify-content: center;
		border-radius: 40px;
		color: #333;
		background: #fff;
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
		font-family: Inter;
		font-size: 16px;
		font-weight: 800;
		position: absolute;
		cursor: pointer;
		top: 210px;
		left: 33px;
		display: inline-flex; /* 修改为 inline-block 以允许按钮宽度自适应 */
		overflow: hidden;
		max-width: 310px; /* 设置最大宽度 */
		transition: all 0.3s ease;
	}

	.selectSectionBtn span {
		display: inline-block; /* 设置为 inline-block 以在悬停时扩展宽度 */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0 10px; /* 添加左右内边距以适应变化的宽度 */
		transition: max-width 0.3s ease; /* 添加过渡效果 */
	}

	.selectSectionBtn:hover {
		color: #3F48CC;
		box-shadow: 0px 0px 1px 2px #7d31ff;
	}
	
	.selectSectionBtn:hover span {
	    text-overflow: clip; /* 悬停时修改为 clip 以显示完整文本 */
		white-space: normal; /* Add this line to allow the text to wrap */
	}
	
	.selectSectionBtn:active {
		color: #3F48CC;
		background: #FFF;
	}

	.mark {
		font-size: 10px;
	}

	.dropdownList {
		position: absolute;
		top: 0%;
		left: 0%;
		width: 97.5%;
		height: 96.5%;
    	overflow-y: auto;
		background: #ffffffc8;
		backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 6px 16px 16px 6px;
		z-index: 999;
		padding: 6px;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
	}

	.dropdownItem {
		color: #333;
		padding: 10px;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.dropdownItem:hover {
		background: #e6e8eb;
		font-weight: 800;
		text-shadow: 0px 2px 4px #00000045;
		color: #000;
	}

	/* 这是整个滚动条的样式 */
	.dropdownList::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}

	/* 这是滚动条轨道的样式 */
	.dropdownList::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
		border-radius: 10px;
	}

	/* 这是滚动条滑块的样式 */
	.dropdownList::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: rgba(0,0,0,0.5);
		box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
	}

	/* 滑块在hover时的样式 */
	.dropdownList::-webkit-scrollbar-thumb:hover {
		background: rgba(0,0,0,0.8);
	}

	@media (max-width: 1220px) {
		.LessonInfoCard {
			margin-top: 16px;
			width: 100%;
			border-radius: 20px;
			background-position: 1320px 0px;
		}

		.dropdownList {
			width: 96%;
			border-radius: 20px;
		};

		.selectSectionBtn {
			left: 5%;
			border: none;
			bottom: 36%;
		}

		.lessonName {
			font-size: 20px;
			padding-bottom: 0;
		}

		.infoRow {
			font-size: 20px;
		}

		.infoDetail, .infoDetail2 {
			font-size: 14px;
		}
	}

	@media (max-width: 530px) {
		.LessonInfoCard {
			width: 80%;
			margin: 5%;
		}

		.infoRow {
			padding: 6px;
		}

		.infoDetail {
			width: 66%;
		}

		.selectSectionBtn {
			width: 75%;
			left: 5%;
			bottom: 36%;
			border: none;
			border-radius: 20px;
		}

		.shadowview {
			position: absolute;
			width: 100%;
			height: 240%;
			z-index: -1; /* 确保它在背后 */
		}
	}
</style>