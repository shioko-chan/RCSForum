Component({
  properties: {
    src: {
      type: String,
      value: "",
    }
  },
  data: {
    src_local: "",
    defaultStates: {},
  },
  attached: function () {
    const src = this.data.src;
    const filename = src.split('/').slice(-1)[0];
    const fileSystemManager = tt.getFileSystemManager();
    const targetFilePath = `ttfile://user/${filename}`
    fileSystemManager.access({
      path: targetFilePath,
      success: _ => {
        console.info("image local exists");
        this.setData({
          "src_local": targetFilePath,
        });
      },
      fail: res => {
        console.info("no image local, try fetch from server", res);
        tt.downloadFile({
          url: src,
          filePath: targetFilePath,
          success: res => {
            this.setData({
              "src_local": res.tempFilePath,
            });
          },
          fail: res => {
            console.error("failed to download image: ", res);
          },
        });
      },
    });
  },
  methods: {

  }
})