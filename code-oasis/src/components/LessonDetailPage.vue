<template>
    <transition name="slide-fade">
      <view class="detailPage">
        <view class="returnBtn" @click="hideDetailPage">返回</view>
        <view class="titleBar">
            <view class="title">{{ selectedLesson['tecName'] }}</view>
            <view class="betaLabel" v-if="selectedLesson.isBeta">Beta</view>
        </view>
        <view class="labelContainer">
            <view class="normalLabel" v-if="selectedLesson.documentAlign">📖教材联想</view>
            <view class="normalLabel" v-if="selectedLesson.realWorldSense">🌃自然世界感知</view>
            <view class="normalLabel">🦄平行世界的你：{{ selectedLesson.stuAge }}岁</view>
        </view>
        <view class="contentPage">
            <img :src="selectedLesson['tecImage']" alt="" class="tecImg">
            <view class="coverCard">
                <view class="verLayout">
                    <view class="Title">{{ selectedLessonIndex }}</view>
                    <view class="Emoji">{{ selectedLesson['emoji'] }}</view>
                </view>
                <view class="infoRowBox">
                    <view class="infoRow horLayout" v-for="(info, index) in selectedLesson['info']" :key="index">
                    <span>{{ info[0] }}</span>
                    <view class="infoDetail vertLayout">
                        <span>{{ info[1] }}</span>
                        <span class="infoDetail2">{{ info[2] }}</span>
                    </view>
                    </view>
                </view>
            </view>
            <view class="title2">探索环节</view>
            <view class="contentContainer" v-for="(content, index) in selectedLesson['contentTitles']" :key="index">
                <view class="contentIndex">{{ index + 1 }}</view>
                <view class="contentTitles">
                    {{ content[0] }}<br>
                    <span v-for="n in content[2] - content[1]" :key="n">⭐</span>
                </view>
            </view>
        </view>
      </view>
    </transition>
  </template>
  
  <script>
    export default {
        name: "LessonDetailPage",
        props: {
            selectedLesson: {
                type: Object,
                default: {},
            },
            selectedLessonIndex: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {};
        },
        methods: {
            hideDetailPage() {
                this.$emit('close');
            },
            getLessonDetail() {
                return this.lesson;
            },
        },
        watch: {
            Title(newVal, oldVal) {
                if (newVal !== oldVal) {
                    let i = 0;
                    this.animatedLessonName = '';
                    this.showTitle = "";
                    this.selectedSection = "还没决定哦";
                    this.isLessonSelected = true;
                    const typing = setInterval(() => {
                        if (i < newVal.length) {
                            this.animatedLessonName += newVal[i];
                            i++;
                        } else {
                            clearInterval(typing);
                            this.hideCursor(); // Call hideCursor() after the animation completes
                        }
                    }, 70);
                }
            },
        },
  };
  </script>
  
  <style scoped>
    .returnBtn {
        position: absolute;
        color: rgb(224, 224, 224);
        background: #ffffff5a;
        cursor: pointer;
    }

    .detailPage {
        position: fixed;
        top: 10%;
        left: 10%;
        width: 80%;
        height: 80%;
        background: #7d31ff;
        background-size: 60px 60px, 200% 200%;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 300;
    }

    .tecImg {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        object-fit: cover;
        border-radius: 0 0 20px 0;
        filter: drop-shadow(8px 6px 0px #17D3C0);
        transform: translateX(30%);
        z-index: -1;
    }

    .infoRowBox {
        margin-top: auto;
    }

	.infoRow {
        width: 300px;
    }

    .coverCard {
        border-radius: 20px;
        border: 1px solid rgba(0, 0, 0, 0.28);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;
        position: relative;
        padding: 20px;
        transition: all 0.3s ease;
    }

    .coverCard::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 20px;
        background: #ffffffe7;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .scrollContent::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }

    .scrollContent::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #dedeed7a;
        border-radius: 10px;
    }

    .scrollContent::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #dedeed;
        box-shadow: inset 0 0 6px #dedeed;
    }

    .scrollContent::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.8);
    }

    .titleBar {
        display: flex;
        justify-content: center;
        align-items: center;
		font-family: 'Press Start 2P';
        margin-top: 20px;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
    }

    .Title {
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
		animation: typewriter 0.5s steps(40) 1s 1 normal both, blinkingCursor 1s step-end infinite;
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

    .title2 {
        font-size: 20px;
        font-weight: bold;
        padding: 10px;
        color: #fff;
        margin-top: 20px;
    }
  
    .Emoji {
        font-size: 100px;
        margin-bottom: 20px;
    }
    
    .Info {
        text-align: center;
        margin-top: 20px;
    }
    
    .labelContainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .contentContainer {
        background: linear-gradient(90deg, #9eeebb00 0%, #3F48CC);
        border-radius: 20px 16px 20px 16px;
        padding: 6px;
        display: flex;
        align-items: center;
        margin: 10px 0 10px 0;
        position: relative;
        z-index: -2;
    }

    .contentContainer:hover {
        z-index: 1;
    }

    .contentTitles {
        font-size: 16px;
        color: #fff;
        padding: 3px 10px;
        border-radius: 10px;
        transition: all 0.3s ease;
        flex-grow: 1; /* 让 contentTitles 填充剩余空间 */
    }

    @media (max-width: 530px) {
        .detailPage {
            width: 100%;
            height: 97%;
            top: 0;
            left: 0;
            border-radius: 20px;
        }

        .tecImg {
            display: none;
        }

        .contentPage {
            height: 74%;
        }

        .infoRow {
            width: 100%;
        }

        .infoDetail {
            font-size: 14px;
        }

        .infoDetail2 {
            font-size: 14px;
        }
    }
  </style>
  