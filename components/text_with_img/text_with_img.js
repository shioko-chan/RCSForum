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
        const matchSticker = sticker_name => {
          let array = null;
          if (this.data.stickers.length === 0) {
            array = getApp().stickers;
          }
          else {
            array = this.data.stickers;
          }
          return array.find(e => e.name === sticker_name)?.url || null;
        };

        const raw_str = new_val;
        let start = 0;
        this.setData({ "itemList": [] });

        for (let i = 0; i < raw_str.length; i++) {
          if (raw_str[i] !== "[") continue;
          const endIdx = raw_str.indexOf("]", i);
          if (endIdx === -1) break;

          const sticker_name = raw_str.slice(i + 1, endIdx);
          const sticker_url = matchSticker(sticker_name);

          if (sticker_url === null) continue;

          if (start < i) {
            this.data.itemList.push({
              is_text: true,
              text: raw_str.slice(start, i),
            });
          }

          this.data.itemList.push({
            is_text: false,
            src: sticker_url,
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
    stickers: []
  },
  attached() {
    this.setData({ stickers: getApp().stickers });
  },
  methods: {
    previewSticker(event) {
      const currentImage = event.currentTarget.dataset.src;
      tt.previewImage({
        urls: [currentImage],
        current: currentImage,
        shouldShowSaveOption: true,
      });
    },
    handleSticker(event) {
      const index = event.currentTarget.dataset.index;
      const sticker = `[${this.data.stickers[index].name}]`;
      this.triggerEvent("selected", { sticker });
    }
  }
})