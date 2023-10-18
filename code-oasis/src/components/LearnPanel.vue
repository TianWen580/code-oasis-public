<template>
    <view>
      <transition name="flash">
        <view class="overlay" v-if="isLearnPanelShow">
            <transition name="slide-fade">
                <view v-if="showNotification" class="notification">
                    <span class="notificationIcon">✓</span> {{ this.notificationContent }}
                </view>
            </transition>
            <transition name="fade">
                <view class="preparingOutlineCover" v-show="!isOutlinePrepared">教学大纲整理中...</view>
            </transition>
            <img :src="getClassroomImage()" alt="Image bg" class="classroomImg">
          <view class="returnBtn" @click="closeDiv">⨉</view>
            <view>
                <view class="returnBtn containerReturnBtn" @click="toggleHistoryView" v-show="isShowHistory">关闭</view>
                <transition name="slide-fade">
                    <view
                        v-show="isShowHistory"
                        class="historyView"
                    >
                        <view v-for="(history, index) in historyRecords" :key="index" class="historyRecord">
                            <span class="historyIndex">{{ index + 1 }}</span>
                            <vue-markdown class="historyText" :source="history"></vue-markdown>
                        </view>
                    </view>
                </transition>
            </view>
            <view>
                <view class="returnBtn containerReturnBtn" @click="toggleDocumentView" v-if="isShowDocument">关闭</view>
                <transition name="slide-fade">
                    <view
                        v-if="isShowDocument"
                        class="historyView documentView"
                    >
                        <view class="documentDirLabel">{{ documentName }}</view>
                        <view class="documentContainer">
                            <vue-markdown class="documentContent">{{ documentContent.trim() === "" ? "暂无" : documentContent }}</vue-markdown>
                        </view>
                    </view>
                </transition>
            </view>
            <view>
                <view class="returnBtn containerReturnBtn" @click="toggleOutlineView" v-if="isShowOutline">关闭</view>
                <transition name="slide-fade">
                    <view
                        v-if="isShowOutline"
                        class="historyView documentView"
                    >
                        <view class="documentContainer">
                            <vue-markdown class="documentContent">{{ outlineContent.trim() === "" ? "生成中..." : outlineContent }}</vue-markdown>
                        </view>
                    </view>
                </transition>
            </view>
          <view class="horLayout topBar">
            <view class="topInfo">
              <span class="teacherStatus">
                • 老师在线
              </span>
            </view>
            <view class="topInfo">
              <span class="title">
                {{ this.$store.state.user.info.selectedSectionInfo[0] }} | {{ this.$store.state.user.info.selectedSectionInfo[1][0] }}{{ this.$store.state.user.info.preference.isAudio ? '' : ' 🔇' }}
              </span>
            </view>
            <view>
                <span class="marks" v-for="n in marks" :key="n">⭐</span>
                <span class="markNum">要求▸{{ qualifiedMarks }}</span>
            </view>
          </view>
          <view class="menuBtn" @click="toggleMenu">◧</view>
            <transition name="slide-fade">
                <view class="menu" v-if="isShowMenu">
                    <view class="menuItemContainer" @click="toggleOutlineView" v-show="!isSkipOutline">
                        <view class="menuItem">教学大纲</view>
                        <span class="menuItemEmoji">◂</span>
                    </view>
                    <view class="menuItemContainer" @click="toggleAiOnePanel">
                        <view class="menuItem">aiOne ！</view>
                        <span class="menuItemEmoji">○</span>
                    </view>
                    <view class="menuItemContainer" @click="toggleHistoryView">
                        <view class="menuItem">历史记录</view>
                        <span class="menuItemEmoji">⋇</span>
                    </view>
                    <view class="menuItemContainer" @click="toggleDocumentView" v-show="documentAlign">
                        <view class="menuItem">教材联想</view>
                        <span class="menuItemEmoji">◉</span>
                    </view>
                    <view class="menuItemContainer" @click="resetState">
                        <view class="menuItem">重新开始</view>
                        <span class="menuItemEmoji">↻</span>
                    </view>
                </view>
            </transition>
            <transition name="slide-fade">
                <aiOnePanel
                    v-show="isShowAiOnePanel"
                    @close="hideAiOnePanel"
                    >
                </aiOnePanel>
            </transition>
            <view class="background">
                <transition name="slide-fade">
                    <view class="codeBlocks">
                        <view
                            class="codeBlock"
                            v-for="(code, index) in codeBlocks"
                            :key="index"
                            :style="{ transform: `translateX(-${activeIndex * 104.5}%)` }"
                            >
                            <textarea
                                class="codeEdit"
                                ref="codeEdit"
                                v-model="codeBlocks[index]"
                                placeholder="你也可以去Vs Code、Xcode、jetbrain系列等IDE测试代码..."
                                >
                            </textarea>
                            <view class="codeBtns">
                                <view class="dropdownButtonContainer">
                                    <button class="dropdownButton" @click="toggleDropdown">
                                    语言 | {{ codeLang }}
                                    </button>
                                    <view class="dropdownList" v-if="showDropdown">
                                        <view
                                            v-for="item in dropdownItems"
                                            :key="item"
                                            class="dropdownItem"
                                            @mouseover="hoverDropdownItem(item)"
                                            @click="selectCodeLang(item)"
                                        >
                                        {{ item }}
                                        </view>
                                    </view>
                                </view>
                                <button class="codeBtn" @click="runCode(code, codeLang)">运行</button>
                                <button class="codeBtn copyBtn" :data-clipboard-text="code" @click="copyAndAsk(index)">举手</button>
                            </view>
                            <pre class="previewOutput" ref="pre">🖥️ ﹥ <br>{{ codeOutputDisplay }}</pre>
                        </view>
                    </view>
                </transition>
                <view class="prevBtn" @click="prevCodeBlock" v-if="codeBlocks.length > 0">◂</view>
                <view class="nextBtn" @click="nextCodeBlock" v-if="codeBlocks.length > 0">▸</view>
            </view>
            <view class="massages">
                <view class="name tecName" @click="toggleHistoryView">{{ tecName }}</view><br/>
                <img :src="tecImg" alt="Image 1" class="aiImg" :style="aiImgStyle"/>
                <transition name="fade">
                    <view class="emotionTipTool" v-show="isEmotionChanged">{{ emotionDict[currentEmotion] }}</view>
                </transition>
                <view class="aiMsg" :style="aiMsgStyle" @click="nextSentence">
                    <span class="typing-text" v-if="!processingResponse">{{ animateText }}</span>
                    <span class="blinking-cursor" v-if="!processingResponse"></span>
                    {{ processingResponse ? '( 静静思考着... )' : ''}}
                    <span class="nextSentenceText" v-if="!processingResponse && !isAnimating">· {{ isLastSentence ? '静静听着回答...' : '下一句' }}</span>
                </view>
                <view class="name stuName" @click="toggleHistoryView">我</view><br/>
                <img :src="stuImg" alt="Image 2" class="stuImg" :style="stuImgStyle"/>
                <view class="stuMsg" :style="stuMsgStyle">
                    <view class="InferenceInputBtnsContainer">
                        <button class="InferenceInputBtn" :disabled="isThinking" @click="sendInferInput(inferenceInputsList[0])">
                            <span class="inferInputIcon">▸</span>{{ isInferencingInput ? "..." : inferenceInputsList[0] }}
                        </button>
                        <button class="InferenceInputBtn" :disabled="isThinking" @click="sendInferInput(inferenceInputsList[1])">
                            <span class="inferInputIcon">▸</span>{{ isInferencingInput ? "..." : inferenceInputsList[1] }}
                        </button>
                        <button class="InferenceInputBtn" :disabled="isThinking" @click="sendInferInput(inferenceInputsList[2])">
                            <span class="inferInputIcon">▸</span>{{ isInferencingInput ? "..." : inferenceInputsList[2]}}
                        </button>
                    </view>
                    <view class="textEdit">
                        <input
                        type="text" class="inputBox" placeholder="▸ 自由发言"
                        v-model="userMessage"
                        @focus="focusInput"
                        @blur="blurInput"
                        @keydown.enter.prevent="sendMessageFlask"
                        >
                        <button class="sendBtn" :disabled="isThinking" @click="sendMessageFlask">发送</button>
                    </view>
                    <view class="tipMsg">
                        <button v-for="(tip, index) in tipList" :key="index" class="tipBtn" :disabled="isThinking" @click="tipToSending(tip)">
                        {{ tip }}
                        </button>
                        <button class="tipBtn codeEntranceBtn" @click="toggleCodeBlock">>_</button>
                        <button class="tipBtn aiOneBtn" @click="toggleAiOnePanel">ai.</button>
                        <button class="tipBtn outlineBtn" v-show="!isSkipOutline" @click="toggleOutlineView">大纲</button>
                        <button class="tipBtn functionBtn" @click="toggleHistoryView">历史</button>
                        <button class="tipBtn functionBtn" v-show="documentAlign" @click="toggleDocumentView">联想</button>
                    </view>
                </view>
            </view>
        </view>
      </transition>
    </view>
  </template>

    <script>
    import ClipboardJS from 'clipboard';
    import axios from 'axios';
    import qs from 'qs';
    import VueMarkdown from 'vue-markdown';
    import hljs from 'highlight.js';
    import aiOnePanel from './aiOnePanel.vue';

    export default {
        name: "LearnPanel",
        components: {
            VueMarkdown,
            hljs,
            aiOnePanel,
        },
        mounted() {
            new ClipboardJS('.copyBtn');
            hljs.configure({
                languages: {
                    javascript: require('highlight.js/lib/languages/javascript'),
                    python: require('highlight.js/lib/languages/python'),
                    go: require('highlight.js/lib/languages/go'),
                    c: require('highlight.js/lib/languages/c'),
                    cpp: require('highlight.js/lib/languages/cpp'),
                    java: require('highlight.js/lib/languages/java'),
                    php: require('highlight.js/lib/languages/php'),
                    ruby: require('highlight.js/lib/languages/ruby'),
                    rust: require('highlight.js/lib/languages/rust'),
                    typescript: require('highlight.js/lib/languages/typescript'),
                }
            });
        },
        data() {
            return {
                notificationContent: '',
                showNotification: false,
                receivedMessage: [""],
                tecName: "",
                userMessage: "",
                processingResponse: false,
                aiMsgStyle: { background: 'linear-gradient(90deg, #c0ffd8 0%, #b9ddc6e5 36%)' },
                stuMsgStyle: { background: 'linear-gradient(90deg, #d8deffc8 0%, #ead8ff 100%)' },
                aiImgStyle: { height: '46%', opacity: 1 },
                stuImgStyle: { height: '46%', opacity: 1 },
                isInputFocused: false,
                count: 0,
                codeBlocks: [],
                activeIndex: 0,
                code: '',
                codeOutput: '',
                isRunningCode: false,
                tipList: [],
                inferenceInputsList: [
                    "老师好，我们直接开始上课吧",
                    "老师好，上课前我有问题想问您",
                    "老师好，这节课我想多做点练习",
                ],
                isInferencingInput: false,
                currentSentence: 0,
                isLastSentence: true,
                animateText: '',
                audioStack: [],
                currentAudio: null,
                currentAudioIndex: 0,
                currentEmotion: 0,
                emotionDict: {
                    0: "😋",
                    1: "😫",
                    2: "😡",
                    3: "🥲",
                    4: "😯",
                    5: "☺️",
                },
                isEmotionChanged: false,
                isAnimating: false,
                isThinking: false,
                responseContent: '',
                message: [],
                usrConversasions: [],
                conversations: [],
                showDropdown: false,
                dropdownItems: ['py3', 'go', 'c', 'cpp', 'java', 'js', 'php', 'rb', 'rs', 'ts'],
                codeLang: 'py3',
                isShowHistory: false,
                isShowDocument: false,
                isShowOutline: false,
                isSkipOutline: false,
                isOutlinePrepared: false,
                outlineContent: '',
                isShowMenu: false,
                isShowAiOnePanel: false,
                historyRecords: [],
                timeZone: '',
                tecImg: '',
                stuImg: '',
                rules: [],
                bgImgSet: {},
                realWorldSense: true,
                qualifiedMarks: 0,
                tecSound: '',
                marks: 0,
                difficulty: 0.3,
                lessonEmoji: '',
                documentAlign: true,
                documentLoyalty: 0,
                documentContent: '',
                documentName: '',
                stuAge: 5,
                allowEnding: false,
            };
        },
        methods: {
            resetState() {
                if (this.$store.state.user.info.preference.isOutline === true && this.$store.state.user.info.isPro === true && this.isSkipOutline === false) {
                    this.prepareOutline();
                }

                this.showNotification = false;
                this.receivedMessage = ["你好同学~"];
                this.userMessage = '';
                this.result = '';
                this.processingResponse = false;
                this.aiMsgStyle = { background: 'linear-gradient(90deg, #c0ffd8 0%, #b9ddc6e5 36%)' };
                this.stuMsgStyle = { background: 'linear-gradient(90deg, #d8deffc8 0%, #ead8ff 100%)' };
                this.aiImgStyle = { height: '46%', opacity: 1 };
                this.stuImgStyle = { height: '46%', opacity: 1 };
                this.isInputFocused = false;
                this.count = 0;
                this.codeBlocks = [];
                this.code = '';
                this.output = '';
                this.currentSentence = 0;
                this.isLastSentence = true;
                this.animateText = '';
                this.audioStack = [];
                this.currentAudio = null;
                this.currentAudioIndex = 0;
                this.currentEmotion = 0;
                this.isEmotionChanged = false;
                this.inferenceInputsList = [
                    "老师好，我们直接开始上课吧",
                    "老师好，上课前我有问题想问您",
                    "老师好，这节课我想多做点练习",
                ],
                this.isInferencingInput = false;
                this.isAnimating = false;
                this.isThinking = false;
                this.responseContent = '';
                this.usrConversasions = [];
                this.conversations = [];
                this.showDropdown = false;
                this.codeLang = 'py3';
                this.isShowHistory = false;
                this.isShowDocument = false;
                this.isShowOutline = false;
                this.isSkipOutline = false;
                this.outlineContent = '';
                this.isShowMenu = false;
                this.isShowAiOnePanel = false;
                this.historyRecords = [];
                this.timeZone = '';
                this.realWorldSense = true;
                this.qualifiedMarks = 0;
                this.marks = 0;
                this.lessonEmoji = '';
                this.documentContent = '';
                this.documentName = '';
                this.isShowDocument = false;
                this.isShowMenu = false;
                this.isResetBtnShow = false;
                this.isResetAble = false;
                this.allowEnding = false;
                this.selectedSection = ["还没决定哦",""];

                axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/reset')
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
            },
            focusInput() {
                this.isInputFocused = true;
            },
            blurInput() {
                this.isInputFocused = false;
            },
            closeDiv() {
                if (confirm("请确定达到下课要求再关闭哦")) {
                    this.showTempNotification("再会~");
                    setTimeout(() => {
                        this.resetState();
                        this.$emit('update:isLearnPanelShow', false);
                    }, 1500);
                }
            },
            getAllText(conversations) {
                let history = '';
                for (let i = 0; i < conversations.length; i++) {
                    history += conversations[i] + '\n';
                }
                return history;
            },
            async sendMessageFlask() {
                if (this.userMessage.trim() === "" || this.isThinking) {
                    return;
                }
                this.codeBlocks = [];
                this.currentSentence = 0;
                this.isThinking = true;
                this.addToHistory('我: ' + this.userMessage);
                const message = [
                    this.$store.state.user.info.selectedSectionInfo[0],
                    this.$store.state.user.info.selectedSectionInfo[1][0],
                    this.userMessage,
                    this.rules,
                    this.timeZone,
                    this.tecName,
                    this.realWorldSense,
                    this.documentLoyalty,
                    this.stuAge,
                    this.documentAlign,
                    this.allowEnding,
                    this.$store.state.user.info.preference.llmType,
                ];
                this.processingResponse = true;
                this.userMessage = "";
                try {
                    let response;
                    response = await axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/llm', {
                        prompt: message
                    });
                    let aiMsg;
                    aiMsg = response.data[0];
                    this.documentContent = response.data[1];
                    this.documentName = response.data[2]['source'];
                    if(aiMsg.includes('⭐')) {
                        this.marks += 1;
                        if(this.marks >= this.qualifiedMarks) {
                            this.showTempNotification("恭喜你，可以自主下课啦！");
                            this.$store.commit('user/refreshMarks', this.marks);
                            this.allowEnding = true;
                        }
                    }
                    this.addToHistory(this.tecName + ": " + aiMsg);
                    this.getInferencedInputs(aiMsg);
                    const sentences = aiMsg.split(/[。？]/);
                    if (this.$store.state.user.info.preference.isAudio) {
                        await this.loadTTS2Stack(sentences);
                    }
                    this.receivedMessage = sentences
                        .map(sentence => sentence.trim())
                        .filter(sentence => sentence.length > 0);
                    this.extractCodeBlocks(this.receivedMessage);
                } catch (error) {
                    console.error("Error occurred:", error);
                }
                this.processingResponse = false;
                this.count += 1;
                this.isThinking = false;
            },
            getInferencedInputs(message) {
                this.isInferencingInput = true;
                const title = this.$store.state.user.info.selectedSectionInfo[0] + "-" + this.$store.state.user.info.selectedSectionInfo[1][0];
                axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/InferInputGPT', {
                    prompt: [
                        message,
                        title,
                        this.$store.state.user.info.preference.llmType,
                    ]
                })
                .then(response => {
                    this.inferenceInputsList = response.data;
                    this.isInferencingInput = false;
                })
                .catch(error => {
                    this.isInferencingInput = false;
                    console.error(error);
                });
            },
            hoverDropdownItem(item) {
                this.codeLang = item;
            },
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            },
            selectCodeLang(lang) {
                this.codeLang = lang;
                this.showDropdown = false;
            },
            runCode(code, lang) {
                this.isRunningCode = true;
                var data = {
                    code: code,
                    token: "066417defb80d038228de76ec581a50a",
                    stdin: "",
                    language: "15",
                    fileext: lang
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
                        this.codeOutput = response_dict['errors'];
                    } else {
                        if (response_dict['output'].trim() === '') {
                            this.showTempNotification("看起来没有输出哦~");
                            this.codeOutput = response_dict['output'];
                        } else {
                            this.codeOutput = response_dict['output'];
                        }
                    }
                })
                .catch((error) => {
                    console.log('request fail', error);
                })
                .finally(() => {
                    this.isRunningCode = false;
                });
            },
            copyAndAsk(codeBlockIndex) {
                const codeText = this.$refs.codeEdit[codeBlockIndex].value;
                const codeResult = this.$refs.pre[codeBlockIndex].innerText;
                this.userMessage = `
                这是我的代码：
                \`\`\`
                ${codeText}
                \`\`\`
                运行结果是：
                ${codeResult}
                `
                this.sendMessageFlask();
            },
            extractCodeBlocks(message) {
                const codeBlockPattern = /```(?:[^\n]*\n)?([\s\S]*?)```/gs;
                let match;
                while ((match = codeBlockPattern.exec(message)) !== null) {
                    this.codeBlocks.push(match[1]);
                }
            },
            tipToSending(text) {
                this.userMessage = text;
                this.sendMessageFlask();
            },
            nextSentence() {
                if (!this.processingResponse && !this.isAnimating) {
                    if (this.currentSentence < this.receivedMessage.length - 1) {
                        this.currentSentence++;
                        this.animateAIMessage();
                    } else {
                        this.isLastSentence = true;
                    }
                }
            },
            removeMdCodeBlocks(text) {
                const pattern = /```.*?```/g;
                const result = text.replace(pattern, '');
                return result;
            },
            async loadTTS2Stack(messages) {
                this.audioStack = [];

                const params = {
                    speaker: this.tecSound,
                    textlist: messages,
                    format: "wav",
                    length: "1.0",
                    noise: "0.5",
                    noisew: "0.9",
                    sdp_ratio: "0.2",
                };

                try {
                    const response = await axios.post('https://dingo-endless-ghoul.ngrok-free.app/api/generateTTSList', params, { responseType: 'json' });
                    const audioStackData = response.data.data;

                    for (let i = 0; i < messages.length - 1; i++) {
                        const audioDataStr = atob(audioStackData[i][0]);
                        const audioBuffer = new ArrayBuffer(audioDataStr.length);
                        const audioData = new Uint8Array(audioBuffer);
                        for (let j = 0; j < audioDataStr.length; j++) {
                            audioData[j] = audioDataStr.charCodeAt(j);
                        }
                        const audioBlob = new Blob([audioData], { type: 'audio/wav' });
                        const audioURL = URL.createObjectURL(audioBlob);
                        const emotion = parseInt(audioStackData[i][1], 10);
                        this.audioStack.push([audioURL, emotion]);
                    }
                } catch (error) {
                    console.error('Error generating audio:', error);
                }

                this.currentAudioIndex = 0;
            },
            async playTTSFromStack() {
                if (this.audioStack.length > 0) {
                    if (this.currentAudioIndex < this.audioStack.length) {
                        const audioURL = this.audioStack[this.currentAudioIndex][0];

                        if (this.currentAudio) {
                            this.currentAudio.pause();
                            this.currentAudio.currentTime = 0;
                        }

                        const audio = new Audio(audioURL);
                        this.currentAudio = audio;
                        this.currentEmotion = this.audioStack[this.currentAudioIndex][1];
                        this.currentAudio.play();
                        this.currentAudioIndex++;
                    }
                }
            },
            async animateAIMessage() {
                const message = this.receivedMessage[this.currentSentence];

                if (this.currentAudio) {
                    this.currentAudio.pause();
                    this.currentAudio.currentTime = 0;
                    this.currentAudio = null;
                }
                if (message !== '' && message && message !== '你好同学~' && this.$store.state.user.info.preference.isAudio) {
                    this.playTTSFromStack();
                }

                let i = 0;
                this.animateText = '';
                this.isAnimating = true;

                const typing = setInterval(() => {
                    if (i < message.length) {
                        this.animateText += message[i];
                        i++;
                    } else {
                        clearInterval(typing);
                        this.isAnimating = false;

                        if (this.currentSentence === this.receivedMessage.length - 1) {
                            this.isLastSentence = true;
                        } else {
                            this.isLastSentence = false;
                        }
                    }
                }, 50);
            },
            getClassroomImage() {
                const currentHour = new Date().getHours();

                if (currentHour >= 7 && currentHour < 12) {
                    this.timeZone = '上午'
                    return this.bgImgSet[['morning']];
                } else if (currentHour >= 12 && currentHour < 19) {
                    this.timeZone = '下午'
                    return this.bgImgSet[['afternoon']] ;
                } else {
                    this.timeZone = '大晚上'
                    return this.bgImgSet[['evening']];
                }
            },
            toggleHistoryView() {
                this.isShowHistory = !this.isShowHistory;
                this.isShowDocument = false;
                this.isShowOutline = false;
                this.isShowMenu = false;
            },
            toggleDocumentView() {
                this.isShowDocument = !this.isShowDocument;
                this.isShowHistory = false;
                this.isSHowOutline = false;
                this.isShowMenu = false;
            },
            toggleOutlineView() {
                this.isShowOutline = !this.isShowOutline;
                this.isShowHistory = false;
                this.isShowDocument = false;
                this.isShowMenu = false;
            },
            showMenu() {
                this.isShowMenu = true;
            },
            hideMenu() {
                this.isShowMenu = false;
            },
            toggleMenu() {
                this.isShowMenu = !this.isShowMenu;
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
            prevCodeBlock() {
                this.activeIndex = (this.activeIndex - 1 + this.codeBlocks.length) % this.codeBlocks.length;
            },
            nextCodeBlock() {
               this.activeIndex = (this.activeIndex + 1) % this.codeBlocks.length;
            },
            showTempNotification(content) {
                this.notificationContent = content;
				this.showNotification = true;
				setTimeout(() => {
					this.showNotification = false;
				}, 3000); // 3秒后自动隐藏
			},
            toggleCodeBlock() {
                this.codeBlocks.push("");
            },
            sendInferInput(message) {
                this.userMessage = message;
                this.sendMessageFlask();
            },
            hideAiOnePanel() {
                this.isShowAiOnePanel = false;1
            },
            toggleAiOnePanel() {
                // this.showTempNotification("暂未开放 aiOne")
                this.isShowAiOnePanel = !this.isShowAiOnePanel;
            },
            setOutline(outline) {
                this.outlineContent = outline;
            },
            prepareOutline() {
                // 准备课程大纲
                const data = [
                    this.$store.state.user.info.selectedSectionInfo[0],
                    this.$store.state.user.info.selectedSectionInfo[1][0],
                ];
                axios({
                    url: "https://dingo-endless-ghoul.ngrok-free.app/api/prepareOutline",
                    method: 'post',
                    data: {
                        prompt: data,
                    },
                })
                .then((response) => {
                    if (response.data.data.trim() === "") {
                        this.setOutline("大纲生成出错：" + response.data.message);
                    } else {
                        this.setOutline(response.data.data);
                    }
                })
                .catch((error) => {
                    console.log('request fail', error);
                    this.setOutline("大纲生成出错：" + error.message);
                })
            },
            skipOutlinePrepare() {
                this.isSkipOutline = true;
                this.isOutlinePrepared = true;
            },
        },
        props: {
            isLearnPanelShow: {
                type: Boolean,
                default: false,
            },
        },
        watch: {
            userMessage(newValue, oldValue) {
                if (newValue.length > 0 && oldValue.length === 0) {
                    this.aiMsgStyle.background = 'linear-gradient(90deg, #c0ffd8 0%, #b9ddc6e5 36%)';
                    this.aiMsgStyle.color = '#31a36a';
                    this.aiImgStyle.height = '46%';
                    this.aiImgStyle.opacity = 0.5;
                    this.stuImgStyle.height = '50%';
                    this.stuImgStyle.opacity = 1;
                }
            },
            isInputFocused(val) {
                if (val) {
                    this.stuMsgStyle.background = 'linear-gradient(180deg, #7A82FF 0%, #7d31ffb3 100%)';
                    this.aiMsgStyle.background = 'linear-gradient(90deg, #c0ffd8 0%, #b9ddc6e5 36%)';
                    this.aiImgStyle.height = '46%';
                    this.aiMsgStyle.color = '#31a36a';
                    this.aiImgStyle.opacity = 0.5;
                    this.stuImgStyle.height = '50%';
                    this.stuImgStyle.opacity = 1;
                    this.stuMsgStyle.color = '#fff';
                } else {
                    this.stuMsgStyle.background = 'linear-gradient(90deg, #d8deffc8 0%, #ead8ff 100%)';
                    this.stuMsgStyle.color = '#3F48CC';
                }
            },
            processingResponse(val) {
                if (val) {
                    this.aiMsgStyle.background = 'linear-gradient(135deg, #50c994 0%, #85cf5ced 50%)';
                    this.aiImgStyle.height = '50%';
                    this.aiImgStyle.opacity = 1;
                    this.aiMsgStyle.color = '#fff';
                    this.stuImgStyle.height = '46%';
                    this.stuImgStyle.opacity = 0.5;
                }
            },
            receivedMessage(newVal) {
                if (newVal.length > 0) {
                    this.animateAIMessage();
                }
            },
            historyRecords: function() {
                this.$nextTick(() => {
                    this.$refs.historyView.scrollTop = this.$refs.historyView.scrollHeight;
                });
            },
            '$store.state.user.info.selectedLesson'(newValue) {
                this.tecImg = newValue.tecImage;
                this.tecName = newValue.tecName;
                if(newValue.rules == "") {
                    this.rules = this.$store.state.setting.defaultLessonRules;
                } else {
                    this.rules = newValue.rules;
                }
                this.bgImgSet = newValue.background;
                this.realWorldSense = newValue.realWorldSense;
                this.difficulty = newValue.difficulty;
                this.lessonEmoji = newValue.emoji;
                this.documentAlign = newValue.documentAlign;
                this.documentLoyalty = newValue.documentLoyalty;
                this.stuAge = newValue.stuAge;
                this.tecSound = newValue.tecSound;
            },
            tecImg(newValue) {
                this.stuImg = newValue[0].replace('.png', 'stu.png');
            },
            '$store.state.user.info.selectedSectionInfo'(newValue) {
                this.qualifiedMarks = newValue[1][2];
                this.qualifiedMarks = Math.round(this.difficulty * this.qualifiedMarks);
                this.marks = newValue[1][1];
            },
            marks(newValue) {
                if(newValue > this.$store.state.user.info.selectedSectionInfo[1][2]) {
                    this.marks = this.$store.state.user.info.selectedSectionInfo[1][2];
                    return;
                }
            },
            currentEmotion(newValue) {
                this.isEmotionChanged = true;
                setTimeout(() => {
                    this.isEmotionChanged = false;
                }, 3000);
            },
            outlineContent(newValue) {
                if(newValue.trim() !== "") {
                    this.isOutlinePrepared = true;
                }
            },
        },
        computed: {
            codeOutputDisplay() {
            return this.isRunningCode ? '运行中...' : this.codeOutput;
            },
        },
    };
