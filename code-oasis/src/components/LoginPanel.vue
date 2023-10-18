<template>
    <transition name="slide-fade">
        <view class="overlay">
          <transition name="slide-fade">
              <view v-if="showNotification" class="notification">
                  <span class="notificationIcon">◉</span> {{ this.notificationContent }}
              </view>
          </transition>
            <view class="returnBtn" @click="hideLoginPanel">关闭</view>
            <view class="stackLayout">
                <view class="titleBar">
                    <view class="title">学生信息注册与管理处</view>
                </view>
                <view class="loginTitleBg"></view>
            </view>
            <view class="protocol" v-if="isShowProtocol" title="免责协议">
                {{ protocolContent }}
            </view>
            <view class="infoContainer">
                <img class="stuAvator" src="https://mp-e0ed877f-b5e3-4609-ba60-27ead9d4d8e8.cdn.bspapp.com/static/tec3stu.png">
                <view class="proLabel" v-if="this.$store.state.user.info.isPro" @click="refusePurchase">高级功能已开放</view>
                <view class="normalLabel" v-if="!this.$store.state.user.info.isPro" @click="refusePurchase">完整体验已失效</view>
                <view class="stuInfoRecord">
                    <view class="RecordContainer">
                        <view class="RecordKey">ID</view>
                        <view class="RecordValue">{{ this.$store.state.user.info._id }}</view>
                    </view>
                    <view class="RecordContainer">
                        <view class="RecordKey">手机</view>
                        <view class="RecordValue">{{ this.$store.state.user.info.mobile }}</view>
                    </view>
                    <view class="RecordContainer">
                        <view class="RecordKey">入学时间</view>
                        <view class="RecordValue">{{ this.$store.state.user.info.registTime }}</view>
                    </view>
                    <view class="RecordContainer">
                        <view class="RecordKey">最近活跃</view>
                        <view class="RecordValue">{{ this.$store.state.user.info.lastLoginTime }}</view>
                    </view>
                </view>
                <view class="stuInfoRecord">
                    <view class="RecordContainer">
                        <view class="RecordKey">关于</view>
                        <view class="RecordValue aboutBtn" @click="showAbout">(●'◡'●)</view>
                    </view>
                    <view class="RecordContainer">
                        <view class="RecordKey">相关申明</view>
                        <view class="RecordValue aboutBtn" @click="showProtocol">免责协议</view>
                    </view>
                </view>
                <span>内测中，正式上线后会删档。</span>
                <view class="logoutBtn" @click="cleanLocalStorage">⨉ 登出</view>
            </view>
            <transition name="fade">
                <form @submit="confirmLogin" class="loginForm" v-if="this.$store.state.user.info._id === '尚未登录'">
                    <view class="content">
                        <span class="welcomeText">代码庄园</span>
                        <input class="inputArea" type="text" name="mobile" placeholder="手机号" v-model="tempMobile">
                        <input class="inputArea" type="password" name="password" placeholder="密码">
                        <img class="codeImg" :src="picUrl" v-if="isShowCodeImg">
                        <input class="inputArea" type="text" placeholder="图形验证码" v-model="picCode">
                        <view class="readProtocol" title="免责协议" @click="showProtocol">注册即同意 ▸ 免责协议</view>
                        <button class="functionBtn" @click="getCode">{{ waitSeconds === totalWaitSeconds ? '获取验证码' : waitSeconds + "秒后重新获取"}}</button>
                        <button class="functionBtn" :disabled="!isAgreeProtocol" form-type="submit">注册/ 登录</button>
                    </view>
                </form>
            </transition>
        </view>
    </transition>
</template>

