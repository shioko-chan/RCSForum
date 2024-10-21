Component({
  properties: {
    src: {
      type: String,
      value: "",
      observer: function (newVal, _) {
        const src = newVal;
        const filename = src.split('/').slice(-1)[0];
        const fileSystemManager = tt.getFileSystemManager();
        const targetFilePath = `ttfile://user/${filename}`
        const setSrcLocal = path => {
          this.triggerEvent("imageLoaded", { src_local: path });
          this.setData({
            "src_local": path,
          })
        };
        fileSystemManager.access({
          path: targetFilePath,
          success: _ => {
            console.info("image local exists");
            setSrcLocal(targetFilePath);
          },
          fail: res => {
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
          },
        });
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