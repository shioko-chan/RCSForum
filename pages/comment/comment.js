Component({
  properties: {
    content: {
      type: String,
      value: "此条评论内容为空",
    },
    username: {
      type: String,
      value: "匿名用户",
    },
    timestamp: {
      type: String,
      value: "2024-10-5",
    },
    likeCount: {
      type: Number,
      value: 100,
    },
    avatar: {
      type: String,
      value: "./test.jpg",
    },
    isLiked: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    defaultStates: {}
  },
  methods: {
    tapName: function (event) {
      console.log(event)
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
  }
})