<script>
    import { getImageCode, getSmsCode } from '@/api/login'

    export default {
        name: "LoginPanel",
        data() {
            return {
                showNotification: false,
                notificationContent: "",
                tempStuID: "",
                tempMobile: "",
                smsCode: "",
                picCode: "",
                picKey: "",
                picUrl: "",
                isShowCodeImg: false,
                totalWaitSeconds: 10,
                waitSeconds: 10,
                timer: null,
                isShowProtocol: false,
                isAgreeProtocol: true,
                protocolContent: `
▸ 免责协议

▸ 本协议由以下双方达成：

甲方：代码庄园（以下简称“甲方”）

乙方：用户（以下简称“乙方”）

▸ 鉴于：
甲方为乙方提供软件服务；
乙方将在甲方的软件中提交个人创作的文档。
双方经友好协商，达成以下免责协议：

▸ 软件使用：
a. 甲方授予乙方有限的、非独占的许可，以使用甲方提供的软件。
b. 乙方应同意遵守甲方对软件使用的相关规定，并承担因违反规定而产生的法律责任。

▸ 著作权声明：
a. 用户通过甲方的软件提交的文档，其著作权仍然归属于用户本人。
b. 甲方仅拥有使用权，除非获得乙方明确的书面同意，否则不得将其用于其他目的或转让给第三方。

▸ 免责声明：
a. 甲方不对乙方使用本软件而产生的任何间接、意外、特殊或后果性损害承担责任。
b. 甲方对乙方提交的文档的内容、准确性、合法性或可靠性进行审查，但不做任何担保或保证。
c. 乙方必须对其在软件中的行为和提交的文档承担全部责任，并承担因此产生的任何法律后果。

▸ 协议修订：
甲方保留随时修订本协议的权利。修订后的协议将在“代码庄园”软件或相关网站上发布。

▸ 终止协议：
双方一致同意，当甲方无法继续提供软件服务时，或乙方不再需要甲方的软件服务时，本协议将自动终止。

▸ 法律适用和争议解决：
本协议受中国法律管辖。如发生争议，双方应友好协商解决；协商不成的，任何一方均有权向有管辖权的人民政府提起诉讼。

▸ 乙方通过下载、安装、使用或以其他方式访问“代码庄园”软件，即表示乙方已阅读、理解并同意本免责协议的所有条款。
`
            };
        },
        methods: {
            async getPicCode() {
                const res = await getImageCode()
                const base64 = res[0]
                const key = res[1]
                this.picUrl = base64
                this.picKey = key
            },
            open() {
                this.$refs.popup.open('center')
            },
            confirm() {
                this.$refs.popup.close()
            },
            cancel() {
                this.$refs.popup.close()
            },
            hideLoginPanel() {
                this.$emit('close');
            },
            async confirmLogin(e) {
                if (!/^\w{6}$/.test(this.picCode) && this.picCode !== "test") {
                    this.showTempNotification("图形验证码格式不正确");
                    return;
                }

                const res = await getSmsCode(this.picCode, this.picKey)

                if (res.status === 200) {
                    uniCloud.callFunction({
                        name: "addUserInfo",
                        data: {
                            mobile: e.detail.value.mobile,
                            password: e.detail.value.password,
                        }
                    }).then(res => {
                        if (res.result.code) {
                            this.showTempNotification(`${res.result.msg} ▸ ${res.result.code}`);
                        } else {
                            this.showTempNotification("注册登录成功！");
                        }
                        if (res.result.code === 200) {
                            this.tempStuID = res.result.data.data[0]._id;
                            this.refreshStuInfo();
                        } else if (!res.result.code){
                            this.tempStuID = res.result.id;
                            this.refreshStuInfo();
                        }
                    })
                } else {
                    this.showTempNotification(res.message);
                }
            },
            showTempNotification(content) {
                this.notificationContent = content;
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            },
            refreshStuInfo() {
                uniCloud.callFunction({
                    name: "getUserInfo",
                    data: {
                        stuID: this.tempStuID,
                    }
                }).then(res => {
                    if (res.result.code === 200) {
                        this.$store.commit('user/setUserInfo', res.result.data.data[0])
                        this.showTempNotification(`${res.result.msg} ▸ ${res.result.code}`);
                    } else {
                        this.showTempNotification(res.result.msg);
                    }
                })
            },
            showCodeImage() {
                this.getPicCode();
                this.getPicCode();
                this.isShowCodeImg = true;
            },
            hideCodeImage() {
                this.isShowCodeImg = false;
            },
            getCode() {
                if (!/^1[3456789]\d{9}$/.test(this.tempMobile)) {
                    this.showTempNotification("手机号不正确");
                    return;
                }

                if (!this.timer && this.waitSeconds === this.totalWaitSeconds) {
                    this.getPicCode();
                    this.isShowCodeImg = true;

                    this.timer = setInterval(() => {
                        this.waitSeconds--;

                        if(this.waitSeconds === 0) {
                            clearInterval(this.timer);
                            this.timer = null;
                            this.waitSeconds = this.totalWaitSeconds;
                        }
                    }, 1000);
                }
            },
            cleanLocalStorage() {
                this.$store.commit('user/cleanUserInfo')
                this.showTempNotification("本地已登出");
            },
            refusePurchase() {
                this.showTempNotification("记得常签到哦~");
            },
            showAbout() {
                alert(
`
▸ 代码庄园

    - 本项目 2022 年 8 月 25 日上线，已参加讯飞星火杯并初步晋级 50 强！
    - 项目开源地址（暂定）：https://github.com/TianWen580/code-oasis
    
▸ 关于作者与核心开发者

    - 林天文
        - 个人网站：buluwasior.me
        - github：TianWen580
        - bilibili：布鲁瓦丝

    - 李化顺（讯飞星火杯团队代表）
        - github：ZS520L
        - bilibili：小海疼来啦

▸ 致谢 ❖

    - 极客湾数字生命：https://github.com/zixiiu/Digital_Life_Server

    - 感谢 Stardust_减 维护并公开的 TTS api：https://www.bilibili.com/video/BV1hp4y1K78E

    - OpenAI：https://openai.com/blog/teaching-with-ai

    - power by LLM, special love for 星火~

▸ 开源协议

    Apache License 2.0
`
                )
            },
            showProtocol() {
                this.isShowProtocol = !this.isShowProtocol;
            }
        },
    };
</script>

