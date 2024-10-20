Component({
  properties: {
    index_1: {
      type: Number,
      value: -1,
    },
    pid: {
      type: String,
      value: "",
    },
    toward: {
      type: String,
      value: "",
      observer: function (new_val, old_val) {
        const prefix = `回复 ${old_val}: `;
        const new_prefix = `回复 ${new_val}: `;
        if (this.data.reply.startsWith(prefix)) {
          this.setData({ "reply": `${new_prefix}${this.data.reply.slice(prefix.length)}`, "skip": new_prefix.length });
          return;
        }
        this.setData({ "reply": `${new_prefix}${this.data.reply}`, "skip": new_prefix.length });
      }
    },
  },
  data: {
    defaultStates: {},
    skip: 0,
    focus: false,
    value: false,
    reply: "",
    is_anonymous: false,
    display_index: 0,
    emoji: [
      "😀", "😊", "😎", "🤔", "😢", "🤯", "🥳", "😴", "😡", "🤮", "😱", "❤️", "💕", "💞", "❣️", "💔", "💖", "💝", "💗", "💓", "💌", "💟",
      "👍", "👏", "✌️", "🤞", "🤟", "🙌", "👊", "👋", "🙏", "🤙", "🤘", "🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐷",
      "🍎", "🍌", "🍕", "🍩", "🍔", "🍣", "🍤", "🍜", "🍫", "☕", "🏀", "⚽", "🏈", "🎾", "🏐", "🏓", "🎱", "🏸", "⛳", "🏊",
      "☀️", "🌧️", "🌈", "🌍", "🌙", "🌊", "⛄", "🌸", "🍂", "🍀", "🚗", "🚕", "🚙", "🚀", "🚲", "✈️", "🚤", "🚊", "🚉", "🚁",
      "🎂", "🎉", "🎊", "🕯️", "🎁", "🎄", "🎃", "🧧", "🕎", "🕊️", "📱", "💻", "🖥️", "🖨️", "⌚", "📷", "🎥", "🎧", "📚", "🖊️"
    ],
  },
  methods: {
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
    handleSend: function () {
      console.log(this.data.index_1);
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
      const url = `${getApp().url}/create/comment`;
      let data = {
        "content": this.data.reply,
        "is_anonymous": this.data.is_anonymous,
        "pid": this.data.toward.pid,
        "images": this.data.images,
      }
      if (this.data.index_1 !== null) {
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
                    reject(res.statusCode);
                  });
              } else {
                reject(res.statusCode);
              }
            },
            fail: res => {
              reject(res);
            }
          });
        })
      };
      req(0).then(() => {
        this.setData({ "reply": "", "images": [] });
        tt.showToast({
          "title": "评论成功",
          "icon": "success",
          "duration": 2500,
        });
      }).catch(() => {
        tt.showToast({
          "title": "评论失败",
          "icon": "none",
          "duration": 2500,
        });
      });
    },
    handleEmojiInput: function (event) {
      let { cursor, content } = this.data;
      this.setData({
        "content": content.slice(0, cursor) + event.detail.emoji + content.slice(cursor),
        "cursor": cursor + event.detail.emoji.length
      });
    },
    handleInput: function (event) {
      this.data.content = event.detail.value;
    },
  }
})