<template>
    <transition name="slide-fade">
        <view class="settingPanel">
            <transition name="slide-fade">
                <view v-if="showNotification" class="notification">
                    <span class="notificationIcon">◉</span> {{ this.notificationContent }}
                </view>
            </transition>
            <view class="returnBtn" @click="hideSettingPanel">关闭</view>
            <view class="titleBar">
                <view class="title">设置</view>
            </view>
            <view class="content">
                <view class="apiSetter">
                    <view class="apiSetterTitle">卡密激活</view>
                    <view class="apiStatus">● {{ this.isActivate ? "教学升级 | " + this.$store.state.user.info.preference.apiQuota + "次" : "未知状态" }}</view>
                    <view class="functionLine">
                        <input type="text" class="apiSetterInput" v-model="apiAddress">
                        <button class="apiSetterBtn" @click="setAPIAddress" :disabled="this.isActivate">{{ this.isActivate ? "已激活" : "核验" }}</button>
                    </view>
                    <view class="limitedFuncLabel">教学升级点卡激活（GPT 4），星火暂时不需要激活</view>
                </view>
                <view class="settingContainer">
                    <view class="settingItem">
                        <view class="settingTitle">AI 教师引擎</view>
                        <select class="select" v-model="llmType">
                            <option :value="0" v-if="this.$store.state.user.info.mobile === '13622309458'">星火</option>
                            <option :value="1">OpenAI</option>
                        </select>
                    </view>
                </view>
                <view class="settingContainer">
                    <view class="settingItem">
                        <view class="settingTitle">教学升级</view>
                        <select class="select" v-model="isGPT4">
                            <option :value="true" v-if="isActivate">开</option>
                            <option :value="false">关</option>
                        </select>
                    </view>
                    <view class="settingItem">
                        <view class="settingTitle">声音</view>
                        <select class="select" v-model="isAudio">
                            <option :value="true">播放</option>
                            <option :value="false">静音</option>
                        </select>
                    </view>
                    <view class="settingItem">
                        <view class="functionLine">
                            <view class="settingTitle">教学大纲整理</view>
                            <view class="limitedFuncLabel">高级</view>
                        </view>
                        <select class="select" v-model="isOutline">
                            <option :value="true" v-if="this.$store.state.user.info.isPro">开</option>
                            <option :value="false">停用</option>
                        </select>
                    </view>
                </view>
            </view>
        </view>
    </transition>
</template>

<script>
import axios from 'axios';

export default {
    name: 'settingPanel',
    data() {
        return {
            showNotification: false,
            notificationContent: "",
            apiAddress: "",
            isActivate: false,
            isGPT4: false,
            isAudio: false,
            isOutline: false,
            llmType: 1,
        };
    },
    mounted() {
        this.apiAddress = this.$store.state.user.info.preference.apiAddress;
        this.isGPT4 = this.$store.state.user.info.preference.isGPT4;
        this.isAudio = this.$store.state.user.info.preference.isAudio;
        this.isOutline = this.$store.state.user.info.preference.isOutline;
        this.llmType = this.$store.state.user.info.preference.llmType;
    },
    methods: {
        hideSettingPanel() {
            this.$emit('close');
        },
        showTempNotification(content) {
            this.notificationContent = content;
            this.showNotification = true;
            setTimeout(() => {
                this.showNotification = false;
            }, 3000);
        },
        async setAPIAddress() {
            if (this.apiAddress && this.apiAddress.trim() === "") {
                this.showTempNotification("请输入卡密");
                return;
            }
            try {
                this.showTempNotification("正在核验，请稍后");
                await axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/apiTester', {
                    apiAddress: this.apiAddress
                });
                this.isActivate = true;
                this.$store.commit('user/setUserApiAddress', {
                    apiAddress: this.apiAddress,
                    isGPT4: this.isGPT4,
                    isActivate: true,
                    isAudio: this.isAudio,
                    isOutline: this.isOutline,
                    llmType: this.llmType,
                })
                this.showTempNotification("激活成功");
            } catch (error) {
                console.error("Error occurred:", error);
                this.showTempNotification("激活失败，请检查卡密");
            }
        }
    },
    watch: {
        isGPT4(newValue) {
            this.$store.commit('user/setUserPreference', {
                isGPT4: newValue,
                isAudio: this.isAudio,
                isOutline: this.isOutline,
                llmType: this.llmType,
            })
        },
        isAudio(newValue) {
            this.$store.commit('user/setUserPreference', {
                isGPT4: this.isGPT4,
                isAudio: newValue,
                isOutline: this.isOutline,
                llmType: this.llmType,
            })
        },
        isOutline(newValue) {
            this.$store.commit('user/setUserPreference', {
                isGPT4: this.isGPT4,
                isAudio: this.isAudio,
                isOutline: newValue,
                llmType: this.llmType,
            })
        },
        llmType(newValue) {
            this.$store.commit('user/setUserPreference', {
                isGPT4: this.isGPT4,
                isAudio: this.isAudio,
                isOutline: this.isOutline,
                llmType: newValue,
            })
        },
        apiAddress(newValue) {
            this.isActivate = false;
        }
    }
}
</script>

<style>
    .settingPanel {
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

    .returnBtn {
        position: absolute;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 15%;
        padding: 66px;
    }

    .apiSetter {
        width: 94%;
        background: linear-gradient(135deg, #50c994 0%, #85cf5c 50%);
        padding: 3%;
        border-radius: 20px;
    }

    .apiSetterTitle {
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 3px;

    }

    .apiStatus {
        margin-bottom: 10px;
        color: #2d986a;
    }

    .apiSetterInput {
        width: 96%;
        height: 30px;
        border-radius: 40px;
        padding: 0 2%;
        background: #fff;
        margin-bottom: 10px;
        transition: all 0.3s ease;
    }

    .apiSetterInput:hover {
        box-shadow: 0px 0px 0px 2px #000;
    }

    .apiSetterBtn {
        width: 96px;
        height: 30px;
        border-radius: 40px;
        background: #00ff91;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 800;
        color: #000;
        margin-left: 2%;
        transition: all 0.3s ease;
    }

    .apiSetterBtn:hover {
        box-shadow: 0px 0px 0px 2px #000;
    }

    .functionLine {
        display: flex;
        flex-direction: row;
    }

    .settingContainer {
        width: 100%;
        margin-top: 20px;
        border-radius: 20px;
        background: #e6e8eb;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .settingContainer:hover {
        box-shadow: 0px 0px 1px 2px #7d31ff;
    }

    .settingItem {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #fff;
        padding: 10px 16px;
        align-items: center;
        clip-path: inset(0px 0px 0px 0px round 20px);
    }

    .settingTitle {
        font-size: 16px;
        font-weight: 800;
    }

    .select {
        width: 126px;
        height: 30px;
        border-radius: 40px;
        background: #fff;
        border: none;
        outline: none;
        padding: 0 2%;
        font-size: 16px;
        font-weight: 800;
        color: #000;
        transition: all 0.3s ease;
    }
</style>


