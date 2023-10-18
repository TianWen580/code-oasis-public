<template>
  <transition name="slide-fade">
      <view class="overlay">
          <transition name="slide-fade">
              <view v-if="showNotification" class="notification">
                  <span class="notificationIcon">◉</span> {{ this.notificationContent }}
              </view>
          </transition>
          <view class="returnBtn" @click="hidePopup">⨉</view>
          <view class="sliderContainer">
              <view class="sliderButton" @click="togglePage('browse')" :class="{ active: currentPage === 'browse' }">
                  浏览
              </view>
              <view class="sliderButton" @click="togglePage('create')" :class="{ active: currentPage === 'create' }">
                  创造
              </view>
          </view>
          <view class="pageContainer">
              <view class="page browse" v-if="currentPage === 'browse'">
                  <view class="topImg"></view>
                  <view class="topNC">
                      <view class="topADTitle">新课</view>
                      🦭OpenMMLab文档解读系列开放啦！
                  </view>
                  <view class="topAD" @click="togglePage('create')">
                      <view class="topADTitle">公告</view>
                      ⛺打造专属老师一起云游园游会！
                  </view>
                  <view class="codeoasisCardSeller">
                      <button class="card speedCard" @click="purchaseSpeedCard">
                          <label class="textLabel">永久加速包</label>
                          <label class="emojiLabel">⚡</label>
                      </button>
                      <button class="card powerCard" @click="purchasePowerCard">
                          <label class="textLabel">教学升级</label>
                          <label class="emojiLabel">🧑‍🏫</label>
                      </button>
                      <button class="card annualCard" @click="purchaseAnnualCard">
                          <label class="textLabel">教学升级 Pro</label>
                          <label class="emojiLabel">🦄</label>
                      </button>
                  </view>
                   <view v-for="(viewName, index) in this.$store.state.lesson.views" :key="index">
                      <view class="titleBar">
                          <view class="title">{{ index }}</view>
                          <span>{{ viewName.items.length }}</span>
                          <view class="betaLabel" v-if="viewName.isBeta">Beta</view>
                          <view class="toggleBtn" @click="toggleView(index)">●●●</view>
                      </view>
                      <view class="scrollContainer" v-if="!viewName.showGridView">
                          <view class="scrollContent">
                            <view class="functionalCardContainer" v-if="viewName.functional">
                                <view class="functionalCard" v-for="(functionalItem, index) in viewName.functional" :key="index" @click="handleFunctionalItem(functionalItem)">
                                    {{ index }}<span class="functionalLabel">❖</span>
                                </view>
                            </view>
                              <button
                                  class="card" 
                                  v-for="(lesson, index) in viewName.items" 
                                  :key="index"
                                  @click="showDetailPage(lesson, index)"
                                  @mouseover="showAddButton = true"
                                  @mouseleave="showAddButton = false"
                              >
                                  <label class="textLabel">{{ index }}</label>
                                  <label class="emojiLabel">{{ lesson.emoji }}</label>
                                  <transition name="fade">
                                    <button 
                                        class="addButton" 
                                        v-show="showAddButton" 
                                        @click.stop="addToStackedLessons(lesson, index)"
                                    >
                                      🛒{{ lesson.price==0 ? ' 免费' : ' ' + lesson.price + ' ￥' }}
                                    </button>
                                  </transition>
                              </button>
                          </view>
                      </view>
                      <transition name="fade">
                          <view class="gridContainer" v-if="viewName.showGridView">
                              <button
                                  class="card"
                                  v-for="(lesson, index) in viewName.items" 
                                  :key="index"
                                  @click="showDetailPage(lesson, index)"
                                  @mouseover="showAddButton = true"
                                  @mouseleave="showAddButton = false"
                              >
                                  <label class="textLabel">{{ index }}</label>
                                  <label class="emojiLabel">{{ lesson.emoji }}</label>
                                  <transition name="fade">
                                    <button 
                                        class="addButton" 
                                        v-show="showAddButton" 
                                        @click.stop="addToStackedLessons(lesson, index)"
                                    >
                                        🛒免费
                                    </button>
                                  </transition>
                              </button>
                          </view>
                      </transition>
                  </view>
                  <LessonDetailPage
                      v-show="isDetailPageVisible"
                      @close="hideDetailPage"
                      :selectedLesson="selectedLesson"
                      :selectedLessonIndex="selectedLessonIndex"
                      @update:lesson="updateLesson"
                      @update:index="updateIndex"
                      @update:isDetailPageVisible="updateIsDetailPageVisible"
                      >
                  </LessonDetailPage>
                </view>
                <view class="page create" v-show="currentPage === 'create'">
                    <view class="container">
                        <transition name="slide-fade">
                          <view class="dropdownList" v-if="showDropdown">
                            <view v-for="(item, index) in soundList" :key="index" class="dropdownItem" @click="refreshSelectedSection(item)">
                              <view class="avatorForSounds"></view>
                              <span class="soundIndex">{{ item }}</span>
                              <button class="playTestSoundBtn" @click.stop="platTestSound(item)" :disabled="playSoundTipText=='试听'? false : true">
                                  {{ playSoundTipText }}
                              </button>
                            </view>
                          </view>
                        </transition>
                        <view class="left-column">
                            <view class="subTitle">
                                <span class="subTitleText">上课规则</span>
                                <span class=subTitleCaption>合适的规则能够约束老师的行为，增强学生上课的体验感。占位符：{info1}：所选课程，{info2}：所选知识点，{stuAge}：学生年龄。</span>
                            </view>
                            <view class="section">
                                <view class="listBox">
                                    <view v-for="(record, index) in newRules" :key="index" class="listItem">
                                        <span class="listText">▸ {{ record }}</span>
                                        <view class="deleteRecordButton" @click="deleteRecord(index)">×</view>
                                    </view>
                                </view>
                                <view class="addRecordButton" @click="addRecord">+</view>
                            </view>
                            <view class="section">
                                <view class="paramBox">
                                    <view class="paramEditor">
                                        <span class="paramName">老师称呼</span>
                                        <input class="input" maxlength="12" placeholder="·" v-model="newTecName"/>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">课程名称</span>
                                        <input class="input" maxlength="16" placeholder="·" v-model="newLessonName"/>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">Emoji</span>
                                        <input class="input" maxlength="6" placeholder="·" v-model="newLessonEmoji"/>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">教材上传</span>
                                        <view class="input" ref="document">·</view>
                                        <view class="documenntsUploadBtn" @click="selectFolderFromFileBrowser">{{ documentsCount }} 份已上传</view>
                                    </view>
                                </view>
                                <view class="paramBox">
                                    <view class="paramEditor">
                                        <span class="paramName">期望定价</span>
                                        <input class="input" maxlength="3" placeholder="0" v-model="price"/>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">声线选择</span>
                                        <view class="documenntsUploadBtn" @click.stop="toggleDropdown">{{ tecSound }}</view>
                                        <view class="input">·ω·</view>
                                    </view>
                                </view>
                                <view class="paramBox">
                                    <view class="paramEditor">
                                        <view class="paramNameBox">
                                            <span class="paramName">自然世界感知</span>
                                            <span class=subTitleCaption>感知时间、天气等自然世界印象。有利于老师沉浸在角色中，并带给学生自然的感受。</span>
                                        </view>
                                        <select class="select" v-model="realWorldSense">
                                            <option value="true">开</option>
                                            <option value="false">关</option>
                                        </select>
                                    </view>
                                    <view class="paramEditor">
                                        <view class="paramNameBox">
                                            <span class="paramName">学生年龄</span>
                                            <span class=subTitleCaption>不同年龄的选择将引导老师采用不同的讲解方式，对于小学生往往讲得更有趣，对于中学生则更多严谨性，对于大学生更注意言辞。</span>
                                        </view>
                                        <select class="select" v-model="stuAge">
                                            <option value="5">幼稚园</option>
                                            <option value="13">中学</option>
                                            <option value="18">大学</option>
                                        </select>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">教材联想</span>
                                        <select class="select" v-model="documentAlign">
                                            <option value="true">开</option>
                                            <option value="false">关</option>
                                        </select>
                                    </view>
                                    <view class="paramEditor">
                                        <view class="paramNameBox">
                                            <span class="paramName">教材忠诚度</span>
                                            <span class="subTitleCaption">高忠诚度有利于从文档获取可靠记忆。</span>
                                        </view>
                                        <select class="select" v-model="documentLoyalty">
                                            <option value="0">最高</option>
                                            <option value="0.3">中等</option>
                                            <option value="0.7">灵活</option>
                                        </select>
                                    </view>
                                    <view class="paramEditor">
                                        <view class="paramNameBox">
                                            <span class="paramName">下课难度</span>
                                            <span class="subTitleCaption">简单：完成30%的作业即可下课。困难：完成60%的作业即可下课。不影响学生取得满分。</span>
                                        </view>
                                        <select class="select" v-model="difficulty">
                                            <option value="0.3">简单</option>
                                            <option value="0.6">困难</option>
                                        </select>
                                    </view>
                                </view>
                                <view class="paramBox">
                                    <view class="paramEditor">
                                        <span class="paramName">背景图 | 上午🌄</span>
                                        <view class="input" >·</view>
                                        <view class="documenntsUploadBtn" @click="selectImgFromFileBrowser4bg('morning')" ref="morning">上传</view>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">背景图 | 下午🏖️</span>
                                        <view class="input" >·</view>
                                        <view class="documenntsUploadBtn" @click="selectImgFromFileBrowser4bg('afternoon')" ref="afternoon">上传</view>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">背景图 | 晚间🌆</span>
                                        <view class="input" >·</view>
                                        <view class="documenntsUploadBtn" @click="selectImgFromFileBrowser4bg('evening')" ref="evening">上传</view>
                                    </view>
                                </view>
                                <view class="paramBox">
                                    <view class="paramEditor">
                                        <span class="paramName">简介Emoji①</span>
                                        <input class="input" maxlength="6" placeholder="选填" v-model="newLessonInfo1Emoji"/>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">简介标题①</span>
                                        <input class="input" maxlength="10" placeholder="选填" v-model="newLessonInfo1Title"/>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">简介详情①</span>
                                        <input class="input" maxlength="26" placeholder="选填" v-model="newLessonInfo1Detail"/>
                                    </view>
                                </view>
                                <view class="paramBox">
                                    <view class="paramEditor">
                                        <span class="paramName">简介Emoji②</span>
                                        <input class="input" maxlength="6" placeholder="选填" v-model="newLessonInfo2Emoji"/>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">简介标题②</span>
                                        <input class="input" maxlength="10" placeholder="选填" v-model="newLessonInfo2Title"/>
                                    </view>
                                    <view class="paramEditor">
                                        <span class="paramName">简介详情②</span>
                                        <input class="input" maxlength="26" placeholder="选填" v-model="newLessonInfo2Detail"/>
                                    </view>
                                </view>
                            </view>

                        </view>
                        <view class="right-column">
                            <view class="subTitle">
                                <span class="subTitleText">下一步 | 章节制定</span>
                                <span class=subTitleCaption>划分课程知识点，设置下课要求。请详细划分知识点，降低老师授课难度并让学生有更多选择。</span>
                            </view>
                            <view class="nextBtn" @click="showSetTitle">下一步▸</view>
                            <img class="imagePreview" :src=tecImg alt="形象预览" @click="selectImgFromFileBrowser"/>
                        </view>
                    </view>
                </view>
                <view class="page setTitle" v-show="isSetTitleVisible">
                    <SetTitleForNC
                        :newLessonPackage="newLessonPackage"
                        :newLessonName="newLessonName"
                        v-show="isSetTitleVisible"
                        @close="hideSetTitlePage"
                        @update:isSetTitleVisible="updateIsSetTitleVisible"
                        @confirm="onConfirmRecord"
                        >
                    </SetTitleForNC>
                </view>
            </view>
            <view class="stackedLessonsContainer" v-show="currentPage === 'browse'">
                <view class="scrollContent scrollcart">
                    <view class="cartTitle">🛒 我的探索</view>
                    <view v-for="(lesson, index) in this.$store.state.user.info.stackedLessons" :key="index">
                      <button class="levelNode" :class="{ 'delete': levelNodeStatus[index] }" @click="toggleLevelNode(index)">
                        {{ levelNodeStatus[index] ? '隐藏' : index }}
                      </button>
                    </view>
                </view>
                <view class="showAllStackedLessonsBtn" @click="showAllStackedLessons">爆</view>
            </view>
            <view class="page setTitle">
                <OpenMMLabDocQAPage
                    v-if="isOpenMMLabDocQAPageVisible"
                    @close="hideOpenMMLabDocQAPage"
                    @update:isOpenMMLabDocQAPageVisible="updateIsOpenMMLabDocQAPageVisible"
                    >
                </OpenMMLabDocQAPage>
            </view>
        </view>
  </transition>
