Component({
  properties: {
    already_user: {
      type: Boolean,
      value: false,
    },
    already_detail: {
      type: Boolean,
      value: false,
    },
    is_digest: {
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
    handleReply: function () {
      this.triggerEvent("reply", {});
    },
    imageLoaded: function (event) {
      const index = event.currentTarget.dataset.index;
      this.data.previewImageList[index] = event.detail.src_local;
      this.setData({ previewImageList: this.data.previewImageList });
    },
    navToDetail: function () {
      if (this.data.already_detail) return;
      getApp().setOnceStorage(this.data);
      tt.navigateTo({
        "url": `../../pages/topic/topic?pid=${this.data.pid}`,
        fail: function () {
          console.error("failed to navigate to topic");
        },
      });
    },
    navToUser: function () {
      if (this.data.already_user) return;
      getApp().setOnceStorage(this.data);
      tt.navigateTo({
        "url": `../../pages/user/user?uid=${this.data.uid}`,
        fail: function () {
          console.error("failed to navigate to user");
        },
      });
    },
    handleLike: function () {
      let request = null;
      const process_failure = res => {
        if (res.statusCode === 401 && cnt <= 0) {
          getApp().login().then(() => { request(cnt + 1); }).catch(() => { console.error("login failed") });
        } else {
          console.error("like request failed", res);
        }
      };
      if (this.data.liked) {
        this.setData({ liked: false });
        this.setData({ likes: this.data.likes - 1 });
        request = cnt => {
          tt.request({
            "url": `${getApp().url}/unlike/topic`,
            "method": "POST",
            "header": {
              "Content-Type": "application/json; charset=utf-8",
              "authentication": getApp().token,
            },
            "data": { "pid": this.data.pid, },
            success: res => {
              if (res.statusCode === 200) {
                console.info("like request success", res);
              } else {
                process_failure(res);
              }
            },
            fail: res => {
              process_failure(res);
            },
          });
        };
      }
      else {
        this.setData({ liked: true });
        this.setData({ likes: this.data.likes + 1 });
        request = cnt => {
          tt.request({
            "url": getApp().url + "/like/topic",
            "method": "POST",
            "header": {
              "Content-Type": "application/json; charset=utf-8",
              "authentication": getApp().token,
            },
            "data": { "pid": this.data.pid, },
            success: res => {
              if (res.statusCode === 200) {
                console.info("like request success", res);
              } else {
                process_failure(res);
              }
            },
            fail: res => {
              process_failure(res);
            },
          });
        };
      }
      request(0);
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