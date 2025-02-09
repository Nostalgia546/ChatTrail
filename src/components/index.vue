<template>
    <body style="height: 100%; margin: 0">
        <div class="wrapper">
            <div class="container">
                <div class="left">
                    <div class="top">
                        <a class="add" @click="addConversation"></a>
                    </div>
                    <transition-group
                        name="conversation"
                        tag="ul"
                        class="conversation_id"
                        :class="{ 'enable-animations': enableAnimations }"
                    >
                        <li
                            class="person no-bullet"
                            v-for="person in conversation_id"
                            :key="person.UserID"
                            :class="{ active: person.isActive }"
                            @click="setActiveChat(person.conversationId)"
                            @contextmenu.prevent="
                                showContextMenu(person.conversationId, $event)
                            "
                        >
                            <button class="name">{{ person.UserID }}</button>
                        </li>
                    </transition-group>
                    <div class="bottom">
                        <a class="setting" @click="toggleSettings">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                class="bi bi-grid-1x2"
                                viewBox="0 0 16 16"
                                style="width: 25px; color: black"
                            >
                                <path
                                    d="M6 1H1v14h5V1zm9 0h-5v5h5V1zm0 9v5h-5v-5h5zM0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm1 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-5z"
                                />
                            </svg>
                        </a>
                        <a class="model" @click="toggleModel">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                class="bi bi-box"
                                viewBox="0 0 16 16"
                                style="width: 22px; color: black"
                            >
                                <path
                                    d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"
                                />
                            </svg>
                        </a>
                        <a class="user" @click="triggerUpload">
                            <img
                                :src="avatarUrl"
                                alt="Avatar"
                                class="user-button-avatar"
                                v-if="avatarUrl" />
                            <input
                                id="avatar-upload-input"
                                type="file"
                                accept="image/*"
                                @change="handleFileChange"
                                class="avatar-upload-input"
                        /></a>
                    </div>
                </div>
                <div class="right">
                    <div class="top"></div>
                    <div
                        class="chat"
                        v-for="(chat, index) in filteredChats"
                        :key="index"
                    >
                        <div class="conversation-start">
                            <span>{{ chat.start }}</span>
                        </div>
                        <div
                            v-for="message in chat.messages"
                            :key="message.text"
                            class="bubble"
                            :class="message.sender === 'bot' ? 'bot' : 'person'"
                        >
                            <div v-html="message.text"></div>
                            <div
                                v-for="message in filteredChats"
                                :key="message.id"
                            >
                                <div
                                    v-if="
                                        message.images &&
                                        message.images.length > 0
                                    "
                                >
                                    <img
                                        v-for="image in message.images"
                                        :key="image.id"
                                        :src="image.url"
                                        alt="图片加载失败"
                                    />
                                </div>
                                <div
                                    v-if="
                                        message.files &&
                                        message.files.length > 0
                                    "
                                >
                                    <div
                                        v-for="file in message.files"
                                        :key="file.id"
                                    >
                                        <span class="file-name">{{
                                            file.name
                                        }}</span>
                                        <span class="file-size">{{
                                            formattedFileSize(file.size)
                                        }}</span>
                                    </div>
                                    <span class="file-count"
                                        >总共有
                                        {{ message.files.length }} 个文件</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="write">
                        <textarea
                            @keydown.enter="handleEnterKey"
                            class="input-text"
                        ></textarea>
                        <a class="write-link send" @click="sendMessage"
                            ><svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-send"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
                                /></svg
                        ></a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <div :class="['model-container', { open: showModel }]">
        <div class="model-content">
            <h2>选择模型</h2>
            <div class="model-list">
                <div v-if="models && models.length > 0">
                    <div
                        v-for="model in models"
                        :key="model.id"
                        :class="[
                            'model-item',
                            { selected: selectedModelId === model.id },
                        ]"
                        @click="selectModel(model)"
                        @contextmenu.prevent="
                            showModelContextMenu(model.id, $event)
                        "
                    >
                        {{ model.name }}
                    </div>
                </div>
            </div>
            <button
                class="save-button"
                style="margin-top: -5px; width: 100%"
                @click="addModel"
            >
                添加模型
            </button>
        </div>
    </div>
    <div v-if="showAddModelModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>添加模型</h2>
                <button
                    class="close-button"
                    @click="closeAddModelModal"
                ></button>
            </div>
            <div class="modal-body">
                <label for="modelType">选择模型类型：</label>
                <div class="modelType">
                    <div
                        :class="[
                            'option',
                            { selected: newModelType === 'text' },
                        ]"
                        @click="
                            newModelType = 'text';
                            console.log(newModelType);
                        "
                    >
                        文字模型
                    </div>
                    <div
                        :class="[
                            'option',
                            { selected: newModelType === 'image' },
                        ]"
                        @click="
                            newModelType = 'image';
                            console.log(newModelType);
                        "
                    >
                        绘画模型
                    </div>
                </div>
                <div class="model-parameters">
                    <!-- 根据选择的模型类型显示不同的选项 -->
                    <div v-if="newModelType === 'text'">
                        <input
                            v-model="newModelurl"
                            id="url"
                            type="text"
                            placeholder="api地址"
                            class="input-text1"
                        />
                        <input
                            v-model="secretkey"
                            id="secretkey"
                            type="password"
                            placeholder="密钥"
                            class="input-text1"
                        />
                        <input
                            v-model="newModelName"
                            id="modelName"
                            type="text"
                            placeholder="官方模型名称"
                            class="input-text1"
                        />
                        <input
                            v-model="textModelOption"
                            id="Name"
                            type="text"
                            placeholder="显示名称"
                            class="input-text1"
                        />
                    </div>
                    <div v-if="newModelType === 'image'">
                        <label for="imageModelOption">绘画模型选项：</label>
                        <input
                            v-model="newModelurl"
                            id="url"
                            type="text"
                            placeholder="api地址"
                            class="input-text1"
                        />
                        <input
                            v-model="imageModelOption"
                            id="Name"
                            type="text"
                            placeholder="显示名称"
                            class="input-text1"
                        />
                    </div>
                </div>
            </div>
            <button @click="confirmAddModel" class="confirm-button">
                确认添加
            </button>
        </div>
    </div>
    <div :class="['settings-container', { open: showSettings }]">
        <div class="settings-content">
            <h2>设置</h2>
            <div class="model-parameters">
                <div v-if="selectedModelType === 'text'">
                    <label for="contextLength">上下文长度:</label>
                    <input
                        v-model.number="contextLength"
                        type="number"
                        id="contextLength"
                        placeholder="上下文长度"
                        class="input-text1"
                    />
                </div>
                <div v-if="selectedModel.type === 'image'">
                    <div class="option-section">
                        <label style="width: 100%">画面比例:</label>
                        <div
                            class="modelType"
                            style="
                                margin-top: 0;
                                display: flex;
                                flex-wrap: wrap;
                                width: 200px;
                            "
                        >
                            <div
                                :class="[
                                    'model-item',
                                    { selected: aspectRatio === ' --ar 1:1' },
                                ]"
                                @click="
                                    aspectRatio = ' --ar 1:1';
                                    console.log(aspectRatio);
                                "
                                style="margin-right: 7px"
                            >
                                1:1
                            </div>
                            <div
                                :class="[
                                    'model-item',
                                    { selected: aspectRatio === ' --ar 16:9' },
                                ]"
                                @click="
                                    aspectRatio = ' --ar 16:9';
                                    console.log(aspectRatio);
                                "
                                style="margin-right: 7px"
                            >
                                16:9
                            </div>
                            <div
                                :class="[
                                    'model-item',
                                    { selected: aspectRatio === ' --ar 9:16' },
                                ]"
                                @click="
                                    aspectRatio = ' --ar 9:16';
                                    console.log(aspectRatio);
                                "
                            >
                                9:16
                            </div>
                            <div
                                :class="[
                                    'model-item',
                                    { selected: aspectRatio === ' --ar 2:1' },
                                ]"
                                @click="
                                    aspectRatio = ' --ar 2:1';
                                    console.log(aspectRatio);
                                "
                                style="margin-right: 7px"
                            >
                                2:1
                            </div>
                            <div
                                :class="[
                                    'model-item',
                                    { selected: aspectRatio === ' --ar 1:2' },
                                ]"
                                @click="
                                    aspectRatio = ' --ar 1:2';
                                    console.log(aspectRatio);
                                "
                            >
                                1:2
                            </div>
                        </div>
                    </div>
                    <div class="option-section">
                        <label for="styleType">模型风格:</label>
                        <div
                            class="modelType"
                            style="
                                margin-top: 0;
                                display: flex;
                                flex-wrap: wrap;
                                width: 205px;
                            "
                        >
                            <div
                                :class="[
                                    'model-item',
                                    { selected: styleType === '' },
                                ]"
                                @click="
                                    styleType = '';
                                    console.log(styleType);
                                "
                            >
                                真实模型
                            </div>
                            <div
                                :class="[
                                    'model-item',
                                    { selected: styleType === ' --niji 6' },
                                ]"
                                @click="
                                    styleType = ' --niji 6';
                                    console.log(styleType);
                                "
                            >
                                动漫模型
                            </div>
                        </div>
                    </div>
                    <div class="option-section">
                        <label for="speed">绘画速度:</label>
                        <div
                            class="speed"
                            style="
                                margin-top: 0;
                                display: flex;
                                flex-wrap: wrap;
                                width: 205px;
                            "
                        >
                            <div
                                :class="[
                                    'model-item',
                                    { selected: speed === ' --fast' },
                                ]"
                                @click="
                                    speed = ' --fast';
                                    console.log(speed);
                                "
                                style="margin-right: 10px"
                            >
                                快速
                            </div>
                            <div
                                :class="[
                                    'model-item',
                                    { selected: speed === ' --turbo' },
                                ]"
                                @click="
                                    speed = ' --turbo';
                                    console.log(speed);
                                "
                                style="margin-right: 10px"
                            >
                                极速
                            </div>
                            <div
                                :class="[
                                    'model-item',
                                    { selected: speed === ' --relax' },
                                ]"
                                @click="
                                    speed = ' --relax';
                                    console.log(speed);
                                "
                            >
                                慢速
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, watch, nextTick } from "vue";

