Component({
  properties: {
    pid: {
      type: String,
      value: "",
    },
  },
  data: {
    defaultStates: {},
    no_image: false,
    skip: 0,
    focus: false,
    reply: "",
    is_anonymous: false,
    display_index: 0,
    emoji: [
      "😀", "😊", "😎", "😇", "🧐", "🤓", "🤡", "🥹", "🫨", "🤭", "👿", "🤔",
      "😢", "🤯", "🥳", "😴", "😡", "🤮", "😱", "😓", "😥", "🤐", "🤤", "🤣",
      "🥵", "😘", "😂", "😅", "😭", "😊", "😒", "🤗",
      "🤩", "🫡", "🤨", "😐", "😑", "😣", "🥱", "🙃", "❤️", "✅", "❎", "⚠️",
      "👏", "✌️", "🤞", "🤟", "🙌", "👊", "👋", "🙏", "🤙", "🤘", "🐶", "🐱",
      "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐷", "🍎", "🍌", "🍕", "🍩",
      "🍔", "🍣", "🍤", "🍜", "🍫", "☕", "🏀", "⚽", "🏈", "🎾", "🏐", "🏓",
      "🎱", "🏸", "⛳", "🏊", "☀️", "🌧️", "💕", "💞", "❣️", "💔", "💖", "💝",
      "💗", "💓", "💌", "💟", "🌈", "🌍", "🌙", "🌊", "⛄", "🌸", "🍳", "👍",
      "🍂", "🍀", "🚗", "🚕", "🚙", "🚀", "🚲", "✈️", "🚤", "🚊", "🚉", "🚁",
      "🎂", "🎉", "🎊", "🕯️", "🎁", "🎄", "🎃", "🧧", "🕎", "🕊️", "📱", "💻",
      "🖥️", "🖨️", "⌚", "📷", "🎥", "🎧", "📚", "🖊️",
    ],
    toward: "",
  },
  methods: {
    focusReply: function (toward, index_1) {
      this.setData({ "focus": true });
      if (index_1 != null) {
        this.setData({ "no_image": true })
      }
      else {
        this.setData({ "no_image": false })
      }
      if (toward == null) { return; }
      if (toward === this.data.toward || toward === "") { return; }
      const prefix = `回复 ${this.data.toward}: `;
      const new_prefix = `回复 ${toward}: `;
      const skip = Math.max(this.data.skip - prefix.length + new_prefix.length, 0);
      const reply = (() => {
        if (this.data.reply.startsWith(prefix)) {
          return this.data.reply.slice(prefix.length);
        }
        else {
          return this.data.reply;
        }
      })();
      this.setData({
        "reply": `${new_prefix}${reply}`,
        "skip": skip
      });
    },
    handleShowEmojiArea: function () {
      if (this.data.display_index !== 1) {
        this.setData({ display_index: 1 });
      }
      else {
        this.setData({ display_index: 0 });
      }
    },
    handleShowLargeEmojiArea: function () {
      if (this.data.display_index !== 2) {
        this.setData({ display_index: 2 });
      }
      else {
        this.setData({ display_index: 0 });
      }
    },
    handleShowImageArea: function () {
      if (this.data.display_index !== 3) {
        this.setData({ display_index: 3 });
      } else {
        this.setData({ display_index: 0 });
      }
    },
    clearAll: function () {
      this.setData({
        "is_anonymous": false,
        "reply": "",
        "skip": 0,
        "focus": false,
      });
      this.selectComponent("#image-selector").clearImage();
    },
    handleSend: async function () {
      if (this.data.reply.length === 0) {
        tt.showToast({
          "title": "多少写点内容呗",
          "icon": "none",
          "duration": 2500,
        });
        return;
      }
      if (this.data.pid === "") {
        return;
      }
      const image_list = await this.selectComponent("#image-selector").uploadImage().catch(() => {
        tt.showToast({
          "title": "图片上传失败",
          "icon": "error",
          "duration": 2500,
        });
        return null;
      });
      if (image_list === null) {
        return;
      }
      const url = `${getApp().url}/create/comment`;
      let data = {
        "content": this.data.reply,
        "is_anonymous": this.data.is_anonymous,
        "pid": this.data.pid,
        "images": image_list,
      }
      if (this.data.index_1 !== -1) {
        data.index_1 = this.data.index_1;
      }
      const req = cnt => {
        return new Promise((resolve, reject) => {
          tt.request({
            "url": url,
            "method": "POST",
            "header": {
              "Content-Type": "application/json; charset=utf-8",
              "authentication": getApp().token,
            },
            "data": data,
            success: res => {
              if (res.statusCode === 200) {
                resolve();
              } else if (res.statusCode === 401 && cnt <= 0) {
                getApp().login()
                  .then(() => req(cnt + 1))
                  .catch(() => {
                    console.error("评论发布失败", res);
                    reject(res.statusCode);
                  });
              } else {
                console.error("评论发布失败", res);
                reject(res.statusCode);
              }
            },
            fail: res => {
              console.error("评论发布失败", res);
              reject(res);
            }
          });
        })
      };
      tt.showLoading({
        title: '发布中',
        mask: true,
      });
      req(0).then(() => {
        this.clearAll();
        tt.hideLoading();
        tt.showToast({
          "title": "评论成功✅",
          "icon": "success",
          "duration": 2500,
        });
      }).catch(() => {
        tt.hideLoading();
        tt.showToast({
          "title": "评论发布失败",
          "icon": "error",
          "duration": 2500,
        });
      });

    },
    handleEmojiInput: function (event) {
      let { skip, reply } = this.data;
      const emoji = this.data.emoji[event.currentTarget.dataset.index];
      this.setData({
        "reply": reply.slice(0, skip) + emoji + reply.slice(skip),
        "skip": skip + emoji.length
      });
    },
    handleLargeEmojiInput: function (event) {
      let { skip, reply } = this.data;
      this.setData({
        "reply": reply.slice(0, skip) + event.detail.emoji + reply.slice(skip),
        "skip": skip + event.detail.emoji.length
      });
    },
    handleInput: function (event) {
      this.data.reply = event.detail.value;
      this.data.skip = event.detail.cursor;
    },
    handleInputBlur: function (event) {
      this.data.skip = event.detail.cursor;
    },
  }
})