Component({
  properties: {
    is_digest: {
      type: Boolean,
      value: false,
    },
    content: {
      type: String,
      value: "",
      observer(new_val, _) {
        const matchEmoji = emoji_name => {
          return this.data.emojis.find(e => e.name === emoji_name)?.url || null;
        };

        const raw_str = new_val;
        let start = 0;
        this.setData({ "itemList": [] });

        for (let i = 0; i < raw_str.length; i++) {
          if (raw_str[i] !== "[") continue;
          const endIdx = raw_str.indexOf("]", i);
          if (endIdx === -1) break;

          const emoji_name = raw_str.slice(i + 1, endIdx);
          const emoji_url = matchEmoji(emoji_name);

          if (emoji_url === null) continue;

          if (start < i) {
            this.data.itemList.push({
              is_text: true,
              text: raw_str.slice(start, i),
            });
          }

          this.data.itemList.push({
            is_text: false,
            src: emoji_url,
          });

          start = endIdx + 1;
          i = endIdx;
        }

        if (start < raw_str.length) {
          this.data.itemList.push({
            is_text: true,
            text: raw_str.slice(start),
          });
        }
        this.setData({ "itemList": this.data.itemList });
      }
    },
  },
  data: {
    defaultStates: {},
    itemList: [],
    emojis: []
  },
  methods: {
    attached() { this.emojis = getApp().emojis; },
    previewEmoji(event) {
      const currentImage = event.currentTarget.dataset.src;
      tt.previewImage({
        urls: [currentImage],
        current: currentImage,
        shouldShowSaveOption: true,
      });
    },
    handleEmoji(event) {
      const index = event.currentTarget.dataset.index;
      const emoji = `[${this.data.emojis[index].name}]`;
      this.triggerEvent("selected", { emoji });
    }
  }
})