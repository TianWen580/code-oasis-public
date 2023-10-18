<template>
	<view class="Header">
		<LoginPanel
			v-show="isShowLoginPanel"
			:isShowLoginPanel="isShowLoginPanel"
			@close="hideLoginPanel"
			>
		</LoginPanel>
		<settingPanel
			v-if="isSettingPanelVisible"
			@close="hideSettingPanel"
			/>
		<view class="HMFGap vertLayout">
			<transition name="slide-fade">
				<view v-if="showNotification" class="notification">
					<span class="notificationIcon">❖</span>{{ notificationText }}
				</view>
			</transition>
			<view class="btnHeader">
				<view class="infoHeader horLayout">
					<view class="idBtn" @click="toggleLoginPanel">😎</view>
					<span class="selectLessonInfoLabel">
						{{ this.$store.state.user.info.selectedLesson.name }}<br>
						<span class="progress">{{ this.$store.state.user.info.selectedLesson.progress }}</span>
					</span>
				</view>
				<view class="rightBtnHeader">
					<view class="settingBtn idBtn" @click="toggleSettingPanel">🕹️</view>
					<view class="stuBtn idBtn" @mouseover="showTooltip" @mouseout="hideTooltip" @click="loadPoem">{{ isChecked ? "已" : "签" }}</view>
				</view>
				<transition name="slide-fade">
					<view class="tooltip" v-if="isShowTooltip">
						<view class="poemContent">{{ this.poem.content }}</view>
						<view class="poemTitle">{{ this.poem.title }}</view>
						<view class="poemAuthor">{{ this.poem.author }}</view>
						<view class="poemTranslate">{{ this.getFormattedPoemTranslateString() }}</view>
					</view>
				</transition>
			</view>
			<span class="titleHeader">代 码 庄 园</span>
		</view>
	</view>
</template>

<script>
import LoginPanel from '@/components/LoginPanel.vue';
import settingPanel from '@/components/settingPanel.vue';

export default {
  name:"Header",
	components: {
		LoginPanel,
		settingPanel,
	},
  	data() {
		return {
			isShowTooltip: false,
			isShowLoginPanel: false,
			isSettingPanelVisible: false,
			isChecked: false,
			poem: {
				content: "",
				title: "签到与激励",
				author: "",
				translate: ["连续 3 天签到，获得 3 天高级功能体验机会（教学大纲整理）"],
			},
			showNotification: false,
			notificationText: "",
		};
  	},
  	methods: {
		toggleTooltip() {
			this.isShowTooltip = !this.isShowTooltip;
		},
		showTooltip() {
			this.isShowTooltip = true;
		},
		hideTooltip() {
			this.isShowTooltip = false;
		},
		hideLoginPanel() {
			this.isShowLoginPanel = false;
		},
		hideSettingPanel() {
			this.isSettingPanelVisible = false;
		},
		toggleSettingPanel() {
			if (this.$store.state.user.info._id === "尚未登录") {
				this.showTempNotification("请先登录");
			} else {
				this.isSettingPanelVisible = !this.isSettingPanelVisible;
			}
		},
		toggleLoginPanel() {
			this.isShowLoginPanel = !this.isShowLoginPanel;
		},
		getFormattedPoemTranslateString() {
			if (this.poem.translate === null) {
				return "暂无译文。";
			} else {
				return this.poem.translate.join('\n');
			}
		},
		async manageStatus(funcName, nowTimeString, consistentCheckinDays) {
			try {
				const res = await uniCloud.callFunction({
					name: funcName,
					data: {
						stuID: this.$store.state.user.info._id,
						nowTimeString: nowTimeString,
						consistentCheckinDays: consistentCheckinDays,
					}
				});

				this.$store.commit('user/refeshLastLoginTime');
				if (consistentCheckinDays !== 3) {
					return {
						isChecked: true,
						text: `连续 ${consistentCheckinDays} 天签到成功！`
					};
				} else {
					this.$store.commit('user/setIsPro', true);
					return {
						isChecked: true,
						text: `连续 ${consistentCheckinDays} 天签到成功！\n恭喜你获得 3 天高级功能体验机会！`
					};
				}
			} catch (err) {
				console.log(err);
				return {
					isChecked: false, // 注意这里的状态应该是未签到
					text: "签到异常，请联系开发者"
				};
			}
		},
		async updateCheckInStatus(isReset, nowTimeString, consistentCheckinDays) {
			if (isReset) {
				return this.manageStatus('resetCheckinStatus', nowTimeString, consistentCheckinDays)
			} else {
				return this.manageStatus('updateCheckinStatus', nowTimeString, consistentCheckinDays)
			}
		},
		async checkCheckinStatus() {
			try {
				const res = await uniCloud.callFunction({
					name: 'getUserInfo',
					data: {
						stuID: this.$store.state.user.info._id,
					}
				});

				const lastCheckinYMD = res.result.data.data[0].lastCheckinYMD.split('-');
				const consistentCheckinDays = res.result.data.data[0].consistentCheckinDays;
				const lastDate = new Date(Number(lastCheckinYMD[0]), Number(lastCheckinYMD[1]) - 1, Number(lastCheckinYMD[2]));
				const nowTime = new Date().getTime();
				const nowTimeString = new Date(nowTime).toISOString().slice(0, 10);
				const nowYMD = nowTimeString.split('-');
				const nowDate = new Date(Number(nowYMD[0]), Number(nowYMD[1]) - 1, Number(nowYMD[2]));

				// 计算上次签到和这次签到的天数差
				const diffTime = Math.abs(nowDate - lastDate);
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

				if (diffDays === 1) {
					if (consistentCheckinDays <= 2) {
						const res = await this.updateCheckInStatus(false, nowTimeString, consistentCheckinDays);
						this.showTempNotification(res.text);
						return res.isChecked;
					} else {
						const res = await this.updateCheckInStatus(true, nowTimeString, consistentCheckinDays);
						this.showTempNotification(res.text);
						return res.isChecked;
					}
				} else if (diffDays === 0) {
					this.showTempNotification("今天已经签过到啦！");
					return false;
				} else if (diffDays > 1) {
					const res = await this.updateCheckInStatus(true, nowTimeString, consistentCheckinDays);
					this.showTempNotification(res.text);
					return res.isChecked;
				} else {
					this.showTempNotification("签到异常，请联系开发者");
					return false;
				}
			} catch (err) {
				console.log(err);
				this.showTempNotification("签到异常，请联系开发者");
				return false;
			}
		},
		loadPoem() {
			this.showTooltip();
			if (this.$store.state.user.info._id === "尚未登录") {
				this.showTempNotification("请先登录");
			} else {
				this.isChecked = this.checkCheckinStatus();
				return;
			}
			if(this.isChecked) {
				const jinrishici = require('jinrishici');
					jinrishici.load(result => {
						this.poem = {
							content: result.data.content,
							title: result.data.origin.title,
							author: `${result.data.origin.dynasty} · ${result.data.origin.author}`,
							translate: result.data.origin.translate,
						}
				}, errData => {
					console.log(err);
				});
			}
		},
		showTempNotification(text) {
			this.notificationText = text;
			this.showNotification = true;
			setTimeout(() => {
				this.showNotification = false;
			}, 3000); // 3秒后自动隐藏
		}
  	},
};
</script>



