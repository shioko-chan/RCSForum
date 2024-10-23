Component({
  properties: {

  },
  data: {
    defaultStates: {},
    stickers: []
  },
  methods: {
    attached() {
      this.stickers = getApp().stickers;
    },
    previewSticker(event) {
      const index = event.currentTarget.dataset.index;
      const currentImage = this.data.stickers[index].url;
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