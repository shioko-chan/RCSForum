Component({
  properties: {

  },
  data: {
    defaultStates: {},
    emojis: []
  },
  methods: {
    attached() {
      this.emojis = getApp().emojis;
    },
    previewEmoji(event) {
      const index = event.currentTarget.dataset.index;
      const currentImage = this.data.emojis[index].url;
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