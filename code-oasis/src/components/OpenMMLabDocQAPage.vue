
<template>
    <transition name="slide-fade">
        <view class="OpenMMLabDocQAPage">
            <view class="returnBtn" @click="hideOpenMMLabDocQAPage">关闭</view>
            <view class="titleBar">
                <view class="title">🦄 OpenMMLab 知识问答</view>
            </view>
            <img src="https://mp-e0ed877f-b5e3-4609-ba60-27ead9d4d8e8.cdn.bspapp.com/static/tec4.png" alt="" class="tecImg">
            <view class="contentPage">
                <view class="QAView">
                    <view v-for="(history, index) in historyRecords" :key="index" class="historyRecord">
                        <span class="historyIndex">{{ index + 1 }}</span>
                        <vue-markdown class="historyText" :source="history"></vue-markdown>
                    </view>
                </view>
                <view class="textEdit">
                    <input
                        type="text" class="inputBox" placeholder="Query（不支持连续对话） ▸"
                        v-model="userMessage"
                        @focus="focusInput"
                        @blur="blurInput"
                        @keydown.enter.prevent="sendMessageFlask"
                        >
                    <button class="sendBtn" :disabled="isThinking" @click="sendMessageFlask">{{ isThinking ? "等" : "Q!" }}</button>
                </view>
            </view>
        </view>
    </transition>
</template>

<script>
    import axios from 'axios';
    import VueMarkdown from 'vue-markdown';
    import 'highlight.js/styles/github.css';

    export default {
        name: "OpenMMLabDocQAPage",
        components: {
            VueMarkdown,
        },
        data() {
            return {
                records: [],
                charpter: "",
                mark: 0,
                historyRecords: [],
                userMessage: "",
                documentContent: "",
                documentName: "",
                isThinking: false,
            };
        },
        methods: {
            hideOpenMMLabDocQAPage() {
                this.$emit('close');
            },
            async sendMessageFlask() {
                if (this.userMessage.trim() === "" || this.isThinking) {
                    return;
                }
                this.isThinking = true;
                this.addToHistory('我: \n' + this.userMessage);
                this.addToHistory("助理机器人: " + "喵~资料检索中...");
                const message = [
                    this.userMessage,
                    this.$store.state.user.info.preference.llmType,
                ];
                this.userMessage = "";
                try {
                    let response;
                    response = await axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/QA', {
                        prompt: message
                    });
                    let aiMsg;
                    aiMsg = response.data[0];
                    this.documentContent = response.data[1];
                    this.documentName = response.data[2]['source'];
                    this.historyRecords.pop();
                    this.addToHistory("助理的机器喵: \n" + aiMsg);
                } catch (error) {
                    console.error("Error occurred:", error);
                }
                this.isThinking = false;
            },
            addToHistory(message) {
                if (this.historyRecords.length === 0) {
                    this.historyRecords.push(message);
                } else {
                    const lastMessage = this.historyRecords[this.historyRecords.length - 1];
                    if (message !== lastMessage) {
                        this.historyRecords.push(message);
                    }
                }
            },
        },
    };
</script>

<style>
    .OpenMMLabDocQAPage {
        position: fixed;
        top: 10%;
        left: 10%;
        width: 80%;
        height: 80%;
        background-color: #fff;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 300;
    }

    .OpenMMLabDocQAPage:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: calc(66px + 10%);
        background: linear-gradient(45deg, rgba(255, 0, 0, 0.228), rgba(255, 166, 0, 0.26), rgba(0, 128, 0, 0.292), rgba(0, 255, 255, 0.247), rgba(0, 128, 0, 0.21), rgba(0, 255, 255, 0.224), rgba(0, 0, 255, 0.215), rgba(238, 130, 238, 0.228), rgba(255, 0, 0, 0.228));
        filter: blur(20px);
        z-index: -1;
    }

    .returnBtn {
        position: absolute;
    }

    .contentPage {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    .titleBar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 10%;
        width: 100%;
    }

    .textEdit {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        position: absolute;
        bottom: 3%;
        left: 1%;
        height: 6%;
        width: 98%;
        color: #333;
        transition: all 0.5s;
    }

    .inputBox {
        width: 96%;
        border-radius: 10px;
        outline: none;
        padding: 0 10px;
        font-family: "Press Start 2P";
        font-size: 16px;
        transition: all 0.5s;
    }

    .sendBtn {
        position: absolute;
        bottom: 120%;
        width: 66px;
        height: 66px;
        border-radius: 50%;
        font-size: x-large;
        font-weight: 800;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tecImg {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 90%;
        object-fit: cover;
        border-radius: 0 0 20px 0;
        filter: drop-shadow(8px 6px 0px #17D3C0);
        transform: translateX(30%) translateY(-16%);
        z-index: -1;
    }

    .QAView {
        overflow: auto;
        position: fixed;
        top: 20%;
        left: 10%;
        width: 60%;
        height: 53%;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        z-index: 1;
        align-items: center;
    }

    .historyRecord {
        margin-top: 10px;
        border-radius: 16px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 70%;
        padding: 6px;
    }

    .historyIndex {
        font-weight: bold;
        background: #e6e8eb;
        padding: 0 6px;
        border-radius: 50%;
        color: #333;
        margin-right: 10px;
    }

    .historyText {
        margin: 3px 0;
        font-family:'Courier New', Courier, monospace;
        color: #333;
        width: 100%;
    }

	.QAView::-webkit-scrollbar {
        width: 0;
        height: 0;
	}

    @media (max-width: 530px) {
        .tecImg {
            display: none;
        }

        /* 整个窗口全屏 */
        .OpenMMLabDocQAPage {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
        }

        .QAView {
            top: 10%;
            left: 0;
            width: 100%;
            height: 50%;
            border-radius: 0;
        }

        .historyRecord {
            width: 90%;
        }
    }
</style>