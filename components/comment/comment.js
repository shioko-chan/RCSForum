Component({
  properties: {
    sub: {
      type: Boolean,
      value: false,
    },
    index1: {
      type: Number,
      value: 0,
    },
    index2: {
      type: Number,
      value: 0,
    },
    pid: {
      type: String,
      value: "",
    },
    uid: {
      type: String,
      value: "",
    },
    content: {
      type: String,
      value: "此条帖子内容为空",
    },
    username: {
      type: String,
      value: "Anonymous",
    },
    timestamp: {
      type: String,
      value: "2024-10-5 18:00:00",
    },
    likes: {
      type: Number,
      value: 0,
    },
    avatar: {
      type: String,
      value: "/assets/images/anon.png",
    },
    liked: {
      type: Boolean,
      value: false,
    },
    images: {
      type: Array,
      value: [],
      observer: function (newVal, _) {
        const url = getApp().url;
        this.setData({
          "imageList": newVal.map(
            image_name => `${url}/image/${image_name}`
          ),
          "previewImageList": new Array(newVal.length),
        });
      },
    }
  },
  data: {
    defaultStates: {},
    imageList: [],
    previewImageList: [],
  },
  methods: {
    getIndex: function () {
      if (this.data.sub) {
        return { "index1": this.data.index1, "index2": this.data.index2 };
      }
      return { "index1": this.data.index1 };
    },
    handleReply: function () {
      this.triggerEvent("reply", { "pid": this.data.pid, ...this.getIndex(), });
    },
    imageLoaded: function (event) {
      const index = event.currentTarget.dataset.index;
      this.data.previewImageList[index] = event.detail.src_local;
      this.setData({ previewImageList: this.data.previewImageList });
    },
    navToDetail: function () {
      if (this.data.pid === "") return;
      getApp().setOnceStorage(this.data);
      tt.navigateTo({
        "url": `../../pages/topic/topic?pid=${this.data.pid}`,
        fail: function () {
          console.error("failed to navigate to topic");
        },
      });
    },
    navToUser: function () {
      if (this.data.uid === "") return;
      getApp().setOnceStorage(this.data);
      tt.navigateTo({
        "url": `../../pages/user/user?uid=${this.data.uid}`,
        fail: function () {
          console.error("failed to navigate to user");
        },
      });
    },
    handleLike: function () {
      if (this.data.liked) {
        this.setData({ liked: false });
        this.setData({ likes: this.data.likes - 1 });
        tt.request({
          "url": getApp().url + "/unlike/comment",
          "method": "POST",
          "header": {
            "Content-Type": "application/json; charset=utf-8",
            "authentication": getApp().token,
          },
          "data": { "pid": this.data.pid, ...this.getIndex(), },
          success: res => {
            console.info("like request success", res);
          },
          fail: res => {
            console.error("like request failed", res);
          },
        });
      }
      else {
        this.setData({ liked: true });
        this.setData({ likes: this.data.likes + 1 });
        tt.request({
          "url": getApp().url + "/like/comment",
          "method": "POST",
          "header": {
            "Content-Type": "application/json; charset=utf-8",
            "authentication": getApp().token,
          },
          "data": { "pid": this.data.pid, ...this.getIndex(), },
          success: res => {
            console.info("like request success", res);
          },
          fail: res => {
            console.error("like request failed", res);
          },
        });
      }
    },
    previewImage: function (event) {
      const index = event.currentTarget.dataset.index;
      const imageList = this.data.previewImageList;
      const currentImage = imageList[index];
      tt.previewImage({
        urls: imageList,
        current: currentImage,
        shouldShowSaveOption: true,
      })
    },
  }
})