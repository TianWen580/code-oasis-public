<template>
	<view class="App" :style="getAppStyles()">
		<Index></Index>
	</view>
</template>

<script>
	import Index from "pages/index/index.vue";

	export default {
		components: {
			Index,
		},
		methods: {
			getAppStyles() {
				const currentHour = new Date().getHours();
				let styles = {};
				if (currentHour >= 7 && currentHour < 19) {
					styles.backgroundColor = "aliceblue";
				} else {
					styles.backgroundColor = "#fcffeb";
				}

				return styles;
			},
		},
	};
</script>

<style>
	@font-face {
		font-family: 'songti';  
		src: url('~@/static/fonts/simsun.ttc');
		font-display: swap;
	}
	
	@font-face {
		font-family: 'deyihei';
		src: url('~@/static/fonts/SmileySans-Oblique.ttf');
		font-display: swap;
	}

	@font-face {
		font-family: 'Press Start 2P';
		src: url('~@/static/fonts/IPix.ttf');
		font-display: swap;
	}
	
	.App {
		position: fixed;
		top: 3%;
		left: 2.7%;
        width: 94%;
        height: 94%;
		background-color: aliceblue;
		border: 2px solid #55AA7F;
		border-radius: 20px;
		box-shadow: 0px 40px 200px 150px #55AA7F;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
	}
	
	.HMFGap {
		display: flex;
		flex-direction: column;
		gap: 36px;
	}
	
	.vertLayout {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.horLayout {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.stackLayout {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.overlay {
        position: fixed;
        top: 3%;
        left: 1.75%;
        width: 96%;
        height: 94%;
        border: 2px solid #e6e8eb;
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 0px 4px 16px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        transition: all 0.6s ease 0.1s;
        transform: translateY(0);
		overflow: hidden;
        z-index: 190;
    }

	.returnBtn {
		width: auto; /* 让宽度自适应文本长度 */
		display: inline-block; /* 允许宽度调整基于内容长度 */
		white-space: nowrap; /* 防止文本换行 */
        position: fixed;
		top: 10px;
      	left: 10px;
		padding: 6px 9px;
        background: gray;
		backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: 20px;
		color: white;
		font-size: 10px;
		font-weight: 800;
		cursor: pointer;
		z-index: 100;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .returnBtn:hover {
        color: lightgray;
      	box-shadow: 0px 0px 0px 2px #7d31ff;
		transform: scale(1.1);
    }

	.topBar {
        width: 80%;
        height: 46px;
        border-radius: 10px 10px 20px 20px;
		border: 1px solid rgba(255, 255, 255, 0.18);
        background: #61616178;
		backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        padding-right: 20px;
        margin: 6px;
        z-index: 1;
    }

    .titleBar {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        font-size: 24px;
        font-weight: bold;
        color: #333;
    }

	.infoRow {
		width: 320px;
		gap: 11px;
		color: #666DD6;
		font-family: Inter;
		font-size: 30px;
		font-style: normal;
		font-weight: 800;
		line-height: normal;
		display: flex;
		flex-wrap: nowrap;
		margin-bottom: 3px;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
	}
	.infoRowBox {
		margin-top: 12px;
	}
	.infoDetail {
		font-size: 16px;
		align-items: flex-start;
	}

	.infoDetail2 {
		font-size: 16px;
		font-weight: 300;
	}

	.levelNode {
        width: auto;
        height: 50px;
        background: #333;
    	border: 3px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0px 4px 1px 4px #000;
        color: #FFF;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 30px;
        font-weight: 800;
        white-space: nowrap;
        cursor: pointer;
        transition: padding 0.2s ease 0.1s;
    }

    .levelNode:hover {
        color: #87CEEB;
    }

    .levelNode:active {
        background: #D8DEFF;
        color: #3F48CC;
        box-shadow: 0px 4px 4px 4px #3F48CC;
    }

    .contentPage {
        display: flex;
        flex-direction: column;
        padding: 0 20px;
        height: 75%;
        overflow-y: auto;
    }

	.codeBlocksWrapper::-webkit-scrollbar,
	.contentPage::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }

	.section {
		/* background: #e6e8eb; */
		background: #ffffff58;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
		align-items: center;
		padding: 3px;
		margin: 10px;
		height: 50%;
		width: 100%;
		overflow: auto;
		position: relative;
	}

	.section::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}

	.listBox {
		overflow-y: auto;
		overflow-x: hidden;
		background: #fff;
		border-radius: 10px;
		height: 100%;
		display: flex;
		box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
		flex-direction: column;
		padding: 6px 0px 66px 0px;
		align-items: center;
		margin: 2%;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
	}

	.listBox:hover {
		transform: scale(1.01, 1.01);
	}

	/* 这是整个滚动条的样式 */
	.listBox::-webkit-scrollbar {
		width: 0px;
	}

	/* 这是滚动条轨道的样式 */
	.listBox::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
		border-radius: 10px;
	}

	/* 这是滚动条滑块的样式 */
	.listBox::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: rgba(0,0,0,0.5);
		box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
	}

	/* 滑块在hover时的样式 */
	.listBox::-webkit-scrollbar-thumb:hover {
		background: rgba(0,0,0,0.3);
	}

	.listItem {
		display: flex;
		flex-direction: row;
		word-wrap: break-word;
		word-break: break-all;
		justify-content: space-between;
		align-items: center;
		width: 96%;
		border-bottom: 1px solid lightgray;
		/* margin-top: 1.5%; */
		cursor: pointer;
		clip-path: inset(0 0 0 0 round 10px);
		transition: all 0.3s ease;
	}

	.listItem:hover {
		background: #e6e8eb;
	}

	.listItem-over {
		background-color: #f0f0f0;
	}

	.listItem-dragging {
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		background-color: #e0e0e0;
	}

	.listText {
		padding: 10px;
		font-size: 16px;
		color: gray;
		transition: all 0.3s ease;
	}

	.listText:hover {
		color: #333;
	}

	.deleteRecordButton {
		color: gray;
		font-size: 20px;
		font-weight: 800;
		margin-right: 10px;
		cursor: pointer;
		transition: all 0.3s ease 0.1s;
	}

	.addRecordButton {
		position: absolute;
		bottom: 20px;
		right: 20px;
		background: #333;
		box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.18);
		padding: 10px 20px;
		border-radius: 20px 10px 10px 10px;
		font-size: 16px;
		cursor: pointer;
		z-index: 100;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
	}

	.addRecordButton:hover {
		background: linear-gradient(90deg, #3f48cce2 0%, #7d31ff 100%);
		color: #D8DEFF;
		transform: scale(1.02, 1.05);
	}

	.paramNameBox {
		padding: 10px 0;
		display: flex;
		flex-direction: column;
		width: 60%;
	}

	.paramName {
		width: 60%;
		font-size: 16px;
		font-weight: 500;
		color: #45ac89;
		white-space: nowrap;
		margin-left: 10px;
	}

	.subTitleCaption {
		font-size: 12px;
		color: gray;
		margin: 6px 10px;
	}

	.contentIndex {
        font-weight: bold;
        background: #fff;
        padding: 0 5px;
        border-radius: 50%;
        color: #333;
        margin: 0 10px;
    }

	.notification {
		position: fixed;
		top: 2.5%;
		left: 50%;
		transform: translateX(-50%);
		background-color: #fff;
		color: #333;
		box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
		padding: 10px 20px;
		border-radius: 40px;
		white-space: nowrap;
		z-index: 1000;
	}

	.notificationIcon {
		color: red;
		text-shadow: 0px 0px 10px red;
		margin-right: 10px;
	}

	.labelContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: 10px 0;
	}

	.betaLabel {
		background: linear-gradient(90deg, #3f48cce2 0%, #7d31ff 100%);
		color: #fff;
		box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
		padding: 6px 26px;
		font-family: Inter;
		font-size: 16px;
		margin-left: 10px;
		border-radius: 40px;
		white-space: nowrap;
	}

	.normalLabel {
		background: #D8DEFF;
		color: #7d31ff;
		box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
		padding: 6px 26px;
		font-family: Inter;
		font-weight: 800;
		font-size: 14px;
		border-radius: 40px;
		margin: 10px;
		white-space: nowrap;
	}

	.proLabel {
		background: linear-gradient(90deg, #3f48cce2 0%, #7d31ff 100%);
		color: #fff;
		box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
		padding: 6px 26px;
		font-family: Inter;
		font-weight: 800;
		font-size: 14px;
		border-radius: 40px;
		margin: 10px;
		white-space: nowrap;
	}

	.textEdit {
		background: #e6e8eb00;
        border-radius: 12px;
        display: flex;
		color: #333;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
        word-wrap: break-word;
    }

    .textEdit:hover {
        background-color: #fffdeb;
        color: #3F48CC;
    }

    .inputBox {
        flex: 1;
        padding: 3px;
    }

    .sendBtn {
        background-color: #7d31ff;
        color: #fff;
        padding: 0 16px;
        margin: 3px;
        box-shadow: 0px 4px 66px 10px #7d31ff;
        border-radius: 40px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .sendBtn:hover {
        color: #D8DEFF;
        background-color: #7d31ff;
        box-shadow: 0px 0px 6px 0px #7d31ff;
        transform: scale(1.1);
    }

    .sendBtn:active {
        color: #D8DEFF;
        background-color: #7d31ff;
    }

	.deleteRecordButton:hover {
		color: red;
	}

	.limitedFuncLabel {
        background: #2d986a;
        color: #fff;
        font-size: 12px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 20px;
        margin: 0 10px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

	.fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

	.slide-fade-enter-active {
		transition: all 0.3s ease;
	}
	.slide-fade-leave-active {
		transition: all 0.2s ease;
	}
	.slide-fade-enter, .slide-fade-leave-to {
		transform: translateX(10px);
		opacity: 0;
	}

	.flash-enter-active {
		animation: flash 2s;
	}

	.flash-leave-active {
		animation: flashOut 2s;
	}

	@keyframes flash {
		0% {
			opacity: 0.3;
			transform: scale(0.1) translateY(360%);
		}
		80% {
			opacity: 0.6;
			transform: scale(0.95);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes flashOut {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(0.6) translateY(266%);
		}
	}

	@media (max-width: 530px) {
		.App {
			height: 97%;
			border-radius: 20px 20px 0 0;
		}

		.overlay {
			width: 94%;
			left: 2.5%;
			height: 97%;
			border-radius: 20px 20px 0 0;
		}

		.HMFGap {
			gap: 0px;
		}
	}

	@keyframes cute-animation {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
