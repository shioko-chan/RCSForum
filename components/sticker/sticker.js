Component({
  properties: {},
  data: {
    defaultStates: {},
    stickers: []
  },
  attached() {
    this.setData({ stickers: getApp().stickers });
  },
  methods: {
    async previewSticker(event) {
      const index = event.currentTarget.dataset.index;
      const src = this.data.stickers[index].url
      const filename = src.split('/').slice(-1)[0];
      const fileSystemManager = tt.getFileSystemManager();
      const targetFilePath = `ttfile://user/image/${filename}`;
      const preview = path => {
        tt.previewImage({
          urls: [path],
          current: path,
          shouldShowSaveOption: true,
        });
      };
      try {
        let path = await new Promise((resolve, reject) => {
          fileSystemManager.access({
            path: targetFilePath,
            success: _ => {
              resolve(targetFilePath);
            },
            fail: reject
          });
        });
        preview(path);
      } catch (res) {
        console.info("no image local, try fetch from server", res);
        tt.downloadFile({
          url: `${getApp().url}/stickers/${filename}`,
          filePath: targetFilePath,
          header: { "Content-Type": "application/json; charset=utf-8" },
          success: res => {
            preview(res.tempFilePath);
          },
          fail: res => {
            console.error("failed to download image: ", res);
          },
        });
      };
    },
    handleSticker(event) {
      const index = event.currentTarget.dataset.index;
      const sticker = `[${this.data.stickers[index].name}]`;
      this.triggerEvent("selected", { sticker });
    }
  }
})