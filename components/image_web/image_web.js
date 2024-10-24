Component({
  properties: {
    src: {
      type: String,
      value: "",
      async observer(newVal, _) {
        const src = newVal;
        const filename = src.split('/').slice(-1)[0];
        const fileSystemManager = tt.getFileSystemManager();
        const targetFilePath = `ttfile://user/${filename}`
        const setSrcLocal = path => {
          this.triggerEvent("imageLoaded", { src_local: path });
          this.setData({ "src_local": path });
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
          setSrcLocal(path);
        } catch (res) {
          console.info("no image local, try fetch from server", res);
          tt.downloadFile({
            url: src,
            filePath: targetFilePath,
            header: { "Content-Type": "application/json; charset=utf-8" },
            success: res => {
              setSrcLocal(res.tempFilePath);
            },
            fail: res => {
              console.error("failed to download image: ", res);
            },
          });
        };
      },
    }
  },
  data: {
    src_local: "",
    defaultStates: {},
  },
  methods: {

  }
})