</template>

  <script>
  import LessonDetailPage from './LessonDetailPage.vue';
  import SetTitleForNC from './SetTitleForNC.vue';
  import OpenMMLabDocQAPage from './OpenMMLabDocQAPage.vue';
  import axios from 'axios';

  export default {
    name: 'LessonCreator',
    components: {
      LessonDetailPage,
      SetTitleForNC,
      OpenMMLabDocQAPage,
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false,
      },
    },
    created() {
        //深拷贝
        this.newRules = JSON.parse(JSON.stringify(this.$store.state.setting.defaultLessonRules));
        //刷新课程市场
        this.$store.commit('lesson/refreshLessonViews');
    },
    mounted() {
			this.clickOutsideHandler = (event) => {
				const dropdownList = this.$el.querySelector('.dropdownList');
				if (dropdownList && !dropdownList.contains(event.target)) {
					this.showDropdown = false;
				}
			};
				document.addEventListener('click', this.clickOutsideHandler);
		},
    data() {
      return {
        showDropdown: false,
        soundList: [
          "丹恒", "克拉拉", "穹", "「信使」", "史瓦罗", "彦卿", "晴霓", "杰帕德", "素裳", "绿芙蓉",
          "罗刹", "艾丝妲", "黑塔", "丹枢", "希露瓦", "白露", "费斯曼", "停云", "可可利亚", "景元",
          "螺丝咕姆", "青镞", "公输师傅", "卡芙卡", "大毫", "驭空", "半夏", "奥列格", "娜塔莎", "桑博",
          "瓦尔特", "阿兰", "伦纳德", "佩拉", "卡波特", "帕姆", "帕斯卡", "青雀", "三月七", "刃", "姬子",
          "布洛妮娅", "希儿", "星", "符玄", "虎克", "银狼", "镜流", "「博士」", "「大肉丸」", "九条裟罗",
          "佐西摩斯", "刻晴", "博易", "卡维", "可莉", "嘉玛", "埃舍尔", "塔杰·拉德卡尼", "大慈树王",
          "宵宫", "康纳", "影", "枫原万叶", "欧菲妮", "玛乔丽", "珊瑚", "田铁嘴", "砂糖", "神里绫华",
          "罗莎莉亚", "荒泷一斗", "莎拉", "迪希雅", "钟离", "阿圆", "阿娜耶", "阿拉夫", "雷泽", "香菱",
          "龙二", "「公子」", "「白老先生」", "优菈", "凯瑟琳", "哲平", "夏洛蒂", "安柏", "巴达维",
          "式大将", "斯坦利", "毗伽尔", "海妮耶", "爱德琳", "纳西妲", "老孟", "芙宁娜", "阿守", "阿祇",
          "丹吉尔", "丽莎", "五郎", "元太", "克列门特", "克罗索", "北斗", "埃勒曼", "天目十五", "奥兹",
          "恶龙", "早柚", "杜拉夫", "松浦", "柊千里", "甘雨", "石头", "纯水精灵？", "羽生田千鹤", "莱依拉",
          "菲谢尔", "言笑", "诺艾尔", "赛诺", "辛焱", "迪娜泽黛", "那维莱特", "八重神子", "凯亚", "吴船长",
          "埃德", "天叔", "女士", "恕筠", "提纳里", "派蒙", "流浪者", "深渊使徒", "玛格丽特", "珐露珊",
          "琴", "瑶瑶", "留云借风真君", "绮良良", "舒伯特", "荧", "莫娜", "行秋", "迈勒斯", "阿佩普",
          "鹿野奈奈", "七七", "伊迪娅", "博来", "坎蒂丝", "埃尔欣根", "埃泽", "塞琉斯", "夜兰", "常九爷", "悦",
          "戴因斯雷布", "笼钓瓶一心", "纳比尔", "胡桃", "艾尔海森", "艾莉丝", "菲米尼", "蒂玛乌斯", "迪奥娜",
          "阿晃", "阿洛瓦", "陆行岩本真蕈·元素生命", "雷电将军", "魈", "鹿野院平藏", "「女士」", "「散兵」",
          "凝光", "妮露", "娜维娅", "宛烟", "慧心", "托克", "托马", "掇星攫辰天君", "旁白", "浮游水蕈兽·元素生命",
          "烟绯", "玛塞勒", "百闻", "知易", "米卡", "西拉杰", "迪卢克", "重云", "阿扎尔", "霍夫曼", "上杉",
          "久利须", "嘉良", "回声海螺", "多莉", "安西", "德沃沙克", "拉赫曼", "林尼", "查尔斯", "深渊法师",
          "温迪", "爱贝尔", "珊瑚宫心海", "班尼特", "琳妮特", "申鹤", "神里绫人", "艾伯特", "萍姥姥", "萨赫哈蒂",
          "萨齐因", "阿尔卡米", "阿贝多", "anzai", "久岐忍", "九条镰治", "云堇", "伊利亚斯", "埃洛伊", "塞塔蕾",
          "拉齐", "昆钧", "柯莱", "沙扎曼", "海芭夏", "白术", "空", "艾文", "芭芭拉", "莫塞伊思", "莺儿",
          "达达利亚", "迈蒙", "长生", "阿巴图伊", "陆景和", "莫弈", "夏彦", "左然"
        ],
        playSoundTipText: "试听",
        notificationContent: '',
        currentPage: 'browse',
        isDetailPageVisible: false,
        isSetTitleVisible: false,
        isOpenMMLabDocQAPageVisible: false,
        showNotification: false,
        selectedLesson: {},
        selectedLessonIndex: 0,
        showAddButton: false,
        levelNodeStatus: {},
        newLessonName: '',
        newTecName: '',
        newLessonEmoji: '',
        tecImg: 'https://mp-e0ed877f-b5e3-4609-ba60-27ead9d4d8e8.cdn.bspapp.com/static/tec4.png',
        documentsCount: 0,
        morningImg: 'https://mp-e0ed877f-b5e3-4609-ba60-27ead9d4d8e8.cdn.bspapp.com/static/roomEarlyMorning1.png',
        afternoonImg: 'https://mp-e0ed877f-b5e3-4609-ba60-27ead9d4d8e8.cdn.bspapp.com/static/roomAfternoon1.png',
        eveningImg: 'https://mp-e0ed877f-b5e3-4609-ba60-27ead9d4d8e8.cdn.bspapp.com/static/roomEvening1.png',
        newRules: [],
        newLessonPackage: {},
        documentLoyalty: 0,
        difficulty: 0.3,
        realWorldSense: true,
        documentAlign: true,
        newLessonInfo1Emoji: '',
        newLessonInfo1Title: '',
        newLessonInfo1Detail: '',
        newLessonInfo2Emoji: '',
        newLessonInfo2Title: '',
        newLessonInfo2Detail: '',
        stuAge: 5,
        price: 0,
        tecSound: "凯瑟琳",
        isAD: false,
      };
    },
    methods: {
      toggleDropdown() {
				this.showDropdown = !this.showDropdown;
			},
      refreshSelectedSection(newVal) {
				this.toggleDropdown();
        this.tecSound = newVal;
			},
      showSetTitle() {
        const rulesFormated = this.newRules.map(item => '-' + item);
        this.newLessonPackage[this.newLessonName] = {
          emoji: this.newLessonEmoji,
          tecImage: this.tecImg,
          background: {
            'morning': this.morningImg,
            'afternoon': this.afternoonImg,
            'evening': this.eveningImg,
          },
          number: 1,
          info: [
            [this.newLessonInfo1Emoji, this.newLessonInfo1Title, this.newLessonInfo1Detail],
            [this.newLessonInfo2Emoji, this.newLessonInfo2Title, this.newLessonInfo2Detail],
          ],
          progress: "0 %",
          position: { x: 90, y: 70 },
          contentTitles: [
            ['待开发', 0, 0],
          ],
          rules: rulesFormated,
          tecName: this.newTecName,
          realWorldSense: this.realWorldSense,
          documentAlign: this.documentAlign,
          documentLoyalty: this.documentLoyalty,
          difficulty: this.difficulty,
          stuAge: this.stuAge,
          tecSound: this.tecSound,
          price: this.price,
          popularity: 0,
          isAD: this.isAD,
          author: this.$store.state.user.info._id,
        };

        for (let key in this.newLessonPackage[this.newLessonName]) {
          if (this.newLessonPackage[this.newLessonName][key] === '') {
            this.showTempNotification(key + ': 不能为空')
            return;
          }
        }

        this.isSetTitleVisible = true;
      },
      onConfirmRecord(updatedLessonPackage) {
        this.newLessonPackage = updatedLessonPackage;
        this.currentPage = 'browse';
        //添加newLessonPackage到view中的园游会
        this.$store.commit('lesson/addNewLesson', {
            name: "[未审核]" + this.newLessonName,
            lesson: this.newLessonPackage[this.newLessonName],
            userID: this.$store.state.user.info._id,
        });
        this.showTempNotification("作者一人审核，若有忽露请见谅！=·ω·=");
      },
      hidePopup() {
        this.$emit('close');
      },
      togglePage(page) {
        this.currentPage = page;
        this.sliderPosition = page === 'create' ? '50%' : '0%'; // Set slider position based on the selected page
      },
      toggleView(index) {
        this.$store.commit('lesson/toggleGridView', index)
      },
      showDetailPage(lesson, index) {
        this.selectedLesson = lesson;
        this.selectedLessonIndex = index;
        this.isDetailPageVisible = true;
      },
      hideDetailPage() {
        this.isDetailPageVisible = false;
      },
      hideSetTitlePage() {
        this.isSetTitleVisible = false;
      },
      updateLesson(newLesson) {
        this.$emit('update:lesson', newLesson);
      },
      updateIndex(newIndex) {
        this.$emit('update:index', newIndex);
      },
      updateIsDetailPageVisible(newValue) {
        this.$emit('update:isDetailPageVisible', newValue);
      },
      updateIsSetTitleVisible(newValue) {
        this.$emit('update:isSetTitleVisible', newValue);
      },
      toggleLevelNode(index) {
        if (this.levelNodeStatus[index]) {
          this.$store.commit('user/deleteFromStackedLessons', index);
          this.$delete(this.levelNodeStatus, index);
          return;
        }

        this.$set(this.levelNodeStatus, index, !this.levelNodeStatus[index]);

        if (this.levelNodeStatus[index]) {
          const listener = (event) => {
            if (!event.target.classList.contains('levelNode')) {
              this.$set(this.levelNodeStatus, index, false);
              document.removeEventListener('click', listener);
            }
          };
          document.addEventListener('click', listener);
        }
      },
      addToStackedLessons(lesson, index) {
        const modifiedLesson = { name: index, ...lesson };
        this.$store.commit('user/addToStackedLessons', {
            index: index,
            lesson: modifiedLesson,
        });
      },
      addRecord() {
        const newRecord = prompt("⛺新规则：");
        if (newRecord) {
          this.newRules.push(newRecord);
        }
      },
      deleteRecord(index) {
        this.newRules.splice(index, 1);
      },
      selectImgFromFileBrowser() {
        this.showTempNotification("暂时不支持文件上传哦")
        return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            this.tecImg = event.target.result;
          };
        };
        input.click();
      },
      selectFolderFromFileBrowser() {
        this.showTempNotification("暂时不支持文件上传哦")
        return;
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.directory = true;
        input.accept = '.md';
        input.onchange = (event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            this.documentsCount += 1;
          };
        };
        input.click();
      },
      selectImgFromFileBrowser4bg(type) {
        this.showTempNotification("暂时不支持文件上传哦")
        return;
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.directory = true;
        input.accept = 'image/*';
        input.onchange = (event) => {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            if(type === 'morning') {
              this.morningImg = event.target.result;

            } else if(type === 'afternoon') {
              this.afternoonImg = event.target.result;
            } else if(type === 'evening') {
              this.eveningImg = event.target.result;
            }
          };
        };
        input.click();
      },
      showTempNotification(content) {
        this.notificationContent = content;
				this.showNotification = true;
				setTimeout(() => {
					this.showNotification = false;
				}, 3000); // 3秒后自动隐藏
			},
      showAllStackedLessons() {
          this.$store.commit('user/showAllStackedLessons');
          this.showTempNotification("已爆出全部探索");
      },
      classFilter() {
          this.showTempNotification("暂时未开放园游会大面板哦");
      },
      OpenMMLabDocQA() {
          this.isOpenMMLabDocQAPageVisible = true;
      },
      OpenMMLabDocRetrieve() {
          this.showTempNotification("暂时未开放智能文档溯源哦");
      },
      handleFunctionalItem(functionalItem) {
          if (typeof this[functionalItem] === 'function') {
              this[functionalItem]();
          }
      },
      updateIsOpenMMLabDocQAPageVisible(newValue) {
          this.isOpenMMLabDocQAPageVisible = newValue;
      },
      hideOpenMMLabDocQAPage() {
          this.isOpenMMLabDocQAPageVisible = false;
      },
      async platTestSound(soundIndex) {
          const params = {
              speaker: soundIndex,
              text: "今天是疯狂星期四，威我五十",
              format: "wav",
              length: "1.0",
              noise: "0.5",
              noisew: "0.9",
              sdp_ratio: "0.2",
          };

          try {
              this.playSoundTipText = "稍等";
              const response = await axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/generateTTS', params, { responseType: 'arraybuffer' });
              const audioBlob = new Blob([response.data], { type: 'audio/wav' });
              const audioURL = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioURL);
              this.playSoundTipText = "试听";
              audio.play();
          } catch (error) {
              console.error('Error generating audio:', error);
          }
      },
      purchaseSpeedCard() {
        window.open('https://dwz.cn/kg3rNSPi', '_blank');
      },
      purchasePowerCard() {
        window.open('https://dwz.cn/ysk2OQcc', '_blank');
      },
      purchaseAnnualCard() {
        window.open('https://dwz.cn/ikfw80NB', '_blank');
      },

    },
  };
