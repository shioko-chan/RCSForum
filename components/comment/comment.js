Component({
  properties: {
    is_deleted: { type: Boolean, value: false },
    subs: {
      type: Array,
      value: [],
      observer(new_val, _) {
        this.setData({
          digests:
            new_val.slice(0, 3).map(
              ({ name, content }) => ({ content: Array.from(content).slice(0, 25).join(""), name })
            )
        })
      }
    },
    is_sub: {
      type: Boolean,
      value: false,
    },
    index_1: {
      type: Number,
      value: 0,
    },
    index_2: {
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
      observer(new_val, _) {
        console.log("new_val: ", new_val)
        this.setData({ show_delete_button: new_val === getApp().open_id || getApp().is_admin });
      },
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
      observer(newVal, _) {
        const url = getApp().url;
        this.setData({
          imageList: newVal.map(
            image_name => `${url}/image/${image_name}`
          ),
          previewImageList: new Array(newVal.length),
        });
      },
    }
  },
  data: {
    defaultStates: {},
    imageList: [],
    previewImageList: [],
    show_sub: false,
    digests: [],
    last_like: 0,
    scroll_top: 0,
    show_delete_button: false,
    deleted: false,
  },
  methods: {
    propagateDelete(event) {
      this.triggerEvent("delete", event.detail);
    },
    deleteComment() {
      const promise = new Promise((resolve, reject) => {
        tt.showModal({
          title: "警告", content: "删除后将不可恢复，是否继续", showCancel: true, icon: "none", success: res => {
            if (res.confirm) {
              resolve();
            } else {
              reject();
            }
          }, fail: reject
        })
      });
      promise.then(() => {
        tt.showLoading({ title: "删除中...", mask: true });
        getApp().request_with_authentication({
          url: `${getApp().url}/delete/comment`,
          method: "POST",
          header: {
            "Content-Type": "application/json; charset=utf-8",
          },
          data: { pid: this.data.pid, ...this.getIndex() },
        }).then(() => {
          tt.showModal({ title: "成功", content: "删除成功", showCancel: false, icon: "none" });
          this.triggerEvent("delete", this.getIndex());
        }).catch(res => {
          tt.showModal({ title: "失败", content: "删除失败", showCancel: false, icon: "none" });
          console.error("delete request failed", res);
        }).finally(() => tt.hideLoading());
      });
    },
    scrollToBottom() {
      this.setData({ show_sub: true, scroll_top: 0 });
      this.setData({ scroll_top: 99999999 });
    },
    closePane() {
      this.setData({
        show_sub: false,
      });
      this.triggerEvent("reply", {});
    },
    openPane() {
      this.setData({
        show_sub: true,
      });
      this.triggerEvent("reply", { toward: this.data.username, ...this.getIndex() });
    },
    getIndex() {
      if (this.data.is_sub) {
        return { index_1: this.data.index_1, index_2: this.data.index_2 };
      }
      return { index_1: this.data.index_1 };
    },
    handleReply() {
      this.triggerEvent("reply", { toward: this.data.username, ...this.getIndex() });
    },
    imageLoaded(event) {
      const index = event.currentTarget.dataset.index;
      this.data.previewImageList[index] = event.detail.src_local;
      this.setData({ previewImageList: this.data.previewImageList });
    },
    navToUser() {
      if (this.data.uid === "") return;
      getApp().set_once_storage(this.data);
      tt.navigateTo({
        url: `../../pages/user/user?uid=${this.data.uid}`,
        fail() {
          console.error("failed to navigate to user");
        },
      });
    },
    handleLike() {
      if (this.data.last_like + 500 > Date.now()) { return; }
      this.data.last_like = Date.now();
      let url = null;
      if (this.data.liked) {
        this.setData({ liked: false });
        this.setData({ likes: this.data.likes - 1 });
        url = `${getApp().url}/unlike/comment`;
      }
      else {
        this.setData({ liked: true });
        this.setData({ likes: this.data.likes + 1 });
        url = `${getApp().url}/like/comment`
      }
      getApp().request_with_authentication({
        url,
        method: "POST",
        header: {
          "Content-Type": "application/json; charset=utf-8",
        },
        data: { pid: this.data.pid, ...this.getIndex() },
      }).then(() => {
        console.info("like request success");
      }).catch(res => {
        console.error("like request failed", res);
      });
    },
    previewImage(event) {
      const index = event.currentTarget.dataset.index;
      const imageList = this.data.previewImageList;
      const currentImage = imageList[index];
      tt.previewImage({
        urls: imageList,
        current: currentImage,
        shouldShowSaveOption: true,
      })
    },
    propagateReply(event) {
      this.triggerEvent("reply", { ...event.detail });
    }
  }
})