<style>
    .overlay {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 30%;
        min-width: 336px;
        height: 66%;
        transform: translate(-50%, -50%);
        border: none;
        background: rgba(232, 232, 232, 0.523);
        backdrop-filter: blur(26px);
        box-shadow: 0px 4px 16px 6px rgba(57, 73, 74, 0.15);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0px 4px 16px 6px rgba(57, 73, 74, 0.15);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .titleBar {
        position: absolute;
        top: 10%;
        left: 50%;
        white-space: nowrap;
        transform: translate(-50%, -50%);
        z-index: -1;
    }

    .content {
        padding: 20px;
    }

    .popup-content {
        padding: 20px;
    }

    .title {
        color: #333;
        text-align: center;
        font-family: deyihei;
        font-size: 26px;
        z-index: 1;
    }

    .returnBtn {
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 6px 9px;
        background: gray;
        color: white;
        cursor: pointer;
    }

    .returnBtn:hover {
        color: lightgray;
    }

    .loginForm {
        width: 90%;
        background: linear-gradient(90deg, #e6e8eb 10%, #deeae6e1 100%);
        backdrop-filter: blur(36px);
        border-bottom: 3px solid lightgray;
        border-radius: 16px;
        margin-bottom: 5%;
        box-shadow: 0px 0px 12px 4px rgba(0, 0, 0, 0.219);
        position: absolute;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        z-index: 190;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .loginForm:hover {
        box-shadow: 0px 0px 0px 1.5px rgba(0, 0, 0, 0.1);
    }

    .loginTitle {
        color: #fff;
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 20px;
    }

    .content {
        height: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .welcomeText {
        color: #3F48CC;
        font-family: deyihei;
        font-size: 20px;
        margin-bottom: 10px;
        white-space: nowrap;
        z-index: 1;
    }

    .inputArea {
        height: 20px;
        /* border: 1px solid #333; */
        border-radius: 10px;
        background-color: #fff;
        color: #333;
        margin-bottom: 16px;
        font-size: 16px;
        padding: 6px 20px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .inputArea:hover {
        box-shadow: 0px 0px 0px 2px #000;
    }

    .inputArea:active {
        background-color: lightgray;
    }

    .codeImg {
        position: absolute;
        top: -25%;
        height: 16%;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0px 0px 16px 0px #00000034;
        color: #333;
        margin-bottom: 16px;
        font-size: 16px;
        padding: 6px 20px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .functionBtn {
        width: 100%;
        height: 40px;
        border-radius: 40px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(90deg, #3f48cce2 0%, #7d31ff 100%);
        border: 1px solid #3F48CC;
        border-bottom: 2px solid #3F48CC;
        color: #fff;
        font-size: 16px;
        font-weight: 800;
        padding: 16px;
        margin-top: 10px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .functionBtn:hover {
        background: #fff;
        color: #333;
        border: 2px solid #000;
    }

    .functionBtn:active {
        background: #e6e8eb;
        color: #333;
        border: 1px solid #000;
    }

    .infoContainer {
        position: absolute;
        top: 22%;
        left: 2.5%;
        width: 95%;
        height: 78%;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow-y: auto;
        z-index: 190;
    }

    .infoContainer::-webkit-scrollbar {
		width: 0px;
	}

    .stuAvator {
        margin: 10px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid #fff;
        filter: drop-shadow(3px 0px 0px #7d31ff) drop-shadow(0px 3px 0px #95d155) drop-shadow(-3px 0px 0px #60b1e6) drop-shadow(0px -3px 0px #ffca26);
        z-index: -1;
    }

    .stuInfoRecord {
        background: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-radius: 16px;
        margin: 10px;
        align-items: center;
        z-index: -1;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .stuInfoRecord:hover {
        box-shadow: 0px 0px 1px 2px #7d31ff;
    }

    .logoutBtn {
        width: 16%;
        height: 3%;
        border-radius: 40px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #3f48cc;
        border: 1px solid #3F48CC;
        border-bottom: 2px solid #3F48CC;
        color: #fff;
        font-size: 16px;
        font-weight: 800;
        padding: 16px;
        margin: 10px 0;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .logoutBtn:hover {
        background: #fff;
        color: #333;
        border: 2px solid #000;
    }

    .RecordContainer {
        width: 88%;
        min-width: 266px;
        padding: 10px 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid lightgray;
        align-items: center;
        clip-path: inset(0 0 0 0 round 16px);
        z-index: -1;
    }

    .RecordKey {
        color: #333;
        font-size: 16px;
        font-weight: 800;
        margin-right: 6px;
        z-index: -1;
    }

    .RecordValue {
        color: gray;
        font-size: 16px;
        z-index: -1;
    }

    .aboutBtn {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }

    .aboutBtn:hover {
        color: #3F48CC;
    }

    .aboutBtn:active {
        color: #7d31ff;
    }

    .protocol {
        /* 按照原始字符串格式排版免责协议 */
        white-space: pre-wrap;
        position: absolute;
        top: 3%;
        left: 0;
        height: 50%;
        background: #fff;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.15);
        padding: 10px;
        font-family: songti;
        overflow-y: auto;
        z-index: 200;
    }

    .readProtocol {
        color: #3F48CC;
        font-size: 14px;
    }

    @media (max-width: 530px) {
        .overlay {
            width: 90%;
            height: 92%;
            border-radius: 16px;
        }
    }
</style>