</script>

<style scoped>
  .topBar {
      background: none;
  }

  .title {
      flex: 1;
      text-align: left;
      font-size: x-large;
      font-weight: 800;
  }

  .sliderContainer {
      display: flex;
      background: rgba(238, 238, 238, 0.626);
      backdrop-filter: blur(36px);
      -webkit-backdrop-filter: blur(10px);
      padding: 4px;
      border-radius: 40px;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      margin: 30px 3px;
      z-index: 200;
  }

  .sliderButton {
      font-size: small;
      font-weight: 800;
      padding: 6px 16px;
      color: rgb(160, 160, 160);
      border-radius: 40px;
      text-align: center;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
  }

  .active {
      color: #fff;
      background: rgba(28, 28, 28, 0.18);
      backdrop-filter: blur(36px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0px 2px 16px 1px rgba(0, 0, 0, 0.1);
  }

  .pageContainer {
      display: flex;
      border-radius: 20px;
      width: 70%;
      top: 4%;
      left: 25%;
      flex-direction: column;
      height: 100%;
  }

  .page {
      overflow-y: auto;
      overflow-x: hidden;
      transition: all 0.3s ease;
  }

  .browse {
    padding-top: 16px;
    padding-bottom: 200px;
  }

  .topImg {
    border-radius: 20px;
      height: 30%;
      background: url("https://mp-e0ed877f-b5e3-4609-ba60-27ead9d4d8e8.cdn.bspapp.com/static/cover2.png") no-repeat center;
      background-size: cover;
  }

  .topImg:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.1) 86%, rgba(255, 255, 255, 1) 100%);
      pointer-events: none;
      z-index: 10;
    }

  .topAD, .topNC {
      font-size: 14px;
      color: #ca7777;
      text-align: center;
      background: #f8ebeb;
      border-radius: 16px;
      text-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
      padding: 10px;
      margin: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
  }

    /* Add a hover effect to scale up the ad and change the box-shadow on hover */
  .topAD:hover, .topNC:hover {
      transform: scale(1.01, 1.13);
      box-shadow: 0px 0px 0px 2px #7d31ff;
  }

  .topAD:active, .topNC:active {
      color: #3F48CC;
  }

  .topNC {
    color: #00b176;
    background: #e3f5ef;
  }

  .topADTitle {
    font-family: deyihei;
    font-weight: 800;
  }

  .titleBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 36px; /* 您可以根据需要更改这个值 */
  }

  .codeoasisCardSeller {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin: 0 20px;
      border-radius: 36px;
  }

  .speedCard {
      width: 180px !important;
      background: linear-gradient(135deg, #ffe550 0%, #ffca26 50%) !important;
      border: 2px solid #00000054 !important;
      box-shadow: 0px 0px 6px 2px #ffca26;
  }

  .speedCard:hover {
      width: 220px !important;
  }

  .speedCard:active {
      background: #ffca26 !important;
  }

  .powerCard {
      width: 180px !important;
      background: linear-gradient(135deg, #50c994 0%, #85cf5c 50%) !important;
      border: 2px solid #00000054 !important;
      box-shadow: 0px 0px 6px 2px #85cf5c;
  }

  .powerCard:active {
      background: #50c994 !important;
  }

  .powerCard:hover {
      width: 220px !important;
  }

  .annualCard {
      width: 180px !important;
      background: linear-gradient(135deg, #64c9ff 0%, #60b1e6 50%) !important;
      border: 2px solid #00000054 !important;
      box-shadow: 0px 0px 6px 2px #71fef8;
  }

  .annualCard:active {
      background: #60b1e6 !important;
  }

  .annualCard:hover {
      width: 220px !important;
  }

  .scrollContent {
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      padding: 10px;
      border-radius: 20px;
      width: 100%;
      overflow: auto;
      white-space: nowrap;
      height: 170px;
  }

  .scrollContainer {
      margin: 3px;
      border-radius: 20px;
      background: linear-gradient(90deg, #fff 80%, #f5f5f5 100%);
  }

  .page::-webkit-scrollbar,
  .stackedLessonsContainer::-webkit-scrollbar,
  .scrollContent::-webkit-scrollbar {
    width: 0px;
    height: 3px;
  }

	.page::-webkit-scrollbar-track,
    .stackedLessonsContainer::-webkit-scrollbar,
	.scrollContent::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px #e6e8eb7a;
		border-radius: 10px;
	}

	.page::-webkit-scrollbar-thumb,
    .stackedLessonsContainer::-webkit-scrollbar,
	.scrollContent::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: #e6e8eb;
		box-shadow: inset 0 0 6px #e6e8eb;
	}

	.page::-webkit-scrollbar-thumb:hover,
    .stackedLessonsContainer::-webkit-scrollbar,
	.scrollContent::-webkit-scrollbar-thumb:hover {
		background: rgba(0,0,0,0.8);
	}

  .gridContainer {
      display: grid;
      padding: 10px;
      border-radius: 20px;
      width: 95%;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-gap: 10px;
  }

  .card {
      border: 2px solid #D8DEFF;
      background: #333;
      border: 3px solid #333;
      display: flex;
      align-items: center;
      border-radius: 30px;
      font-weight: 800;
      white-space: nowrap;
      cursor: pointer;
      margin: 10px;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      width: 220px;
      height: 140px;
      flex-shrink: 0;
      padding: 16px;
      position: relative;
      transition: all 0.3s ease 0.1s;
  }

  .card:hover {
      box-shadow: 0px 0px 0px 2px #7d31ff;
  }

  .functionalCardContainer {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      background: #e6e8eb;
      height: 140px;
      padding: 10px 0;
      border-radius: 36px;
  }

  .functionalCard {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      font-weight: 800;
      font-size: large;
      cursor: pointer;
      letter-spacing: 0.2em;
      width: 140px;
      height: 140px;
      margin: 10px;
      color: #0000008e;
      border-radius: 30px;
      background: linear-gradient(135deg, #50c79f 0%, #95d155 50%);
      transition: all 0.3s ease 0.1s;
  }

  .functionalCard:hover {
      color: #333;
      box-shadow: 0px 0px 0px 2px #7d31ff;
  }

  .functionalCard:active {
      background: #7d31ff;
  }

  .functionalLabel {
    color: #ffe651;
		text-shadow: 0px 0px 10px #ffc626;
  }

  .toggleBtn {
      display: inline-block;
      font-size: 10px;
      color: #333;
      background: #fff;
      padding: 10px 30px;
      border-radius: 16px 16px 10px 10px;
      text-align: center;
      position: relative;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
  }

  .toggleBtn:hover {
      color: lightblue;
      background: #3F48CC;
  }

  .toggleBtn:active {
      background: #7d31ff;
      color: #fff;
  }

  .emojiLabel {
    font-size: 90px;
    position: absolute;
    right: 10px;
    top: -20px;
  }

  .textLabel {
      font-size: large;
      font-weight: 800;
      color: #fff;
      text-align: left;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }

  .stackedLessonsContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 18%;
      width: 100%;
      position: absolute;
      bottom: -3%;
      left: 0;
      z-index: 100;
  }

  .scrollcartContainer {
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      border-radius: 20px;
      overflow-y: auto;
      white-space: nowrap;
  }

  .scrollcart {
      border-bottom: 1px solid #50996f35;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(10px);
      background: linear-gradient(90deg, #9eeebb 0%, #ffe6c394 70%);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      padding-right: 6%;
      width: 86%;
      height: 58px;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
  }

  .scrollcart:hover {
        box-shadow: 0px 0px 1px 2px #7d31ff;
        transform: scale(1.01, 1.05);
    }

    .scrollcart::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }

    .showAllStackedLessonsBtn {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 5%;
        top: 12px;
        font-size: 20px;
        font-weight: 800;
        background: #ffffffa7;
        backdrop-filter: blur(36px);
        -webkit-backdrop-filter: blur(10px);
        border: 2px solid #fff;
        box-shadow: 0px 0px 10px 0px #33300031;
        border-radius: 50%;
        color: gray;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }
    
    .showAllStackedLessonsBtn:hover {
        color: #333;
        transform: scale(1.1, 1.1);
    }

    .levelNode {
        margin-right: 16px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .levelNode.delete {
        border: 2px solid #fff;
        background: #e6e8eb;
        box-shadow: 0px 4px 1px 4px lightgray;
        color: #333;
    }

  .cartTitle {
      font-size: 20px;
      font-weight: 800;
      color: #333;
      text-align: left;
      display: flex;
      margin: 0 16px;
      align-items: center;
  }

  .addButton {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #fffdeb;
    box-shadow: 0px 4px 4px 0px #33300031;
    color: #333;
    border: none;
    border-radius: 40px 16px 30px 16px;
    font-size: 16px;
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
}

.addButton:hover {
    color: #fff;
    background: #7d31ff;
}

.create {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 66px;
  height: 100%;
  padding: 20px;
}

.create::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(66px + 30%);
  background: linear-gradient(45deg, rgba(255, 0, 0, 0.228), rgba(255, 166, 0, 0.26), rgba(0, 128, 0, 0.292), rgba(0, 255, 255, 0.247), rgba(0, 128, 0, 0.21), rgba(0, 255, 255, 0.224), rgba(0, 0, 255, 0.215), rgba(238, 130, 238, 0.228), rgba(255, 0, 0, 0.228));
  filter: blur(20px);
  z-index: -1;
}

.container {
  /* background: lightblue; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}

.left-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 60%;
}

.subTitle {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-left: 16px;
  margin-bottom: 10px;
}

.subTitleText {
  font-size: 20px;
  font-weight: 800;
  color: #45ac89;
  margin-left: 10px;
  transition: all 0.3s ease 0.1s;
}

.paramBox {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  width: 96%;
  background: #fff;
  margin-top: 2%;
  border-radius: 10px;
  box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
}

.paramBox:hover {
  box-shadow: 0px 0px 0px 2px #7d31ff;
}

.paramEditor {
  display: flex;
  position: relative;
  flex-direction: row;
  border-bottom: 1px solid lightgray;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow: hidden;
  clip-path: inset(0 0 0 0 round 10px);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
}

.input {
  width: 40%;
  border: none;
  border-radius: 16px;
  text-align: center;
  padding: 10px;
  font-size: 16px;
  color: #3F48CC;
  cursor: pointer;
}

.select {
  width: 40%;
  border: none;
  border-radius: 16px;
  text-align: center;
  margin: 10px;
  font-size: 16px;
  color: #45ac89;
  outline: none;
  cursor: pointer;
}

.right-column {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 10px;
  height: 100%;
  width: 40%;
}

.nextBtn {
  position: absolute;
  bottom: 31px;
  right: 10px;
  background: #333;
  box-shadow: 0px 4px 16px 2px rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(0, 0, 0, 0.18);
  padding: 10px 26px;
  border-radius: 10px 20px 20px 10px;
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
}

.nextBtn:hover {
  background: linear-gradient(90deg, #3f48cce2 0%, #7d31ff 100%);
  color: #D8DEFF;
  transform: scale(1.1, 1.1);
}

.imagePreview {
  margin: 0px 20px;
  height: 100%;
  border: 2px solid #3F48CC;
  border-radius: 16px;
  box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.1);
  background: linear-gradient(311deg, #9eeebb 0%, #ffe6c394 70%);
  object-fit: cover;
  /* transform: translateX(66%); */
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
}

.imagePreview:hover {
  background: linear-gradient(90deg, #3f48cce2 0%, #7d31ff 100%);
  border: 5px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0px 4px 1px 4px #D8DEFF;
}

.imagePreview:active {
  border: 2px solid #fff;
  background: #fff;
  box-shadow: 0px 4px 4px 4px #3F48CC;
}

.documenntsUploadBtn {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: #e6e8eb;
  color: #333;
  border: none;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.1s ease 0.1s;
}

.documenntsUploadBtn:hover {
  background: linear-gradient(90deg, #3f48cce2 0%, #7d31ff 100%);
  color: #D8DEFF;
  transform: scale(1.1, 1.1);
}

.dropdownList {
		position: absolute;
		top: 10%;
		left: 15%;
		width: 70%;
		height: 80%;
    	overflow-y: auto;
		background: #ffffffc8;
		backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 20px;
		z-index: 999;
		padding: 6px;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
	}

	.dropdownItem {
		color: #333;
		padding: 10px;
		border-radius: 16px;
		cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
		transition: all 0.3s ease;
	}

	.dropdownItem:hover {
		background: #e6e8eb;
		font-weight: 800;
		text-shadow: 0px 2px 4px #00000045;
		color: #000;
	}

	/* 这是整个滚动条的样式 */
	.dropdownList::-webkit-scrollbar {
		width: 6px;
	}

	/* 这是滚动条轨道的样式 */
	.dropdownList::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
		border-radius: 10px;
	}

	/* 这是滚动条滑块的样式 */
	.dropdownList::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: rgba(0,0,0,0.5);
		box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
	}

	/* 滑块在hover时的样式 */
	.dropdownList::-webkit-scrollbar-thumb:hover {
		background: rgba(0,0,0,0.8);
	}

  .avatorForSounds {
    width: 46px;
    height: 46px;
    background: linear-gradient(90deg, #9eeebb 0%, #ffe6c394 70%);
    border: 2px solid #fff;
    border-radius: 50%;
    object-fit: cover;
    transition: all 0.3s ease 0.1s;
  }

  .playTestSoundBtn {
    width: 20%;
    height: 30px;
    background: transparent;
    border: #0000008e 1px solid;
    border-radius: 6px;
    font-size: medium;
    object-fit: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .playTestSoundBtn:hover {
    background: #fff;
  }

  .playTestSoundBtn:active {
    background: #0000008e;
  }
  
  .soundIndex {
    font-size: 20px;
    font-weight: 800;
    text-align: center;
    width: 70%;
  }

@media (max-width: 530px) {
    .topImg {
        width: 95%;
        margin-left: 2.5%;
        height: 20%;
    }

    .pageContainer {
        width: 100%;
    }

    .gridContainer {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    .browse {
       padding-top: 48px;
    }

    .subTitleText, .subTitleCaption, .imagePreview {
        display: none;
    }

    .left-column {
        position: absolute;
        top: 10%;
        width: 80%;
        padding: none;
        height: 73%;
    }

    .list {
    }

    .nextBtn {
        bottom: 10px;
        right: 0;
        border-radius: 20px;
    }

    .nextBtn:hover {
        transform: none;
    }

    .showAllStackedLessonsBtn {
        width: 40px;
        height: 40px;
        top: 16px;
        left: 5%;
    }
}
</style>
