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
    focus: false,
    reply: "",
    skip: 0,
    is_anonymous: false,
    display_index: 0,
    emojis: [
      "😀", "😊", "😎", "😇", "🧐", "🤓", "🤡", "🥹", "🫨", "🤭", "👿", "🤔",
      "😢", "🤯", "🥳", "😴", "😡", "🤮", "😱", "😓", "😥", "🤐", "🤤", "🤣",
      "🥵", "😘", "😂", "😅", "😭", "😊", "😒", "🤗", "🤩", "🫡", "🤨", "😐",
      "😑", "😣", "🥱", "🙃", "❤️", "✅", "❎", "⚠️", "👏", "✌️", "🤞", "🤟",
      "🙌", "👊", "👋", "🙏", "🤙", "🤘", "🐶", "🐱", "🐰", "🦊", "🐻", "🐼",
      "🐨", "🦁", "🐯", "🐷", "🍎", "🍌", "🍕", "🍩", "🍔", "🍣", "🍤", "🍜",
      "🍫", "☕", "🏀", "⚽", "🏈", "🎾", "🏐", "🏓", "🎱", "🏸", "⛳", "🏊",
      "☀️", "🌧️", "💕", "💞", "❣️", "💔", "💖", "💝", "💗", "💓", "💌", "💟",
      "🌈", "🌍", "🌙", "🌊", "⛄", "🌸", "🍳", "👍", "🍂", "🍀", "🚗", "🚕",
      "🚙", "🚀", "🚲", "✈️", "🚤", "🚊", "🚉", "🚁", "🎂", "🎉", "🎊", "🕯️",
      "🎁", "🎄", "🎃", "🧧", "🕎", "🕊️", "📱", "💻", "🖥️", "🖨️", "⌚", "📷",
      "🎥", "🎧", "📚", "🖊️",
    ],
    prefix: "",
    index_1: null,
  },
  methods: {
    focusReply({ toward = null, index_1 = null, index_2 = null }) {
      this.setData({ focus: false });
      this.setData({ focus: true, focus: index_1 !== null });
      this.data.index_1 = index_1;
      if (index_2 === null || toward === null) { return; }
      const prefix = `回复 ${toward}: `;
      const skip = Math.max(this.data.skip - this.data.prefix.length + prefix.length, 0);
      const reply = (() => {
        if (this.data.reply.startsWith(this.data.prefix)) {
          return this.data.reply.slice(this.data.prefix.length);
        } else {
          return this.data.reply;
        }
      })();
      this.setData({ reply: "", skip: 0 });
      this.setData({ reply: prefix + reply, skip: skip });
      this.data.prefix = prefix;
    },
    handleShowEmojiArea() {
      this.setData({ display_index: this.data.display_index !== 1 ? 1 : 0 });
    },
    handleShowStickerArea() {
      this.setData({ display_index: this.data.display_index !== 2 ? 2 : 0 });
    },
    handleShowImageArea() {
      this.setData({ display_index: this.data.display_index !== 3 ? 3 : 0 });
    },
    clearAll() {
      this.setData({ reply: "foo", skip: 3 });
      this.setData({
        is_anonymous: false,
        reply: "",
        skip: 0,
        focus: false,
        display_index: 0,
      });
      this.data.toward = "";
      this.data.index_1 = null;
      this.selectComponent("#image-selector").clearImage();
    },
    async handleSend() {
      if (this.data.reply.length === 0) {
        tt.showToast({
          title: "多少写点内容呗",
          icon: "none",
          duration: 2500,
        });
        return;
      }
      if (this.data.pid === "") {
        return;
      }
      let image_list = [];
      if (!this.data.no_image) {
        image_list = await this.selectComponent("#image-selector").uploadImage().catch(() => null);
        if (image_list === null) {
          tt.showToast({
            title: "图片上传失败",
            icon: "error",
            duration: 2500,
          });
          return;
        }
      }
      let data = {
        content: this.data.reply,
        is_anonymous: this.data.is_anonymous,
        pid: this.data.pid,
        images: image_list,
      }
      if (this.data.index_1 !== null) {
        data.index_1 = this.data.index_1;
      }
      tt.showLoading({
        title: '发布中',
        mask: true,
      });
      getApp().request_with_authentication({
        url: `${getApp().url}/create/comment`,
        method: "POST",
        header: {
          "Content-Type": "application/json; charset=utf-8",
        },
        data
      }).then(() => {
        this.clearAll();
        tt.hideLoading();
        tt.showToast({
          title: "评论成功✅",
          icon: "success",
          duration: 2500,
        });
        if (!data.is_anonymous) {
          data.name = getApp().username;
          data.avatar = getApp().avatar;
        }
        this.triggerEvent("comment", data);
      }).catch(err => {
        console.log(err);
        tt.hideLoading();
        tt.showToast({
          title: "评论发布失败",
          icon: "error",
          duration: 2500,
        });
      });
    },
    handleToggleAnonymous() {
      this.setData({ is_anonymous: !this.data.is_anonymous });
    },
    setInput(item) {
      let { skip, reply } = this.data;
      this.setData({
        reply: reply.slice(0, skip) + item + reply.slice(skip),
        skip: skip + item.length
      });
    },
    handleEmojiInput(event) {
      this.setInput(this.data.emojis[event.currentTarget.dataset.index]);
    },
    handleStickerInput(event) {
      this.setInput(event.detail.sticker);
    },
    handleInput(event) {
      this.data.reply = event.detail.value;
      this.data.skip = event.detail.cursor;
    },
    handleBlur(event) {
      this.data.skip = event.detail.cursor;
    },
  }
})