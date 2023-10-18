<template>
    <transition name="slide-fade">
        <view class="SetTitleForNC">
            <view class="returnBtn" @click="hideDetailPage">返回</view>
            <view class="titleBar">
                <view class="title">章节制定</view>
            </view>
            <view class="contentPage">
                <view class="section">
                    <draggable v-model="records" class="listBox">
                        <view v-for="(record, index) in records" :key="index" class="listItem">
                            <view class="contentIndex">{{ index + 1 }}</view>
                            <span class="listText">{{ record[0] }} | {{ record[2] }}</span>
                            <view class="deleteRecordButton" @click="deleteRecord(index)">×</view>
                        </view>
                    </draggable>
                </view>
                <view class="recordFormContainer">
                    <view class="paramNameBox">
                        <span class="paramName">章节与难度</span>
                        <span class="subTitleCaption">章节名很关键。老师第一眼看到的参考资料，以及老师对当前课程内容的认知都由章节名决定。每章节的星星数决定了学生成功完成多少作业才可以满分。具体拿到多少可以下课由课程难度决定。</span>
                    </view>
                    <view class="recordForm">
                        <view class="formContainer">
                            <span class="paramName">章节名</span>
                            <input type="text" placeholder="" class="recordInput" v-model="charpter">
                        </view>
                        <view class="formContainer">
                            <span class="paramName">星星数</span>
                            <input type="number" placeholder="0" class="recordInput" v-model="mark">
                        </view>
                        <view class="addRecordButton" @click="addRecord">● 录入</view>
                    </view>
                </view>
                <view class="addRecordButton" @click="confirmRecord">提交课程</view>
            </view>
        </view>
    </transition>
</template>

<script>
    import draggable from "vuedraggable";

    export default {
        name: "SetTitleForNC",
        components: {
            draggable,
        },
        data() {
            return {
                records: [],
                charpter: "",
                mark: 0,
            };
        },
        methods: {
            hideDetailPage() {
                this.$emit('close');
            },
            getLessonDetail() {
                return this.lesson;
            },
            addRecord() {
                this.records.push([this.charpter, 0, this.mark]);
                this.charpter = "";
                this.mark = none;
            },
            deleteRecord(index) {
                this.records.splice(index, 1);
            },
            confirmRecord() {
                this.newLessonPackage[this.newLessonName]['contentTitles'] = this.records;
                this.$emit('confirm', this.newLessonPackage);
                this.hideDetailPage();
            },
        },
        props: {
            newLessonPackage: {
                type: Object,
                default: {},
            },
            newLessonName: {
                type: String,
                default: "",
            },
        },
        created() {
            if (this.newLessonPackage[this.newLessonName] && this.newLessonPackage[this.newLessonName]['contentTitles']) {
                this.records = [...this.newLessonPackage[this.newLessonName]['contentTitles']];
            }
        },

    };
</script>

<style>
    .SetTitleForNC {
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

    .section {
        flex-direction: row;
        width: 70%;
    }

    .listBox {
        height: 66%;
        width: 100%;
        overflow-y: auto;
    }

    .recordFormContainer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 30%;
    }

    .recordForm {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        align-items: center;
        background: #fff;
        padding-bottom: 76px;
        box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
        width: 100%;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .recordForm:hover {
        box-shadow: 0px 0px 0px 2px #7d31ff;
    }

    .formContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: relative;
        align-items: center;
		border-bottom: 1px solid lightgray;
        width: 100%;
        clip-path: inset(0 0 0 0 round 10px);
    }

    .recordInput {
        color: #3F48CC;
        text-align: center;
        padding: 10px;
        width: 80%;
    }

    .paramNameBox {
        width: 100%;
    }

    .paramName {
        width: 20%;
    }

    .contentIndex {
        background: #e6e8eb;
    }

    @media (max-width: 530px) {
		.SetTitleForNC {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .contentPage {
            flex-direction: column;
        }

        .section {
            width: 92%;
            height: 30%;
        }

        .recordFormContainer {
            width: 100%;
        }
    }
</style>