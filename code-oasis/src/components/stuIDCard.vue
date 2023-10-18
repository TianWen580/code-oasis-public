<template>
        <view class="stuIDCard" @mouseover="showStuID" @mouseout="hideStuID">
        <span class="topText">
            庄 园 铭 文
            <br>
            <span class="gradeText">{{ levelTitles[this.$store.state.user.info.level] + "   " }}</span>
            <span class="gradeText" v-for="n in (this.$store.state.user.info.level + 1)" :key="'level-' + n">◍</span>
            <span class="gradeText" v-for="n in (4 - this.$store.state.user.info.level)" :key="'empty-' + n">○</span>
        </span>
        <transition name="fade">
            <span class="topText stuIDText" v-show="isStuIDShow">{{ this.$store.state.user.info._id }}</span>
        </transition>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                isStuIDShow: false,
                levelTitles: {
                    0: "初出茅庐",
                    1: "瞥见朝阳",
                    2: "蒸蒸日上",
                    3: "风华正茂",
                    4: "一代宗师",
                }
            };
        },
        methods: {
            showStuID() {
                this.isStuIDShow = true;
            },
            hideStuID() {
                this.isStuIDShow = false;
            },
        },
    }
</script>

<style scoped>
    .stuIDCard {
        border-radius: 16px 6px 6px 6px;
        background: linear-gradient(180deg, #50c79f 0%, rgba(0, 0, 0, 0.00) 100%), url("https://mp-e0ed877f-b5e3-4609-ba60-27ead9d4d8e8.cdn.bspapp.com/static/scene1.png"), lightgray 50%;
        background-repeat: no-repeat;
        background-size: cover;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.15);
        width: 400px;
        height: 165px;
        flex-shrink: 0;
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .topText {
        align-self: flex-start;
        padding-top: 25px;
        padding-left: 30px;
        color: #FFF;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        font-family: songti;
        font-size: 18px;
        font-style: normal;
        font-weight: 800;
        line-height: normal;
    }

    .gradeText {
		font-family: songti;
        color: #fff;
        font-weight: 300;
        filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.25));
    }

    .stuIDText {
        align-self: center;
        padding: 25px 30px;
        font-family: Inter;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        user-select: text;
    }

    @media (max-width: 1220px) {
        .stuIDCard {
            width: 90%;
            border-radius: 16px;
        }
    }
</style>