export default {
    mounted() {
        this.loadSettingsFromLocalStorage();
        document.addEventListener("contextmenu", this.disableContextMenu);
        document.addEventListener("click", this.handleDocumentClick);
        this.initialLoad = false;
        this.$nextTick(() => {
            this.enableAnimations = true;
        });

        // 读取 localStorage 中的头像数据
        const storedAvatarData = localStorage.getItem("avatarData");
        if (storedAvatarData) {
            this.avatarUrl = `data:image/jpeg;base64,${storedAvatarData}`;
        }
        this.loadModelsFromLocalStorage();
        const storedSelectedModelId = localStorage.getItem("selectedModelId");
        if (storedSelectedModelId) {
            this.selectedModelId = parseInt(storedSelectedModelId, 10); // 修改这行
        }
        window.addEventListener("storage", this.syncLocalStorage);
    },
    beforeUnmount() {
        document.removeEventListener("contextmenu", this.disableContextMenu);
        document.removeEventListener("click", this.handleDocumentClick);
        window.removeEventListener("storage", this.syncLocalStorage);
    },
    watch: {
        contextLength() {
            this.saveSettingsToLocalStorage();
        },
        aspectRatio() {
            this.saveSettingsToLocalStorage();
        },
        styleType() {
            this.saveSettingsToLocalStorage();
        },
        speed() {
            this.saveSettingsToLocalStorage();
        },
    },
    methods: {
        // 在 methods 中添加保存设置到本地存储的方法
        saveSettingsToLocalStorage() {
            localStorage.setItem("contextLength", this.contextLength);
            localStorage.setItem("aspectRatio", this.aspectRatio);
            localStorage.setItem("styleType", this.styleType);
            localStorage.setItem("speed", this.speed);
        },

        loadSettingsFromLocalStorage() {
            const contextLength = localStorage.getItem("contextLength");
            const aspectRatio = localStorage.getItem("aspectRatio");
            const styleType = localStorage.getItem("styleType");
            const speed = localStorage.getItem("speed");

            if (contextLength !== null) {
                this.contextLength = parseInt(contextLength, 10);
            }
            if (aspectRatio !== null) {
                this.aspectRatio = aspectRatio;
            }
            if (styleType !== null) {
                this.styleType = styleType;
            }
            if (speed !== null) {
                this.speed = speed;
            }
        },
        syncLocalStorage(event) {
            if (event.key === "selectedModelId") {
                this.localSelectedModelId =
                    parseInt(event.newValue, 10) || null;
            }
        },
        loadModelsFromLocalStorage() {
            const savedModels = localStorage.getItem("models");
            if (savedModels) {
                this.models = JSON.parse(savedModels);
            }
        },
        loadModelsFromLocalStorage() {
            const savedModels = localStorage.getItem("models");
            if (savedModels) {
                this.models = JSON.parse(savedModels);
            }
        },
        saveModelsToLocalStorage() {
            localStorage.setItem("models", JSON.stringify(this.models));
        },
        confirmAddModel() {
            let maxId = 0;
            for (const model of this.models) {
                if (model.id > maxId) {
                    maxId = model.id;
                }
            }
            const newModel = {
                id: maxId + 1, // 使用 models 数组中 id 的最大值加 1 作为新模型的 id
                name:
                    this.newModelType === "text"
                        ? this.textModelOption
                        : this.imageModelOption, // 使用显示名称
                apiurl: this.newModelurl, // 仅在文字模型时添加 API 地址
                modelname:
                    this.newModelType === "text"
                        ? this.newModelName
                        : undefined, // 仅在文字模型时添加官方模型名称
                secretkey:
                    this.newModelType === "text" ? this.secretkey : undefined, // 仅在文字模型时添加密钥
                type: this.newModelType, // 添加模型类型
            };
            this.models.push(newModel);
            this.saveModelsToLocalStorage(); // 保存模型数据到本地存储
            this.closeAddModelModal();
        },

        closeAddModelModal() {
            this.showAddModelModal = false;
            this.newModelType = "text";
            this.newModelName = "";
            this.textModelOption = ""; // 重置文字模型选项数据
            this.imageModelOption = ""; // 重置绘画模型选项数据
        },
        addModel() {
            this.showAddModelModal = true;
        },
        disableContextMenu(event) {
            event.preventDefault();
        },
        triggerUpload() {
            document.getElementById("avatar-upload-input").click();
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64String = e.target.result.split(",")[1];
                    this.avatarUrl = `data:image/jpeg;base64,${base64String}`;
                    localStorage.setItem("avatarData", base64String);
                };
                reader.readAsDataURL(file);
            }
        },
        saveSettings() {
            localStorage.setItem("username", this.username);
            console.log("用户名已保存:", this.username);
        },
        showContextMenu(conversationId, event) {
            // 关闭之前可能存在的上下文菜单
            this.closeExistingContextMenu();

            // 获取触发右键菜单的元素
            const triggerElement = event.target;

            // 获取触发元素的位置
            const rect = triggerElement.getBoundingClientRect();

            // 创建一个弹出框
            const contextMenu = document.createElement("div");
            contextMenu.style.position = "absolute";
            contextMenu.style.left = `${rect.right + 10}px`; // 设置在按钮右边10px
            contextMenu.style.top = `${rect.top - 6}px`; // 设置在按钮的顶部对齐
            contextMenu.style.zIndex = "1000";
            contextMenu.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // 白色背景，带透明度以实现毛玻璃效果
            contextMenu.style.padding = "10px"; // 添加10px的内边距
            contextMenu.style.borderRadius = "5px"; // 添加5px的圆角
            contextMenu.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // 添加阴影以实现立体效果
            contextMenu.style.backdropFilter = "blur(10px)"; // 添加毛玻璃效果

            // 创建删除按钮
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "删除";
            deleteButton.style.display = "flex";
            deleteButton.style.position = "relative";
            deleteButton.style.alignItems = "center";
            deleteButton.style.justifyContent = "center";
            deleteButton.style.width = "auto";
            deleteButton.style.height = "35px";
            deleteButton.style.fontFamily = "inherit";
            deleteButton.style.fontSize = "13px";
            deleteButton.style.fontWeight = "500";
            deleteButton.style.textTransform = "uppercase";
            deleteButton.style.letterSpacing = "0.4px";
            deleteButton.style.color = "#ffffff";
            deleteButton.style.backgroundColor = "#ff0000";
            deleteButton.style.borderStyle = "solid";
            deleteButton.style.borderWidth = "2px";
            deleteButton.style.borderColor = "rgba(255, 255, 255, 0.333)";
            deleteButton.style.borderRadius = "2rem";
            deleteButton.style.padding = "0 1rem";
            deleteButton.style.transition = "0.2s";
            deleteButton.style.border = "1px solid rgba(255, 255, 255, 0.459)";
            deleteButton.style.boxShadow =
                "0px 4px 10px 0px rgba(0, 0, 0, 0.3), 0px 6px 15px 0px rgba(0, 0, 0, 0.2)";
            deleteButton.onclick = () => {
                this.deleteConversation(conversationId);
                if (document.body.contains(contextMenu)) {
                    document.body.removeChild(contextMenu);
                }
            };

            // 将删除按钮添加到弹出框
            contextMenu.appendChild(deleteButton);

            // 将弹出框添加到页面
            document.body.appendChild(contextMenu);

            // 点击页面其他地方关闭弹出框
            const closeContextMenu = (event) => {
                if (!contextMenu.contains(event.target)) {
                    if (document.body.contains(contextMenu)) {
                        document.body.removeChild(contextMenu);
                    }
                    document.removeEventListener("click", closeContextMenu);
                }
            };
            document.addEventListener("click", closeContextMenu);
        },

        closeExistingContextMenu() {
            const existingContextMenu = document.querySelector(
                'div[style*="z-index: 1000"]'
            );
            if (existingContextMenu) {
                document.body.removeChild(existingContextMenu);
            }
        },
        deleteConversation(conversationId) {
            // 从 conversation_id 中删除对应的会话
            this.conversation_id = this.conversation_id.filter(
                (person) => person.conversationId !== conversationId
            );

            // 从 chats 中删除对应的聊天记录
            this.chats = this.chats.filter(
                (chat) => chat.conversationId !== conversationId
            );

            // 设置最上面的一个会话为活动会话，如果没有会话了就用临时会话
            if (this.conversation_id.length > 0) {
                this.setActiveChat(this.conversation_id[0].conversationId);
            } else {
                this.addConversation();
            }

            // 保存更新后的数据到本地存储
            this.saveConversationsToLocalStorage();
            this.saveChatsToLocalStorage();
        },
        saveConversationsToLocalStorage() {
            localStorage.setItem(
                "conversation_id",
                JSON.stringify(this.conversation_id)
            );
        },
        saveChatsToLocalStorage() {
            localStorage.setItem("chats", JSON.stringify(this.chats));
        },
        handleEnterKey(event) {
            event.preventDefault(); // 阻止默认的回车换行行为
            this.sendMessage(); // 调用发送消息的方法
        },
    },

    data() {
        return {
            userId: null,
            initialLoad: true, // 用于控制初始加载
            enableAnimations: false, // 用于控制动画的启用
            userAvatar: "path/to/default/avatar.png", // 用户头像路径
            username: localStorage.getItem("username") || "用户名", // 用户名
            avatarUrl: "", // 用户头像URL
            file: null, // 上传的文件
            message: "",
            showAddModelModal: false,
            newModelType: "text",
            newModelName: "",
            newModelurl: "", // API 地址
            secretkey: "", // 密钥
            textModelOption: "", // 新增文字模型选项数据
            imageModelOption: "", // 新增绘画模型选项数据
            models: JSON.parse(localStorage.getItem("models")) || [],
            nextModelId: 1,
            showModel: false,
            localSelectedModelId:
                parseInt(localStorage.getItem("selectedModelId"), 10) || null,
            selectedModelId: null, // 添加这行
            showSettings: false, // 新增设置框的显示状态
            contextLength: 0,
            aspectRatio: "1:1",
            styleType: "",
            showSettings: false,
            selectedModelId: 1, // 假设默认选择第一个模型
            speed: "",
        };
    },
    computed: {
        selectedModel() {
            return (
                this.models.find(
                    (model) => model.id === this.selectedModelId
                ) || {}
            );
        },
        selectedModelType() {
            return this.selectedModel.type || "";
        },
    },

    name: "ChatTrail",
    setup() {
        const downloadImage = (url) => {
            fetch(url, {
                method: "GET",
                mode: "cors",
            })
                .then((response) => response.blob())
                .then((blob) => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = ""; // 不设置文件名
                    link.style.display = "none";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((error) => {
                    console.error("下载图片时出错:", error);
                });
        };

        const closeExistingContextMenu = () => {
            const existingContextMenu = document.querySelector(
                'div[style*="z-index: 1000"]'
            );
            if (existingContextMenu) {
                document.body.removeChild(existingContextMenu);
            }
        };
        const bindContextMenuEvents = () => {
            const chatElements = document.querySelectorAll(".chat");
            chatElements.forEach((chatElement) => {
                const images = chatElement.querySelectorAll("img");
                images.forEach((img) => {
                    img.removeEventListener(
                        "contextmenu",
                        showImageContextMenu
                    ); // 移除旧的事件监听器
                    img.addEventListener("contextmenu", (event) => {
                        const url = img.src;
                        showImageContextMenu(url, event);
                    });
                });
            });
        };
        const showImageContextMenu = (url, event) => {
            console.log("点了右键");
            // 关闭之前可能存在的上下文菜单
            closeExistingContextMenu();

            // 获取鼠标右键的位置
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // 创建一个弹出框
            const contextMenu = document.createElement("div");
            contextMenu.style.position = "absolute";
            contextMenu.style.left = `${mouseX}px`; // 设置在按钮右边10px
            contextMenu.style.top = `${mouseY}px`; // 设置在按钮的顶部对齐
            contextMenu.style.zIndex = "1000";
            contextMenu.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // 白色背景，带透明度以实现毛玻璃效果
            contextMenu.style.padding = "10px"; // 添加10px的内边距
            contextMenu.style.borderRadius = "5px"; // 添加5px的圆角
            contextMenu.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // 添加阴影以实现立体效果
            contextMenu.style.backdropFilter = "blur(10px)"; // 添加毛玻璃效果

            // 创建保存按钮
            const saveButton = document.createElement("button");
            saveButton.innerText = "保存图片";
            saveButton.className = "save-button"; // 添加类名
            saveButton.onclick = () => {
                downloadImage(url);
                if (document.body.contains(contextMenu)) {
                    document.body.removeChild(contextMenu);
                }
            };

            // 将保存按钮添加到弹出框
            contextMenu.appendChild(saveButton);

            // 将弹出框添加到页面
            document.body.appendChild(contextMenu);

            // 点击页面其他地方关闭弹出框
            const closeContextMenu = (event) => {
                if (!contextMenu.contains(event.target)) {
                    if (document.body.contains(contextMenu)) {
                        document.body.removeChild(contextMenu);
                    }
                    document.removeEventListener("click", closeContextMenu);
                }
            };
            document.addEventListener("click", closeContextMenu);
        };
        const selectedButtons = ref(
            JSON.parse(localStorage.getItem("selectedButtons")) || []
        );
        const scrollToBottom = () => {
            const chatContainer = document.querySelector(".chat");
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        };
        const handleOutsideClick = (event) => {
            const setting = document.querySelector(".setting");
            const settingsContainer = document.querySelector(
                ".settings-container"
            );

            if (
                !setting.contains(event.target) &&
                !settingsContainer.contains(event.target)
            ) {
                showSettings.value = false;
            }
        };
        const toggleSettings = () => {
            showSettings.value = !showSettings.value;
            if (showSettings.value) {
                document.addEventListener("click", handleOutsideClick);
            } else {
                document.removeEventListener("click", handleOutsideClick);
            }
        };

        const aspectRatio = ref();
        const styleType = ref();
        const speed = ref();
        const handleDocumentClick = (event) => {
            const model = document.querySelector(".model");
            const modelContainer = document.querySelector(".model-container");

            if (
                !model.contains(event.target) &&
                !modelContainer.contains(event.target)
            ) {
                showModel.value = false;
            }
        };
        const conversation_id = ref([]);
        const chats = ref([]);
        const tempConversation = ref(null);
        const models = ref(JSON.parse(localStorage.getItem("models")) || []);
        const selectedModelId = ref(null);

        const saveModelsToLocalStorage = () => {
            localStorage.setItem("models", JSON.stringify(models.value));
        };
        const loadModelsFromLocalStorage = () => {
            const savedModels = localStorage.getItem("models");
            if (savedModels) {
                models.value = JSON.parse(savedModels);
            }
        };
        const loadChatsFromLocalStorage = () => {
            const savedChats = localStorage.getItem("chats");
            if (savedChats) {
                chats.value = JSON.parse(savedChats);
            }
        };
        const loadConversationsFromLocalStorage = () => {
            const savedConversations = localStorage.getItem("conversation_id");
            if (savedConversations) {
                conversation_id.value = JSON.parse(savedConversations);
            }
        };

        onMounted(() => {
            loadModelsFromLocalStorage();
            loadChatsFromLocalStorage();
            loadConversationsFromLocalStorage();
            if (conversation_id.value.length > 0) {
                setActiveChat(conversation_id.value[0].conversationId);
            }
            nextTick(() => {
                applySelectedStyles(selectedButtons.value);
                bindContextMenuEvents();
            });

            function applySelectedStyles() {
                const selectedButtons =
                    JSON.parse(localStorage.getItem("selectedButtons")) || [];
                selectedButtons.forEach((buttonId) => {
                    const button = document.getElementById(buttonId);
                    if (button) {
                        button.classList.add("selected");
                    }
                });
            }
        });

        const activeChat = ref(null);
        const buttonText = ref("good luck!");
        const fileInput = ref(null);

        const setActiveChat = (conversationId) => {
            activeChat.value = conversationId;
            // 添加 active 类到当前活动的会话
            conversation_id.value.forEach((person) => {
                person.isActive = person.conversationId === conversationId;
            });
            nextTick(() => {
                applySelectedStyles(selectedButtons.value);
                bindContextMenuEvents();
            });

            function applySelectedStyles() {
                const selectedButtons =
                    JSON.parse(localStorage.getItem("selectedButtons")) || [];
                selectedButtons.forEach((buttonId) => {
                    const button = document.getElementById(buttonId);
                    if (button) {
                        button.classList.add("selected");
                    }
                });
            }
        };

        const filteredChats = computed(() => {
            return chats.value.filter(
                (chat) =>
                    activeChat.value && activeChat.value === chat.conversationId
            );
        });

        const generateUniqueId = () => {
            const min = 100000000; // 9位数的最小值
            const max = 2147483647; // 小于2147483647的最大值
            let uniqueId;
            do {
                uniqueId = Math.floor(Math.random() * (max - min + 1)) + min;
            } while (uniqueId > max); // 确保生成的数字小于2147483647
            return uniqueId.toString();
        };

        const addConversation = async () => {
            if (tempConversation.value) {
                setActiveChat(tempConversation.value.conversationId);
                return;
            }
            const conversationId = generateUniqueId();

            // 找到 conversation_id 数组中最大的 UserID
            let maxUserId = 0;
            conversation_id.value.forEach((conversation) => {
                if (conversation.UserID > maxUserId) {
                    maxUserId = conversation.UserID;
                }
            });

            tempConversation.value = {
                conversationId: conversationId,
                UserID: maxUserId + 1, // 使用最大的 UserID 加 1
                isTemp: true, // 添加一个标志来区分临时会话
            };
            console.log(tempConversation.value);
            setActiveChat(conversationId); // 初始化新的聊天记录
            chats.value.push({
                conversationId: conversationId,
                messages: [],
                isTemp: true, // 添加一个标志来区分临时会话
            });
        };

        const sendMessage = async (rememberCount = 8) => {
            if (!activeChat.value) {
                await addConversation();
            }

            const conversationId = activeChat.value;
            const inputText = document.querySelector(".input-text").value;
            if (!inputText) {
                console.error("No message");
                return;
            }

            const messageData = {
                sender: "person",
                text: inputText,
            };

            const chat = chats.value.find(
                (chat) => chat.conversationId === conversationId
            );
            if (chat) {
                chat.messages.push(messageData);
                if (chat.isTemp) {
                    chat.isTemp = false;
                    const conversation = tempConversation.value;
                    if (
                        conversation &&
                        conversation.conversationId === conversationId
                    ) {
                        conversation.isTemp = false;
                        conversation_id.value.unshift(conversation);
                        tempConversation.value = null;
                    }
                    setActiveChat(conversationId);
                }
            }

            document.querySelector(".input-text").value = "";

            const previousMessages = chat.messages
                .slice(-rememberCount * 8)
                .map((msg) => ({
                    role: msg.sender === "person" ? "user" : "assistant",
                    content: msg.text,
                }));
            scrollToBottom();
            const selectedModel = models.value.find(
                (model) => model.id === selectedModelId.value
            );
            if (!selectedModel) {
                console.error("No selected model found");
                return;
            }

            if (selectedModel.type === "text") {
                const messages = [
                    {
                        role: "system",
                        content: "你是一个很有用的助手",
                    },
                    ...previousMessages,
                    {
                        role: "user",
                        content: inputText,
                    },
                ];

                try {
                    const apiUrl = new URL(selectedModel.apiurl);
                    apiUrl.pathname = "/chat/completions";
                    const response = await fetch(apiUrl.toString(), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${selectedModel.secretkey}`,
                        },
                        body: JSON.stringify({
                            model: selectedModel.modelname,
                            messages: messages,
                            stream: true,
                            max_tokens: 4096,
                            temperature: 0.7,
                            top_p: 0.9,
                            user: "user-12345",
                            frequency_penalty: 0.5,
                            presence_penalty: 0.5,
                        }),
                    });
                    if (!response.body) {
                        throw new Error(
                            "ReadableStream not supported in this browser."
                        );
                    }
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder("utf-8");
                    let botMessage = "";
                    const assistantMessageData = {
                        sender: "bot",
                        text: botMessage,
                        files: [],
                    };
                    if (chat) {
                        chat.messages.push(assistantMessageData);
                    }
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split("\n");
                        for (const line of lines) {
                            if (line.trim().startsWith("data:")) {
                                const jsonStr = line.trim().substring(5).trim();
                                if (jsonStr === "[DONE]") {
                                    break;
                                }
                                const jsonResponse = JSON.parse(jsonStr);
                                const delta = jsonResponse.choices[0].delta;
                                if (delta && delta.content) {
                                    botMessage += delta.content.replace(
                                        /\n/g,
                                        "<br>"
                                    );
                                    assistantMessageData.text = botMessage;
                                    chat.messages = [...chat.messages];
                                    scrollToBottom();
                                }
                            }
                        }
                    }
                    assistantMessageData.text = botMessage;
                    chat.messages = [...chat.messages];
                    scrollToBottom(); // 添加滚动逻辑
                } catch (error) {
                    console.error("Error calling API:", error);
                }
            } else if (selectedModel.type === "image") {
                const imagineDTO = {
                    prompt:
                        inputText +
                        styleType.value +
                        aspectRatio.value +
                        speed.value,
                };

                try {
                    const response = await fetch(
                        `${selectedModel.apiurl}/mj/submit/imagine`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(imagineDTO),
                        }
                    );

                    const responseData = await response.json();
                    if (responseData.code !== 1) {
                        console.error(
                            "绘画任务提交失败:",
                            responseData.description
                        );
                        return;
                    }

                    const taskId = responseData.result; // 确保正确获取任务ID

                    // 创建初始消息
                    const initialMessageData = {
                        sender: "bot",
                        text: ``,
                        files: [],
                    };

                    let messageIndex;
                    if (chat) {
                        chat.messages.push(initialMessageData);
                        messageIndex = chat.messages.length - 1; // 记录消息的索引
                    }

                    // 启动轮询机制检查任务进度
                    const checkTaskStatus = async () => {
                        try {
                            const statusResponse = await fetch(
                                `${selectedModel.apiurl}/mj/task/${taskId}/fetch`
                            );
                            if (!statusResponse.ok) {
                                throw new Error(
                                    `HTTP error! status: ${statusResponse.status}`
                                );
                            }

                            const statusData = await statusResponse.json();

                            // 更新消息框显示任务进度
                            if (chat && messageIndex !== undefined) {
                                chat.messages[messageIndex].text =
                                    statusData.status === "SUCCESS"
                                        ? `<img src="${statusData.imageUrl}" alt="绘画结果" style="width:725px; max-width:100%; height:auto;">`
                                        : `任务进度: ${
                                              statusData.progress !== null
                                                  ? statusData.progress
                                                  : "0%"
                                          }`;
                            }

                            // 继续轮询
                            if (
                                statusData.status !== "SUCCESS" &&
                                statusData.status !== "FAILURE"
                            ) {
                                setTimeout(checkTaskStatus, 2000); // 每2秒检查一次
                            } else {
                                // 任务成功完成后，添加按钮
                                if (statusData.status === "SUCCESS") {
                                    const imageUrl = statusData.imageUrl;
                                    let buttons = "";
                                    buttons += `<div style="width:725px; max-width:100%; display:flex; flex-wrap:wrap; justify-content:center;gap:10px;">`;
                                    const actions = ["UPSCALE", "VARIATION"];
                                    const indices = [1, 2, 3, 4];

                                    actions.forEach((action) => {
                                        buttons += `<div style="width:515px; max-width:100%; display:flex; flex-wrap:wrap; justify-content:space-between; gap:10px;">`;
                                        indices.forEach((index) => {
                                            const timestamp =
                                                new Date().getTime();
                                            const actionIndex =
                                                actions.indexOf(action) + 1;
                                            const buttonId = `${taskId}${timestamp}${actionIndex}${index}`;
                                            const isSelected =
                                                selectedButtons.value.includes(
                                                    buttonId
                                                )
                                                    ? "selected"
                                                    : "";
                                            buttons += `<button id="${buttonId}" class="model-item ${isSelected}" onclick="handleAction('${action}', ${index}, '${taskId}', this)">${action} ${index}</button>`;
                                        });
                                        buttons += `</div>`;
                                    });

                                    // 处理 REROLL 按钮
                                    buttons += `<div style="width:515px; max-width:100%; display:flex; flex-wrap:wrap; justify-content:center;">`;
                                    const rerollTimestamp =
                                        new Date().getTime();
                                    const rerollButtonId = `${taskId}${rerollTimestamp}3`;
                                    const isRerollSelected =
                                        selectedButtons.value.includes(
                                            rerollButtonId
                                        )
                                            ? "selected"
                                            : "";
                                    buttons += `<button id="${rerollButtonId}" class="model-item ${isRerollSelected}" onclick="handleAction('REROLL', null, '${taskId}', this)">REROLL</button>`;
                                    buttons += `</div>`;
                                    buttons += `</div>`;
                                    chat.messages[messageIndex].text += buttons;
                                    // 添加右键点击事件
                                    setTimeout(() => {
                                        const imgElement =
                                            document.querySelector(
                                                `img[src="${imageUrl}"]`
                                            );
                                        if (imgElement) {
                                            imgElement.addEventListener(
                                                "contextmenu",
                                                (event) =>
                                                    showImageContextMenu(
                                                        imageUrl,
                                                        event
                                                    )
                                            );
                                        }
                                    }, 0);
                                }
                                scrollToBottom();
                            }
                        } catch (error) {
                            console.error("Error fetching task status:", error);
                            if (chat && messageIndex !== undefined) {
                                chat.messages[messageIndex].text =
                                    "无法获取任务状态，请稍后再试。";
                            }
                        }
                    };

                    // 开始轮询
                    checkTaskStatus();
                } catch (error) {
                    console.error("Error submitting drawing task:", error);
                    const errorMessageData = {
                        sender: "bot",
                        text: "绘画任务提交失败，请稍后再试。",
                        files: [],
                    };
                    if (chat) {
                        chat.messages.push(errorMessageData);
                    }
                }
            }
            scrollToBottom(); // 添加滚动逻辑
        };

        // 处理按钮点击事件
        const handleAction = async (action, index, taskId, button) => {
            const selectedModel = models.value.find(
                (model) => model.id === selectedModelId.value
            );
            if (!selectedModel) {
                console.error("No selected model found");
                return;
            }

            const changeDTO = {
                action: action,
                index: index,
                taskId: taskId,
            };

            try {
                const response = await fetch(
                    `${selectedModel.apiurl}/mj/submit/change`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(changeDTO),
                    }
                );

                const responseData = await response.json();
                if (responseData.code !== 1) {
                    console.error("操作提交失败:", responseData.description);
                    return;
                }

                const newTaskId = responseData.result; // 确保正确获取新任务ID

                // 创建初始消息
                const initialMessageData = {
                    sender: "bot",
                    text: ``,
                    files: [],
                };

                let messageIndex;
                const chat = chats.value.find(
                    (chat) => chat.conversationId === activeChat.value
                );
                if (chat) {
                    chat.messages.push(initialMessageData);
                    messageIndex = chat.messages.length - 1; // 记录消息的索引
                }

                // 启动轮询机制检查任务进度
                const checkTaskStatus = async () => {
                    try {
                        const statusResponse = await fetch(
                            `${selectedModel.apiurl}/mj/task/${newTaskId}/fetch`
                        );
                        if (!statusResponse.ok) {
                            throw new Error(
                                `HTTP error! status: ${statusResponse.status}`
                            );
                        }

                        const statusData = await statusResponse.json();

                        // 更新消息框显示任务进度
                        if (chat && messageIndex !== undefined) {
                            chat.messages[messageIndex].text =
                                statusData.status === "SUCCESS"
                                    ? `<img src="${statusData.imageUrl}" alt="绘画结果" style="width:725px; max-width:100%; height:auto;">`
                                    : `任务进度: ${
                                          statusData.progress !== null
                                              ? statusData.progress
                                              : "0%"
                                      }`;
                        }

                        // 继续轮询
                        if (
                            statusData.status !== "SUCCESS" &&
                            statusData.status !== "FAILURE"
                        ) {
                            setTimeout(checkTaskStatus, 2000); // 每2秒检查一次
                        } else {
                            // 任务成功完成后，添加按钮
                            if (statusData.status === "SUCCESS") {
                                const imageUrl = statusData.imageUrl;
                                let buttons = "";
                                buttons += `<div style="width:725px; max-width:100%; display:flex; flex-wrap:wrap; justify-content:center;gap:10px;">`;
                                const actions = ["UPSCALE", "VARIATION"];
                                const indices = [1, 2, 3, 4];
                                if (action !== "UPSCALE") {
                                    actions.forEach((action) => {
                                        buttons += `<div style="width:515px; max-width:100%; display:flex; flex-wrap:wrap; justify-content:space-between; gap:10px;">`;
                                        indices.forEach((index) => {
                                            const timestamp =
                                                new Date().getTime();
                                            const actionIndex =
                                                actions.indexOf(action) + 1;
                                            const buttonId = `${newTaskId}${timestamp}${actionIndex}${index}`;
                                            const isSelected =
                                                selectedButtons.value.includes(
                                                    buttonId
                                                )
                                                    ? "selected"
                                                    : "";
                                            buttons += `<button id="${buttonId}" class="model-item ${isSelected}" onclick="handleAction('${action}', ${index}, '${newTaskId}', this)">${action} ${index}</button>`;
                                        });
                                        buttons += `</div>`;
                                    });

                                    // 处理 REROLL 按钮
                                    buttons += `<div style="width:515px; max-width:100%; display:flex; flex-wrap:wrap; justify-content:center;">`;
                                    const rerollTimestamp =
                                        new Date().getTime();
                                    const rerollButtonId = `${newTaskId}${rerollTimestamp}3`;
                                    const isRerollSelected =
                                        selectedButtons.value.includes(
                                            rerollButtonId
                                        )
                                            ? "selected"
                                            : "";
                                    buttons += `<button id="${rerollButtonId}" class="model-item ${isRerollSelected}" onclick="handleAction('REROLL', null, '${newTaskId}', this)">REROLL</button>`;
                                    buttons += `</div>`;
                                    buttons += `</div>`;
                                }
                                chat.messages[messageIndex].text += buttons;
                                // 添加右键点击事件
                                setTimeout(() => {
                                    const imgElement = document.querySelector(
                                        `img[src="${imageUrl}"]`
                                    );
                                    if (imgElement) {
                                        imgElement.addEventListener(
                                            "contextmenu",
                                            (event) =>
                                                showImageContextMenu(
                                                    imageUrl,
                                                    event
                                                )
                                        );
                                    }
                                }, 0);
                            }
                            scrollToBottom();
                        }
                    } catch (error) {
                        console.error("Error fetching task status:", error);
                        if (chat && messageIndex !== undefined) {
                            chat.messages[messageIndex].text =
                                "无法获取任务状态，请稍后再试。";
                        }
                    }
                };

                // 开始轮询
                checkTaskStatus();

                // 切换按钮样式
                if (button) {
                    const buttonId = button.id;
                    if (!selectedButtons.value.includes(buttonId)) {
                        selectedButtons.value.push(buttonId);
                        button.classList.add("selected");

                        // 存储到本地
                        localStorage.setItem(
                            "selectedButtons",
                            JSON.stringify(selectedButtons.value)
                        );

                        // 重新应用样式
                        applySelectedStyles(selectedButtons.value);
                    }
                }

                function applySelectedStyles() {
                    const selectedButtons =
                        JSON.parse(localStorage.getItem("selectedButtons")) ||
                        [];
                    selectedButtons.forEach((buttonId) => {
                        const button = document.getElementById(buttonId);
                        if (button) {
                            button.classList.add("selected");
                        }
                    });
                }
            } catch (error) {
                console.error("Error submitting action:", error);
                const errorMessageData = {
                    sender: "bot",
                    text: "操作提交失败，请稍后再试。",
                    files: [],
                };
                if (chat) {
                    chat.messages.push(errorMessageData);
                }
            }
        };

        // 将 handleAction 函数绑定到 window 对象上
        window.handleAction = handleAction;

        const saveChatsToLocalStorage = () => {
            localStorage.setItem("chats", JSON.stringify(chats.value));
        };

        const saveConversationsToLocalStorage = () => {
            localStorage.setItem(
                "conversation_id",
                JSON.stringify(conversation_id.value)
            );
        };

        const showModel = ref(false);

        const selectModel = (model) => {
            selectedModelId.value = model.id;
            localStorage.setItem("selectedModelId", model.id);
            console.log(model.id);
        };

        const deleteModel = (modelId) => {
            models.value = models.value.filter((model) => model.id !== modelId);
            if (selectedModelId.value === modelId) {
                selectedModelId.value = null; // 清空选中的模型ID
                localStorage.removeItem("selectedModelId"); // 从本地存储中删除
            }
            console.log("当前模型列表:", models.value); // 打印当前模型列表
        };

        const showModelContextMenu = (modelId, event) => {
            closeExistingContextMenu();
            const triggerElement = event.target;
            const rect = triggerElement.getBoundingClientRect();
            const contextMenu = document.createElement("div");
            contextMenu.style.position = "absolute";
            contextMenu.style.left = `${rect.right + 10}px`;
            contextMenu.style.top = `${rect.top - 6}px`;
            contextMenu.style.zIndex = "1000";
            contextMenu.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            contextMenu.style.padding = "10px";
            contextMenu.style.borderRadius = "5px";
            contextMenu.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            contextMenu.style.backdropFilter = "blur(10px)";

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "删除";
            deleteButton.style.display = "flex";
            deleteButton.style.position = "relative";
            deleteButton.style.alignItems = "center";
            deleteButton.style.justifyContent = "center";
            deleteButton.style.width = "auto";
            deleteButton.style.height = "35px";
            deleteButton.style.fontFamily = "inherit";
            deleteButton.style.fontSize = "13px";
            deleteButton.style.fontWeight = "500";
            deleteButton.style.textTransform = "uppercase";
            deleteButton.style.letterSpacing = "0.4px";
            deleteButton.style.color = "#ffffff";
            deleteButton.style.backgroundColor = "#ff0000";
            deleteButton.style.borderStyle = "solid";
            deleteButton.style.borderWidth = "2px";
            deleteButton.style.borderColor = "rgba(255, 255, 255, 0.333)";
            deleteButton.style.borderRadius = "2rem";
            deleteButton.style.padding = "0 1rem";
            deleteButton.style.transition = "0.2s";
            deleteButton.style.border = "1px solid rgba(255, 255, 255, 0.459)";
            deleteButton.style.boxShadow =
                "0px 4px 10px 0px rgba(0, 0, 0, 0.3), 0px 6px 15px 0px rgba(0, 0, 0, 0.2)";
            deleteButton.onclick = () => {
                deleteModel(modelId);
                if (document.body.contains(contextMenu)) {
                    document.body.removeChild(contextMenu);
                }
            };

            contextMenu.appendChild(deleteButton);
            document.body.appendChild(contextMenu);

            const closeContextMenu = (event) => {
                if (!contextMenu.contains(event.target)) {
                    if (document.body.contains(contextMenu)) {
                        document.body.removeChild(contextMenu);
                    }
                    document.removeEventListener("click", closeContextMenu);
                }
            };
            document.addEventListener("click", closeContextMenu);
        };
        const toggleModel = () => {
            showModel.value = !showModel.value;
            if (showModel.value) {
                document.addEventListener("click", handleDocumentClick);
            } else {
                // 移除事件监听器
                document.removeEventListener("click", handleDocumentClick);
            }
        };

        watch(
            chats,
            () => {
                saveChatsToLocalStorage();
            },
            { deep: true }
        );
        watch(
            conversation_id,
            () => {
                saveConversationsToLocalStorage();
            },
            { deep: true }
        );
        watch(models, saveModelsToLocalStorage, { deep: true });
        const showSettings = ref(false);

        return {
            conversation_id,
            chats,
            activeChat,
            buttonText,
            setActiveChat,
            filteredChats,
            fileInput,
            addConversation,
            sendMessage,
            showModel,
            models,
            toggleModel,
            newModelName: "",
            newModelurl: "",
            secretkey: "",
            textModelOption: "", // 新增文字模型选项数据
            imageModelOption: "", // 新增绘画模型选项数据
            saveModelsToLocalStorage,
            showModelContextMenu,
            selectModel,
            selectedModelId,
            handleDocumentClick,
            styleType,
            aspectRatio,
            speed,
            toggleSettings,
            handleOutsideClick,
            showSettings,
            handleAction,
            selectedButtons,
            showImageContextMenu,
            bindContextMenuEvents,
            downloadImage,
        };
    },
};
</script>

<style>
*,
*:before,
*:after {
    box-sizing: border-box;
}
body {
    background-color: white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    background-color: white;
    display: flex;
    width: 100vw;
}
.wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.container {
    position: relative;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background-color: white;
    transform: translate(-50%, -50%);
    .left {
        float: left;
        width: 80px;
        height: 100%;
        border: 1px solid #e6e6e6;
        background-color: rgba(255, 255, 255, 0.74);
        backdrop-filter: blur(25px);
        .top {
            position: relative;
            width: 100%;
            height: 75px;
            padding: 15px;
        }
        a.add {
            display: flex;
            position: absolute;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #fff; 
            background-color: #000; 
            border-style: solid;
            border-width: 2px;
            border-color: rgba(0, 0, 0, 0.333);
            border-radius: 50%;
            padding: 0;
            transition: 0.2s;
            border: 1px solid rgba(0, 0, 0, 0);
            left: 18px;
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3),
                0px 6px 15px 0px rgba(0, 0, 0, 0.2);
            &:hover {
                color: #fff; 
                background-color: #333; 
                box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
            }
            &:active {
                box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
            }
            &::before,
            &::after {
                content: "";
                position: absolute;
                background-color: #fff; 
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: background-color 0.2s ease;
            }
            &::before {
                width: 3px;
                height: 17px;
            }
            &::after {
                width: 17px;
                height: 3px;
            }
            &:hover::before,
            &:hover::after {
                background-color: #ffffff; /
            }
            &:active::before,
            &:active::after {
                background-color: #fff; 
            }
        }
        .conversation_id {
            height: auto;
            max-height: 210px;
            width: 70%;
            margin: auto;
            padding-left: 0px;
            overflow-y: auto;
            scrollbar-width: none;
            background-color: rgba(255, 255, 255, 0.548);
            border-radius: 200px;
            backdrop-filter: blur(25px); 
            border: none;
            border-radius: 5rem;
            box-shadow: 0px 2px 6px 0px rgba(121, 138, 160, 0.28),
                0px 4px 10px 0px rgba(121, 138, 160, 0.28);
            transition: 0.3s;
            cursor: default;
            .person {
                position: relative;
                width: 100%;
                height: 70px;
                padding: 15px;
                cursor: pointer;
                background-color: rgba(0, 0, 0, 0);
                cursor: default;
                .name {
                    display: flex;
                    position: absolute;
                    align-items: center;
                    justify-content: center;
                    width: 42px;
                    height: 42px;
                    font-family: inherit;
                    font-size: 18px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                    color: #000000;
                    background-color: #f4f7f8;
                    border-style: solid;
                    border-width: 2px;
                    border-color: rgba(255, 255, 255, 0.333);
                    border-radius: 50%;
                    padding: 0;
                    transition: 0.2s;
                    cursor: default;
                    border: 1px solid rgba(255, 255, 255, 0.459);
                    left: 6.5px;
                    box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
                        0px 6px 15px 0px rgba(121, 138, 160, 0.2);
                    &:hover {
                        color: #000000; 
                        background-color: #f0f4f8;
                        box-shadow: 0px 2px 6px 0px rgba(95, 157, 231, 0.3);
                    }
                    &:active {
                        box-shadow: inset 0px 2px 4px 0px
                            rgba(121, 138, 160, 0.3);
                    }
                    &::before,
                    &::after {
                        content: "";
                        position: absolute;
                        background-color: #7e97b8;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        transition: background-color 0.2s ease;
                    }
                    &:hover::before,
                    &:hover::after {
                        background-color: #516d91;
                    }
                    &:active::before,
                    &:active::after {
                        background-color: #7e97b8;
                    }
                }
                &.active .name {
                    background-color: #000; 
                    color: #fff; 
                    border-color: rgba(
                        255,
                        255,
                        255,
                        0.333
                    ); 
                    box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
                        0px 6px 15px 0px rgba(121, 138, 160, 0.2); 
                    transition: 0.2s;
                }
                &.active:hover .name {
                    background-color: #000000; 
                    color: #fff; 
                    box-shadow: 0px 2px 6px 0px rgba(121, 138, 160, 0.3),
                        0px 4px 10px 0px rgba(121, 138, 160, 0.2); 
                }
            }
        }
        .bottom {
            position: absolute;
            width: 100%;
            height: 75px;
            padding: 15px;
            bottom: 0;
        }
        a.user {
            display: flex;
            position: absolute;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #4285f4; 
            background-color: white; 
            border-style: solid;
            border-width: 2px;
            border-color: rgba(255, 255, 255, 0.333);
            border-radius: 50%; 
            padding: 0;
            transition: 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.459);
            left: 18px;
            bottom: 15px; 
            box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
                0px 6px 15px 0px rgba(121, 138, 160, 0.2);
            cursor: pointer; 
            &:hover {
                color: #4285f4; 
                box-shadow: 0px 2px 6px 0px rgba(95, 157, 231, 0.3);
            }
            &:active {
                box-shadow: inset 0px 2px 4px 0px rgba(121, 138, 160, 0.3);
            }
        }
        a.model {
            display: flex;
            position: absolute;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #4285f4; 
            background-color: white; 
            border-style: solid;
            border-width: 2px;
            border-color: rgba(255, 255, 255, 0.333);
            border-radius: 50%; 
            padding: 0;
            transition: 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.459);
            left: 18px;
            bottom: 95px;
            box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
                0px 6px 15px 0px rgba(121, 138, 160, 0.2);
            cursor: pointer; 
            &:hover {
                color: #4285f4; 
                box-shadow: 0px 2px 6px 0px rgba(95, 157, 231, 0.3);
            }
            &:active {
                box-shadow: inset 0px 2px 4px 0px rgba(121, 138, 160, 0.3);
            }
        }
        a.setting {
            display: flex;
            position: absolute;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #4285f4; 
            background-color: white; 
            border-style: solid;
            border-width: 2px;
            border-color: rgba(255, 255, 255, 0.333);
            border-radius: 50%; 
            padding: 0;
            transition: 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.459);
            left: 18px;
            bottom: 175px;
            box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
                0px 6px 15px 0px rgba(121, 138, 160, 0.2);
            cursor: pointer; /
            &:hover {
                color: #4285f4; 
                box-shadow: 0px 2px 6px 0px rgba(95, 157, 231, 0.3);
            }
            &:active {
                box-shadow: inset 0px 2px 4px 0px rgba(121, 138, 160, 0.3);
            }
        }
    } 
    .conversation_id::-webkit-scrollbar {
        width: 0;
        display: none;
    }
    .right {
        position: relative;
        float: left;
        width: calc(100vw - 82px);
        height: 100%;
        .top {
            display: flex;
            align-items: center;
            height: 47px;
            background-color: #ffffff;
            border-bottom: 1px solid #e6e6e6;
            span {
                font-size: 15px;
                color: #999;
                .name {
                    color: #1a1a1a;
                }
            }
        }
        .chat {
            position: relative;
            overflow: hidden;
            padding: 0 25px 92px; 
            border: none;
            justify-content: flex-end;
            flex-direction: column;
            width: calc(100vw - 100px);
            max-height: calc(100% - 140px);
            overflow-y: auto; 
            margin-top: 20px;
            transform: translateX(10px);
            &.active-chat {
                display: block;
                display: flex;
                .bubble {
                    transition-timing-function: cubic-bezier(0.4, -0.04, 1, 1);
                }
            }
        }
        .chat::-webkit-scrollbar {
            width: 1px;
        }
        .write {
            position: absolute;
            bottom: 15px;
            left: 30px;
            height: 42px;
            padding-left: 5px;
            padding-right: 5px;
            border: 1px solid #e6e6e6;
            background-color: #ffffff;
            width: calc(100% - 58px);
            border-radius: 21px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between; 

            .input-text {
                font-size: 16px;
                flex-grow: 1;
                height: auto; 
                padding: 10px;
                color: #1a1a1a;
                border: 0;
                outline: none;
                background-color: transparent;
                resize: none; 
                min-height: 16px; 
                scrollbar-width: 0;
                max-height: 40px; 
            }
            .write-link {
                position: relative; 
                z-index: 1; 
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                height: 42px;
                text-align: center;
                transition: background-color 0.3s;
                svg {
                    fill: black; 
                    margin-top: 1px;
                    scale: 1.2;
                }
                &.send {
                    position: absolute;
                    right: 2px;
                    bottom: 2.5px;
                    margin-right: 1px;
                    width: 35px;
                    height: 35px;
                    font-family: inherit;
                    font-size: 13px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                    color: #4285f4; 
                    background-color: white; 
                    border-style: solid;
                    border-width: 2px;
                    border-color: rgba(255, 255, 255, 0.333);
                    border-radius: 50%; 
                    padding: 0;
                    transition: 0.2s;
                    border: 1px solid rgba(255, 255, 255, 0.459);
                    box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
                        0px 6px 15px 0px rgba(121, 138, 160, 0.2);
                    cursor: pointer; 
                    &:hover {
                        color: #4285f4; 
                        box-shadow: 0px 2px 6px 0px rgba(95, 157, 231, 0.3);
                    }
                    &:active {
                        box-shadow: inset 0px 2px 4px 0px
                            rgba(121, 138, 160, 0.3);
                    }
                }
                &:hover {
                    background-color: #f5f5f5;
                    border-radius: 50%;
                }
            }
        }

        .bubble {
            font-size: 15px; 
            position: relative;
            display: inline-block;
            clear: both;
            margin-bottom: 10px; 
            padding: 10px 15px; 
            vertical-align: top;
            border-radius: 12px; 
            width: auto;
            max-width: 100%; /
            min-width: 0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); 
            &:before {
                content: none; 
            }

            &.bot {
                float: left;
                color: #1a1a1a;
                background-color: #eceff1;
                align-self: flex-start;
                animation-name: slideFromLeft;
                border-bottom-left-radius: 4px; 
            }

            &.person {
                float: right;
                color: #1a1a1a;
                background-color: #eceff1;
                align-self: flex-end;
                animation-name: slideFromRight;
                border-bottom-right-radius: 4px; 
            }
        }

        .conversation-start {
            position: relative;
            width: 100%;
            margin-bottom: 20px; 
            text-align: center;
            span {
                font-size: 12px;
                display: inline-block;
                color: #666; 
                background-color: #f9f9f9; 
                padding: 0 8px; 

                &:before,
                &:after {
                    content: none; 
                }
            }
        }
    }
}

@keyframes slideFromLeft {
    0% {
        margin-left: -200px;
        opacity: 0;
    }
    100% {
        margin-left: 0;
        opacity: 1;
    }
}
@-webkit-keyframes slideFromLeft {
    0% {
        margin-left: -200px;
        opacity: 0;
    }
    100% {
        margin-left: 0;
        opacity: 1;
    }
}
@keyframes slideFromRight {
    0% {
        margin-right: -200px;
        opacity: 0;
    }
    100% {
        margin-right: 0;
        opacity: 1;
    }
}
@-webkit-keyframes slideFromRight {
    0% {
        margin-right: -200px;
        opacity: 0;
    }
    100% {
        margin-right: 0;
        opacity: 1;
    }
}
bubble img {
    width: 100%; 
    height: auto; 
}

@keyframes fadeInScale {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 20px;
    color: #333;
}

.close-button:hover {
    color: #000;
}

.close-button::before {
    content: "\00D7"; 
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        backdrop-filter: blur(0);
    }
    100% {
        opacity: 1;
        backdrop-filter: blur(10px);
    }
}

.conversation_id.enable-animations .conversation-enter-active,
.conversation_id.enable-animations .conversation-leave-active {
    transition: all 0.5s ease;
}

.conversation_id.enable-animations .conversation-enter,
.conversation_id.enable-animations .conversation-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

.conversation_id.enable-animations .conversation-move {
    transition: transform 0.5s ease;
}

.no-bullet {
    list-style-type: none;
}

.settings {
    display: none;
    position: absolute;
    left: 90px;
    bottom: 5rem;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 1rem;
    min-width: 10rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.avatar-section {
    margin-bottom: 1rem;
}

.username-section {
    margin-bottom: 1rem;
}

.username-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 2rem;
    font-size: 16px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.username-input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.login-button {
    width: auto;
}

@media (orientation: portrait) {
    .product-list {
        top: 55px;
        transform: none;
    }
}

.user-button {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #4285f4;
    background-color: white;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.333);
    border-radius: 50%;
    padding: 0;
    transition: 0.2s;
    border: 1px solid rgba(255, 255, 255, 0.459);
    box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
        0px 6px 15px 0px rgba(121, 138, 160, 0.2);
    cursor: pointer;
}

.user-button:hover {
    color: #4285f4;
    box-shadow: 0px 2px 6px 0px rgba(95, 157, 231, 0.3);
}

.user-button:active {
    box-shadow: inset 0px 2px 4px 0px rgba(121, 138, 160, 0.3);
}

.user-avatar {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
}

.avatar-upload-input {
    display: none;
}

.user-button-avatar {
    width: 41px;
    height: 41px;
    border-radius: 50%;
    transform: translateY(0px);
}

.save-button {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 35px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #ffffff;
    background-color: #1a1a1a;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.333);
    border-radius: 2rem;
    padding: 0 1rem;
    transition: 0.2s;
    border: 1px solid rgba(255, 255, 255, 0.459);
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3),
        0px 6px 15px 0px rgba(0, 0, 0, 0.2);
    line-height: 1; 
}

.save-button:hover {
    color: #ffffff;
    
    background-color: #333333;
    
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
    
}

.save-button:active {
    box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
    
}

* {
    user-select: none; 
}

.model-container {
    display: none;
    position: absolute;
    left: 90px;
    bottom: 6rem;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 1rem;
    min-width: 10rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1;
}

.model-container.open {
    display: block;
    z-index: 1;
}

.model-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.model-list {
    margin-bottom: 1rem;
    width: 100%;
}

.model-item {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 35px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    margin-top: 10px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #000000;
    background-color: #ffffff;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.333);
    border-radius: 2rem;
    padding: 10px 1rem;
    transition: 0.2s;
    border: 1px solid rgba(255, 255, 255, 0.459);
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3),
        0px 6px 15px 0px rgba(0, 0, 0, 0.2);
    line-height: 1; 
}

.model-item.active {
    box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
}

.model-item:hover {
    color: #000000;
    
    background-color: #ffffff;
    
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
    
}

.model-item.selected {
    background-color: #000; 
    color: #fff; 
    border-color: rgba(255, 255, 255, 0.333); 
    box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
        0px 6px 15px 0px rgba(121, 138, 160, 0.2); 
}

.model-item:last-child {
    border-bottom: none;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    z-index: 1000;
}

.modal {
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 1rem;
    width: 30rem;
    height: auto; /
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1;
    max-width: 90%;
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    position: relative; 
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%; 
    margin-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
}

.modal-header h2 {
    font-size: 1.5rem;
    color: #333;
    margin: 0; 
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #333;
    padding: 0; 
    line-height: 1; 
    position: absolute; 
    top: 20px; 
    right: 15px; 
}

.close-button:hover {
    color: #000;
}
.modal-body {
    margin-bottom: 20px;
    color: #555;
    line-height: 1.6;
    width: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
}

.model-parameters {
    margin-top: 10px;
    color: #666;
    width: 100%; 
}

.model-parameters label {
    display: block;
    margin-top: 10px;
}

.modelType {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    width: 100%; 
}

.modelType .option {
    flex: 1;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 2rem; 
    text-align: center;
    cursor: pointer;
    transition: background 0.3s ease, border-color 0.3s ease;
    background-color: white; 
    color: #333; /
    box-shadow: 0px 4px 10px 0px rgba(121, 138, 160, 0.3),
        0px 6px 15px 0px rgba(121, 138, 160, 0.2);
}

.modelType .option:hover {
    background: #f5f5f5; 
    border-color: #007bff;
}

.modelType .option.selected {
    background-color: #1a1a1a; 
    color: #ffffff; 
    border-color: rgba(255, 255, 255, 0.333); 
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3),
        0px 6px 15px 0px rgba(0, 0, 0, 0.2); 
}

.confirm-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 35px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #ffffff;
    background-color: #1a1a1a;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.333);
    border-radius: 2rem;
    padding: 0 1rem;
    transition: 0.2s;
    border: 1px solid rgba(255, 255, 255, 0.459);
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3),
        0px 6px 15px 0px rgba(0, 0, 0, 0.2);
    line-height: 1;
    margin-top: 20px; 
}

.confirm-button:hover {
    color: #ffffff;
    background-color: #333333;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
}

.confirm-button:active {
    box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
}
.input-text1 {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 2rem;
    font-size: 16px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-top: 10px; 
}

.input-text1:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.settings-container {
    display: none;
    position: absolute;
    left: 90px;
    bottom: 10.8rem;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 1rem;
    min-width: 10rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1;
}

.settings-container.open {
    display: block; 
}
.settings-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