</script>

  <style scoped lang="less">
    .preparingOutlineCover{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 100%;
        height: 100%;
        background: #ffffffb9;
        backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
        font-family: 'Press Start 2P', cursive;
        font-size: x-large;
        font-weight: 800;
        line-height: 1.42857143;
        color: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .returnBtn {
        position: absolute;
        border: 2px solid #ddd;
        background: rgba(128, 128, 128, 0.742);
    }

    .returnBtn:hover {
        color: lightgray;
    }

	.menuBtn {
		width: auto;
		display: inline-block;
		white-space: nowrap;
        position: fixed;
		top: 10px;
      	right: 10px;
		padding: 6px 9px;
        background: rgba(128, 128, 128, 0.742);
		backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
        border: 2px solid #ddd;
		border-radius: 20px;
		color: white;
		font-size: 12px;
		font-weight: 800;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .menuBtn:hover {
        color: lightgray;
      	box-shadow: 0px 0px 0px 2px #7d31ff;
        transform: scale(1.1);
    }

    .menu {
        background: #dfdfdfa7;
		backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
        box-shadow: 0px 4px 16px 8px rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 6%;
        right: 1%;
        z-index: 20;
        display: flex;
        border-radius: 16px;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        clip-path: inset(1px 1px 1px 1px round 14px);
        z-index: 20;
        align-items: center;
    }

    .menuItemContainer {
        color: #333;
        padding: 6px 16px;
        border-bottom: 1px solid lightgray;
        display: flex;
        flex-direction: row;
        align-items: center;
        transition: background 0.3s ease, color 0.3s ease;
    }

    .menuItemContainer:hover {
        background: #ffffffb9;
        color: #333;
    }

    .menuItem {
        text-shadow: none;
        font-family: Inter;
        font-size: 16px;
    }

    .menuItemEmoji {
        font-size: 20px;
        margin-left: 66px;
    }

    .aiMsgFunctionBtnContainer {
        position: absolute;
        bottom: 26%;
        left: 16%;
        z-index: 20;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        z-index: 20;
        align-items: center;
        margin-top: 10px;
        margin-right: 24px;
    }

    .containerReturnBtn {
        position: absolute;
        color: white;
        background: gray;
        top: 9.5%;
        left: 49%;
        z-index: 1059;
    }

    .historyView {
        background-color: #f5f5f5;
        border: 2px solid #ddd;
        padding: 36px 16px 36px 16px;
        overflow: auto;
        position: fixed;
        top: 8%;
        left: 3.5%;
        width: 90%;
        height: 55%;
        border-radius: 20px;
        box-shadow: 0px 4px 16px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        z-index: 1050;
        align-items: center;
    }

    .historyRecord {
        background: linear-gradient(135deg, #50c994 0%, #85cf5c 50%);
        margin-top: 10px;
        border-radius: 6px 16px 10px 16px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 50%;
        // margin: 10px 26%;
        padding: 6px;
    }

    .historyIndex {
        font-weight: bold;
        background: #fffdeb;
        padding: 0 5px;
        border-radius: 50%;
        color: #31a36a;
        margin-right: 10px;
    }

    .historyText {
        margin: 3px 0;
        font-family: 'Press Start 2P', cursive;
        text-shadow: 0px 2px 4px #17D3C0;
        color: #fff;
        user-select: text;
    }

    /* 这是整个滚动条的样式 */
	.historyView::-webkit-scrollbar {
		width: 14px;
	}

	/* 这是滚动条轨道的样式 */
	.historyView::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		border-radius: 10px;
	}

	/* 这是滚动条滑块的样式 */
	.historyView::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: #00ffbf80;
		box-shadow: inset 0 0 6px #00ffbf80;
	}

	/* 滑块在hover时的样式 */
	.historyView::-webkit-scrollbar-thumb:hover {
		background: rgba(0,0,0,0.8);
	}

    .documentView {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .documentContainer {
        width: 50%;
        padding: 6px;
    }

    .documentDirLabel {
        margin: 10px;
        font-weight: bold;
        color: #31a36a;
        margin: 10px;
    }

    .documentContent {
        font-size: medium;
    }

    .marks {
        font-size: 20px;
        font-weight: 800;
        text-shadow: 0px 0px 6px #cebc1e
    }

    .markNum {
        font-size: 16px;
        font-weight: 500;
        color: #fff;
    }

    .massages {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .background {
        width: 100%;
        height: 67%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .classroomImg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 18px;
        width: 100%;
        height: 100%;
    }

    .codeBlocks {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 0 10%;
        align-items: center;
        position: relative;
        white-space: nowrap;
        max-height: 95%;
        overflow-x: auto;
        z-index: 1000;
    }

    .codeBlocks::-webkit-scrollbar {
        height: 0px;
    }

    .codeBlock {
        margin: 1%;
        padding: 16px;
        color: #ffe600;
        background: linear-gradient(0deg, rgb(0, 0, 0), #000000b8);
        box-shadow: 0px 4px 6px 0px #7d31ff;
        border-radius: 16px;
        z-index: 1001;
    }

    .prevBtn {
        color: #D8DEFF;
        background: #7d31ff;
        box-shadow: 0px 4px 6px 0px #7d31ff;
        padding: 10px;
        margin: 6px;
        border-radius: 12px;
        font-size: x-large;
        position: absolute;
        top: 10%;
        left: 1%;
        transform: translateY(-10%);
        z-index: 1002;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .nextBtn {
        color: #D8DEFF;
        background: #7d31ff;
        box-shadow: 0px 4px 6px 0px #7d31ff;
        padding: 10px;
        border-radius: 12px;
        font-size: x-large;
        position: absolute;
        top: 10%;
        right: 1%;
        transform: translateY(-10%);
        z-index: 1002;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .prevBtn:hover, .nextBtn:hover {
        color: #333;
        background: #fff;
        transform: scale(1.1);
    }

    .codeEdit {
        width: 100%;
        font-family: 'Courier New', Courier, monospace;
        font-size: 14px;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 10px;
        resize: none;
        color: #fffdeb;
        margin-top: 10px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        overflow-y: auto;
        white-space: pre-wrap;
    }


    .codeTip span {
        text-align: center;
        font-size: 6px;
        color: gray;
    }

    .codeBtns {
        background: linear-gradient(315deg, #161616b0, #39393991);
        padding: 2px;
        border-radius: 12px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        transition: box-shadow 0.3s ease;
    }

    .codeBtns:hover {
        box-shadow: 0px 4px 6px 0px #7d31ff;
    }

    .codeBtn {
        background: #0000008f;
        color: #fff;
        padding: 0 39px;
        margin: 2px;
        border-radius: 10px;
        font-size: medium;
        cursor: pointer;
        transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    }

    .codeBtn:hover {
        color: #D8DEFF;
        background: #7d31ff;
        box-shadow: 0px 4px 6px 0px #7d31ff;
    }

    .codeBtn:active {
        color: #D8DEFF;
        background: #3F48CC;
    }

    .dropdownButton {
        flex: 1;
        background: #0000008f;
        color: #17D3C0;
        margin: 2px;
        border-radius: 10px;
        font-size: medium;
        padding: 0 65px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .dropdownButton:hover {
        color: #D8DEFF;
        background: #7d31ff;
        box-shadow: 0px 4px 6px 0px #7d31ff;
    }

    .dropdownButton:active {
        color: #D8DEFF;
        background: #3F48CC;
    }

    .dropdownList {
        position: absolute;
        bottom: 46%;
        left: 5%;
        background: #dfdfdfa7;
		backdrop-filter: blur(36px);
		-webkit-backdrop-filter: blur(10px);
        border: 1px solid #e4d0d0;
        border-radius: 40px;
        padding: 2px;
        display: flex;
        flex-direction: row;
        z-index: 1;
    }

    .dropdownItem {
        font-size: 14px;
        padding: 0 8px;
        border-radius: 40px;
        color: lightgray;
        cursor: pointer;
        transition: background 0.1s ease, color 0.3s ease, box-shadow 0.3s ease;
    }

    .dropdownItem:hover {
        color: #D8DEFF;
        background: #7d31ff;
        box-shadow: 0px 0px 6px 0px #7d31ff;
    }

    .previewOutput {
        width: 100%;
        font-size: 14px;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 10px;
        resize: none;
        background-color: #545454;
        color: #fffacc;
        margin-top: 16px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        white-space: pre-wrap;
        height: auto;
    }

    .topInfo {
        color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 11px;
    }

    .teacherStatus {
        width: 76px;
        height: 30px;
        background-color: #17D3C0;
        box-shadow: 0px 0px 4px 0px #4bfff0;
        border-radius: 16px;
        color: #fff;
        font-size: 12px;
        font-style: normal;
        padding-left: 15px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .massages {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 16px;
        font-weight: 500;
        z-index: 1;
    }

    .aiMsg, .stuMsg {
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .typing-text {
        font-size: 16px;
        font-weight: 500;
        animation: typewriter 1s steps(40) 1 normal both, blinkingCursor 0.75s step-end infinite;
    }

    .blinking-cursor {
        display: inline-block;
        width: 0.3em;
        height: 1em;
        box-shadow: 0px 4px 66px 10px #4bfff0;
        background-color: #31a36a;
        animation: blink 2s ease infinite;
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

    @keyframes blink {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }

    .name {
        background-color: #ecfff3;
        padding: 0 16px;
        border-radius: 10px 10px 3px 3px;
        font-family: Inter;
        font-size: 20px;
        font-weight: 800;
        position: absolute;
        z-index: 21;
    }

    .stuName {
        bottom: 26%;
        right: 36px;
        color: #3F48CC;
        text-align: right;
    }

    .tecName {
        bottom: 26%;
        left: 36px;
        color: #17D3C0;
    }

    .aiMsg {
        width: 46%;
        height: 81%;
        padding: 1%;
        font-size: 16px;
        font-family: 'Press Start 2P', cursive;
        box-shadow: 0px 4px 66px 10px #17D3C0;
        text-shadow: 0px 2px 4px #17D3C0;
        color: #31a36a;
        border: 3.9px solid #17D3C0; 
        border-radius: 26px 14px 26px 14px;
    }

    .nextSentenceText {
        position: relative;
        background-color: #31a36a;
        font-size: 16px;
        font-weight: 800;
        padding: 1px;
        margin-left: 16px;
        border-radius: 0 10px 0 10px;
        box-shadow: 0px 4px 2px 0px #31a36a;
        color: #ecfff3;
        font-family: 'Press Start 2P', cursive;
        animation: float 1s ease-in-out infinite;
    }

    @keyframes float {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }


    .stuMsg {
        width: 46%;
        height: 87%;
        padding: 0.6%;
        font-size: 16px;
        font-family: 'Press Start 2P', cursive;
        font-weight: 800;
        box-shadow: 0px 4px 66px 10px #3F48CC;
        color: #3F48CC;
        margin-right: 10px;
        border: 3.9px solid #a591e1;
        border-radius: 14px 26px 14px 26px;
    }

    .stuMsg:hover {
        box-shadow: 0px 4px 66px 10px #7d31ff;
    }

    .tipMsg {
        position: absolute;
        bottom: 30%;
        right: 10%;
        z-index: 20;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        color: #3f48cc79;
        background: #dedeed;
        font-weight: 800;
        font-size: 20px;
        border-radius: 40px;
        box-shadow: 0px 4px 0px 6px #7d31ff;
        padding: 2px;
        align-items: center;
        margin-top: 10px;
        margin-right: 24px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
    }

    .tipMsg:hover {
        color: #3F48CC;
        background: #fff;
    }

    .tipBtn {
        background: linear-gradient(90deg, #3f48ccab 0%, #7d31ffab 100%);
        color: #D8DEFF;
        margin: 2px;
        font-size: 12px;
        font-weight: 800;
        border-radius: 40px;
        cursor: pointer;
        transition: all 0.1s ease;
    }

    .codeEntranceBtn {
        color: #fffacc;
        // 从中间向两边的渐变，#333到#000
        background: linear-gradient(90deg, #333 0%, #000 100%);
    }

    .functionBtn {
        color: #0000008e;
        border: 2px solid #00000054;
        background: linear-gradient(135deg, #50c79f 0%, #95d155 50%);
    }

    .outlineBtn {
        color: #0000008e;
        border: 2px solid #00000054;
        background: linear-gradient(135deg, #ffe550 0%, #ffca26 50%);
    }

    .aiImg {
        position: absolute;
        bottom: 26%;
        left: 0px;
        z-index: 20;
        filter: drop-shadow(0px 10px 10px #17D3C0);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
        pointer-events: none;
    }

    .stuImg {
        position: absolute;
        bottom: 26%;
        right: 0px;
        z-index: 20;
        filter: drop-shadow(0px 10px 10px #7d31ff);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.1s;
        pointer-events: none;
    }

    .aiOneBtn {
        // 彩虹版绚丽但是饱和度低的背景
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
        background-position: 0 0;
        font-family: 'Courier New', Courier, monospace;
        color: #fff;
        transition: all 0.1s ease 0.6s;
    }

    .aiOneBtn:hover {
        color: #7d31ff;
        box-shadow: 0px 0px 0px 2px #ffed4d;
        background-position: 100% 0;
    }

    .InferenceInputBtn {
        background: #e6e8eb;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333;
        font-size: medium;
        border-radius: 40px;
        margin: 6px;
        height: 30px;
        box-shadow: 0px 0px 6px 1px #00000023;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.1s ease;
    }

    .InferenceInputBtn:hover {
        color: #3F48CC;
        background: #fff;
        box-shadow: 0px 0px 0px 2px #7d31ff;
    }

    .inferInputIcon {
        color: #7d31ff;
		text-shadow: 0px 0px 10px #7d31ff;
    }

    .emotionTipTool {
        position: absolute;
        bottom: 36%;
        left: 6%;
        z-index: 20;
        filter: drop-shadow(0px 10px 10px #17D3C0);
        pointer-events: none;
        background: #fff;
        border-radius: 20px;
        padding: 6px;
        font-size: xx-large;
        animation: cute-animation 2s infinite;
    }

    .emotionTipTool:before {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        width: 0;
        height: 0;
        border: 12px solid transparent;
        border-top-color: #fff;
        border-bottom: 0;
        margin-left: -12px;
        margin-top: -1px;
    }

    @media (max-width: 530px) {
        .stuImg {
            display: none;
        }

        .topBar {
            font-size: small;
            width: 66%;
        }

        .historyView, .documentView {
            width: 84%;
            height: 66%;
            z-index: 1000;
        }

        .containerReturnBtn {
            left: 44%;
            z-index: 1001;
        }

        .markNum {
            font-size: small;
        }

        .teacherStatus {
            display: none;
        }

        .tipMsg {
            border-radius: 20px;
            justify-content: space-between;
            left: 0;
            width: 100%;
            bottom: -200%;
        }

        .tipBtn {
            border-radius: 16px;
        }

        .massages {
            flex-wrap: wrap;
            transform: translateY(-18%);
        }

        .stuMsg {
            box-shadow: none;
            border-radius: 20px;
            margin: 3%;
            width: 90%;
            height: 12%;
            transform: translateY(-40%);
        }

        .aiMsg {
            border-radius: 20px;
            padding: 10px;
            width: 90%;
            height: 66%;
            transform: translateY(-10%);
        }

        .stuName {
            display: none;
        }

        .tecName {
            font-size: medium;
            bottom: 108%;
        }

        .aiImg {
            left: 35%;
            bottom: 108%;
        }

        .background {
            height: 47%;
        }

        .codeBlock {
            margin: 6px;
            padding: 16px;
            color: #ffe600;
            background: linear-gradient(0deg, rgb(0, 0, 0), #000000b8);
            box-shadow: 0px 4px 6px 0px #7d31ff;
            border-radius: 16px;
            z-index: 1000;
        }

        .prevBtn, .nextBtn {
            top: 0%;
            z-index: 1001;
        }

        .codeEdit {
            font-size: 12px;
        }

        .codeBtn, .dropdownButton {
            padding: 0 26px;
            font-size: small;
        }

        .codeBlocksWrapper {
            padding: 0;
        }
    }
</style>