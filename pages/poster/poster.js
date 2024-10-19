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
    }
  },
  data: {
    defaultStates: {},
    imageList: [],
  },
  attached: function () {
    const url = getApp().url;
    this.setData({
      "imageList": this.data.images.map(
        image_name => `${url}/image/${image_name}`
      )
    });
  },
  methods: {
    handleNavToDetail: function () {
      if (this.data.pid === "") return;
      this.triggerEvent("posterdetail", { "pid": this.data.pid });
    },
    handleTapUserInfo: function () {
      if (this.data.uid === "") return;
      this.triggerEvent("userinfo", { "uid": this.data.uid });
    },
    handleLike: function () {
      if (this.data.isLiked) {
        this.setData({ isLiked: false });
        this.setData({ likeCount: this.data.likeCount - 1 });
      }
      else {
        this.setData({ isLiked: true });
        this.setData({ likeCount: this.data.likeCount + 1 });
      }
    },
    previewImage: function (event) {
      const index = event.currentTarget.dataset.index;
      const imageList = this.data.images;
      const currentImage = this.data.images[index];
      tt.previewImage({
        urls: imageList,
        current: currentImage,
        shouldShowSaveOption: true,
      })
    }
  }
})