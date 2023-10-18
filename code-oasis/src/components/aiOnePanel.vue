<template>
    <transition name="slide-fade">
        <view class="aiOnePanel">
            <transition name="slide-fade">
                <view v-if="showNotification" class="notification">
                    <span class="notificationIcon">◉</span> {{ this.notificationContent }}
                </view>
            </transition>
            <view class="leftSection">
                <view class="aiOneInput">
                    <span>ai.</span>
                    <input type="text" class="aiOneTextEdit" placeholder="ToDo..." v-model="methodName" @keydown.enter.prevent="aiOneExecute">
                    <span>(</span>
                    <input type="text" class="aiOneTextEdit" placeholder="参1，参2..." v-model="paraSet" @keydown.enter.prevent="aiOneExecute">
                    <span>)</span>
                    <button class="aiOneExecuteBtn" @click="aiOneExecute" :disabled="isAiOneExecuting">{{ isAiOneExecuting ? '...' : 'Ent' }}</button>
                </view>
                <view class="aiOnePreview">
                    <span>🖥️ CODE ▸</span>
                    <textarea  type="text" class="previewTextEdit" placeholder="Preview Python Code..." v-model="previewText" maxlength="4000"></textarea>
                </view>
                <view class="runBtn" @click="codeRunningLocally">{{ isRunningCode ? '等' : '跑' }}</view>
            </view>
            <view class="rightSection">
                <view class="aiOneRunner">
                    <span>🏃 RUN ▸</span>
                    <textarea  type="text" class="runnerTextEdit" placeholder="Result..." v-model="runResult" maxlength="4000"></textarea>
                    <view class="limitedFuncLabel">For Python</view>
                </view>
            </view>
        </view>
    </transition>
</template>

<script>
    import axios from 'axios';
    import qs from 'qs';

    export default {
        name: "aiOnePanel",
        data() {
            return {
                showNotification: false,
                notificationContent: "",
                previewText: "",
                methodName: "",
                paraSet: "",
                isAiOneExecuting: false,
                isRunningCode: false,
                runResult: "",
            };
        },
        methods: {
            hideAiOnePanel() {
                this.$emit('close');
            },
            async aiOneExecute() {
                if (this.methodName.trim() === "") {
                    this.showTempNotification("请填写需求！");
                    return;
                }
                this.isAiOneExecuting = true;
                const data = {
                    "todo": this.methodName,
                    "para": this.paraSet,
                };
                axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/aiOne', {
                    data: data,
                })
                .then(response => {
                    if (response.data.status === 200) {
                        const code = response.data.code;
                        this.previewText = code;
                        console.log(response);
                        this.isAiOneExecuting = false;
                    } else {
                        this.showTempNotification(response.data.message);
                        this.isAiOneExecuting = false;
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            },
            showTempNotification(content) {
                this.notificationContent = content;
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            },
            codeRunningLocally() {
                if (this.previewText.trim() === "") {
                    this.showTempNotification("请完成代码");
                    return;
                }
                this.isRunningCode = true;
                this.runResult = "运行中...";
                var data = {
                    code: this.previewText,
                    token: "066417defb80d038228de76ec581a50a",
                    stdin: "",
                    language: "15",
                    fileext: "py3"
                };
                axios({
                    url: "https://dingo-endless-ghoul.ngrok-free.app/api/runcode",
                    method: 'post',
                    data: qs.stringify(data),
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                })
                .then((response) => {
                    var response_dict = response.data;
                    if (response_dict['errors'] != null && response_dict['errors'].trim() !== '') {
                        this.runResult = response_dict['errors'];
                    } else {
                        this.runResult = response_dict['output'];
                    }
                })
                .catch((error) => {
                    console.log('request fail', error);
                })
                .finally(() => {
                    this.isRunningCode = false;
                });
            }
        },
    };
</script>

<style>
    .aiOnePanel {
        padding: 36px 16px 36px 16px;
        overflow: auto;
        position: fixed;
        top: 8%;
        left: 16%;
        width: 66%;
        height: 50%;
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        z-index: 1050;
        align-items: center;
    }

    .returnBtn {
        position: absolute;
    }

    .leftSection {
        width: 50%;
        height: 96%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        position: relative;
    }

    .rightSection {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .aiOneInput {
        width: 90%;
        background: #fff;
        border-radius: 16px 16px 10px 10px;
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.1);
        padding: 10px;
        font-size: x-large;
        font-weight: 800;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .aiOneTextEdit {
        width: 86%;
        background: #ddd;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        font-weight: 800;
        margin: 0 3px;
        padding: 3px;
        resize: none;
        outline: none;
        transition: all 0.3s ease;
    }

    .aiOneTextEdit:hover {
        background: #e6e8eb;
    }

    .aiOnePreview {
        width: 90%;
        height: 100%;
        background: #fff;
        border-radius: 10px 10px 16px 16px;
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.18);
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        overflow-y: auto;
        margin-top: 10px;
    }
    .aiOneRunner {
        width: 90%;
        height: 100%;
        background: rgba(0, 0, 0, 0.38);
		backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
        color: #fffacc;
        border-radius: 16px;
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.18);
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        overflow-y: auto;
        margin-top: 10px;
    }

    .runBtn {
        position: absolute;
        bottom: 10px;
        right: 20px;
        background: #ddd;
        box-shadow: 0px 0px 4px 0px #33300031;
        color: #333;
        padding: 10px 20px;
        border: none;
        border-radius: 40px 16px 16px 16px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .runBtn:hover {
        background: #dddddd8f;
        box-shadow: 0px 0px 1px 2px #7d31ff;
    }

    .aiOneExecuteBtn {
        background: linear-gradient(
            300deg,
            #ff8000cf 0%,
            #ff8000b9 14.28%,
            #ffff0076 28.57%,
            #00ff0077 42.86%,
            #3330ff4f 57.14%,
            #4c0082b1 71.43%,
            #ff8000b9 85.72%,
            #ff0000b5 100%
        );
        background-size: 200%;
        width: 66px;
        height: 30px;
        border: 1px solid #fff;
        border-radius: 6px;
        margin-left: 6px;
        background-position: 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Courier New', Courier, monospace;
        color: #fff;
        box-shadow: 0px 0px 0px 2px #333;
        transition: all 0.1s ease;
    }

    .aiOneExecuteBtn:hover {
        color: #7d31ff;
        box-shadow: 0px 0px 0px 2px dodgerblue;
        background-position: 96% 0;
    }

    .aiOneExecuteBtn:active {
        color: #7d31ff;
        background: #fff;
        background-position: 100% 0;
    }

    .previewTextEdit {
        /* 让textarea填满它的父元素 */
        width: 100%;
        height: 100%;
        color: gray;
        font-family: 'Courier New', Courier, monospace;
    }

    .runnerTextEdit {
        /* 让textarea填满它的父元素 */
        width: 100%;
        height: 100%;
        font-family: 'Courier New', Courier, monospace;
    }
</style>