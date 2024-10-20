Component({
  properties: {
    showall: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: "此条帖子标题为空"
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
    likeCount: {
      type: Number,
      value: 0,
    },
    avatar: {
      type: String,
      value: "/assets/images/anon.png",
    },
    isLiked: {
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
    handleReply: function () {
      this.triggerEvent("reply", { "pid": this.data.pid, });
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
    handleNavToDetail: function () {
      this.triggerEvent("posterdetail", { "pid": this.data.pid });
    },
    handleTapUserInfo: function () {
      this.triggerEvent("userinfo", { "uid": this.data.uid });
    },
    handleLike: function () {
      if (this.data.isLiked) {
        this.setData({ isLiked: false });
        this.setData({ likeCount: this.data.likeCount - 1 });
        tt.request({
          "url": `${getApp().url}/unlike/topic`,
          "method": "POST",
          "header": {
            "Content-Type": "application/json; charset=utf-8",
            "authentication": getApp().token,
          },
          "data": { "pid": this.data.pid, },
          success: res => {
            console.info("like request success", res);
          },
          fail: res => {
            console.error("like request failed", res);
          },
        });
      }
      else {
        this.setData({ isLiked: true });
        this.setData({ likeCount: this.data.likeCount + 1 });
        tt.request({
          "url": getApp().url + "/like/topic",
          "method": "POST",
          "header": {
            "Content-Type": "application/json; charset=utf-8",
            "authentication": getApp().token,
          },
          "data": { "pid": this.data.pid, },
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