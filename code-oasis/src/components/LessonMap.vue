<template>
    <view class="LessonMap" @mouseover="showAddLessonBtn" @mouseout="hideAddLessonBtn">
        <transition name="slide-fade">
            <view v-if="showNotification" class="notification">
                <span class="notificationIcon">◉</span> {{ this.notificationContent }}
            </view>
        </transition>
        <view class="MapContainer" :style="mapContainerStyle">
            <view
                class="levelNode"
                v-for="(lesson, index) in this.$store.state.user.info.stackedLessons"
                :key="index"
                :style="nodeStyle(lesson)"
                @mousedown.prevent="startDragging(lesson, $event)"
                @click="refreshSelectedLesson(index, lesson)"
                >
                {{ lesson.name }}
            </view>
        </view>
        <transition>
            <button
                class="addLessonBtn"
                v-show="isShowButton"
                @click="showPopup"
                >+
            </button>
        </transition>
    </view>
  </template>

  <script>
    export default {
        name: "LessonMap",
        data() {
            return {
                showNotification: false,
                notificationContent: "",
                dragging: false,
                mousePosition: { x: 0, y: 0 },
                mapPosition: { x: 0, y: 0 },
                activeLevel: null,
                isShowButton: true,
            };
        },
        computed: {
            mapContainerStyle() {
                return {
                transform: `translate(${this.mapPosition.x}px, ${this.mapPosition.y}px)`,
                };
            },
        },
        methods: {
            refreshSelectedLesson(index, lesson) {
                this.$store.commit("user/setSelectedLesson", {
                    index: index,
                    lesson: lesson,
                });
            },
            drag(e) {
                if (!this.dragging) return;
                const dx = e.clientX - this.mousePosition.x;
                const dy = e.clientY - this.mousePosition.y;
                this.mousePosition.x = e.clientX;
                this.mousePosition.y = e.clientY;
                this.activeLevel.position.x += dx;
                this.activeLevel.position.y += dy;
            },
            startDragging(lesson, e) {
                this.dragging = true;
                this.mousePosition.x = e.clientX;
                this.mousePosition.y = e.clientY;
                this.activeLevel = lesson;
                lesson.isDragging = true;
                document.addEventListener("mousemove", this.drag);
                document.addEventListener("mouseup", this.endDragging);
            },
            endDragging() {
                this.dragging = false;
                if (this.activeLevel) {
                    this.activeLevel.isDragging = false; // 设置节点为非拖动状态
                }
                this.$forceUpdate(); // 强制Vue进行组件更新
                document.removeEventListener("mousemove", this.drag);
                document.removeEventListener("mouseup", this.endDragging);
            },
            nodeStyle(lesson) {
                // 根据节点的拖动状态来改变节点样式
                return {
                    position: "absolute",
                    top: `${lesson.position.y}px`,
                    left: `${lesson.position.x}px`,
                    padding: lesson.isDragging ? "2px 12px" : "0 10px", // 当拖动时，padding为20px，否则为10px
                };
            },
            showAddLessonBtn() {
                this.isShowButton = true;
            },
            hideAddLessonBtn() {
                this.isShowButton = false;
            },
            showTempNotification(content) {
                this.notificationContent = content;
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            },
            showPopup() {
                if (this.$store.state.user.info._id === "尚未登录") {
					this.showTempNotification("请先登录");
                } else {
                    this.$emit("update:isPopupVisible", "true");
                }
            },
        },
    };
  </script>

<style scoped>
    .LessonMap {
        position: relative;
        width: 400px;
        height: 232px;
        overflow: hidden;
        cursor: grab;
        background: linear-gradient(90deg, #9eeebb 0%, #ffe6c394 70%);
        border-bottom: 1px solid #50996f35;
        border-radius: 6px 6px 6px 16px;
        margin-top: 18px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }
    .LessonMap:hover {
        box-shadow: 0px 0px 1px 2px #7d31ff;
    }
    .MapContainer {
        position: relative;
        width: max-content;
        height: max-content;
    }

    .addLessonBtn {
        background: linear-gradient(
            60deg,
            #ff0000b5 0%,
            #ff8000b9 14.28%,
            #ffff0076 28.57%,
            #00ff0077 42.86%,
            #3330ff4f 57.14%,
            #4c0082b1 71.43%,
            #ff8000b9 85.72%,
            #ff0000b5 100%
        );
        background-size: 200%;
        background-position: 0 0;
        border: 5px solid #fff;
        border-radius: 40px 16px 16px 16px;
        color: #3F48CC;
        font-size: 16px;
        font-weight: 800;
        position: absolute;
        box-shadow: 0px 4px 4px 0px #fff;
        bottom: 10px;
        right: 10px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .addLessonBtn:hover {
        color: #fffdeb;
        background-position: 100% 0;
    }

    .addLessonBtn:active {
        box-shadow: 0px 1px 1px 1px #fff;
    }

    @media (max-width: 1220px) {
        .LessonMap {
            width: 90%;
            border-radius: 16px;
        }

        .LessonMap:hover {
            box-shadow: 0px 0px 1px 2px #7d31ff;
        }
    }
</style>