<style scoped lang="less">
	.Header {

	}
	
	.tooltip {
		position: absolute;
		top: 100px;
		right: 9%;
		width: 78%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(90deg, #fffef1 0%, #f4fefd 100%);
		padding: 2%;
		border-radius: 16px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		color: #3F48CC;
		font-family: songti;
		font-size: 18px;
		font-weight: 800;
		z-index: 100;
	}
	
	.selectLessonInfoLabel {
		color: #3F48CC;
		font-family: Inter;
		font-size: 20px;
		font-style: normal;
		font-weight: 800;
		line-height: 1.2;
	}

	.progress {
		color: #666DD6;
		font-family: Inter;
		font-size: 16px;
		font-weight: 500;
	}
	
	.idBtn {
		// background: #1b17f514;
		background: linear-gradient(118deg, #fff9b4 0%, #c3fff9 100%);
		background-position: 100% 100%;
		border-radius: 50%;
		color: #3F48CC;
		font-family: 'Press Start 2P', cursive;
		font-size: 20px;
		font-style: normal;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0px;
		cursor: pointer;
		transition: color 0.3s ease;
		width: 50px;
		height: 50px;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
	}

	.idBtn:hover {
		color: #87CEEB;
      	box-shadow: 0px 0px 0px 2px #7d31ff;
	  	transform: scale(1.1);
	}

	.idBtn:active {
	  color: hsl(236, 58%, 52%);
	  box-shadow: 0px 0px 0px 3px #7d31ff;
	}

	.stuBtn {
		width: 46px;
		height: 46px;
		margin-left: 6px;
		color: #7d31ff;
		background: linear-gradient(90deg, #3f48cce2 0%, #7d31ff 100%);
		border: 3px solid #fff;
	}

	.settingBtn {
		width: 46px;
		height: 46px;
		margin-left: 6px;
		background: linear-gradient(90deg, #e6e8e6 0%, #dddddd 100%);
		border: 3px solid #fff;
	}

	.titleHeader {
		color: #3F48CC;
		font-family: deyihei;
		font-size: 60px;
		font-style: normal;
		font-weight: 800;
		line-height: normal;
	}

	.btnHeader {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
	}

	.rightBtnHeader {
		display: flex;
		flex-direction: row;
	}

	.headerGap {
		gap: 60px;
	}

	.infoHeader {
		gap: 11px;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
	}

	.poemContent {
		color: #333;
		font-family: 'Press Start 2P', cursive;
		font-size: 18px;
		font-weight: 800;
		line-height: 1.2;
		text-align: center;
		z-index: 1;
	}

	.poemContent:after {
		content: "";
		display: block;
		transform: translateY(-10px);
		width: 100%;
		height: 10px;
		background: #ffffdb6f;
		z-index: -1;
	}

	.poemTitle {
		font-family: songti;
		text-align: center;
		font-size: 26px;
		font-weight: 800;
		line-height: 1.2;
	}

	.poemTitle:after {
		content: "";
		display: block;
		width: 100%;
		height: 1px;
		background: #666DD6;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.poemAuthor {
		font-family: songti;
		font-size: 18px;
		line-height: 1.2;
	}

	.poemTranslate {
		margin: 36px 66px;
		font-family: Inter;
		font-size: 16px;
		font-weight: 100;
		line-height: 1.5;
	}

	@media (max-width: 530px) {
		.Header {
			padding: 16px;
		}

		.HMFGap {
			gap: 16px;
		}
    }
</style>