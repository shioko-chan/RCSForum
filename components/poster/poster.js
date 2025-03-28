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
      observer(new_val, _) {
        this.setData({ show_delete_button: new_val === getApp().open_id || getApp().is_admin });
        if (new_val === "" || new_val === undefined || new_val === null) return;
        getApp().request({
          url: `${getApp().url}/ifuseradmin/${new_val}`,
          method: "GET",
        }).then(data => {
          this.setData({ is_admin: data.is_admin });
        }).catch(res => {
          console.error("is_admin request failed", res);
        });
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
    last_like: 0,
    show_delete_button: false,
    is_admin: false,
  },
  methods: {
    deletePoster() {
      if (!this.data.show_delete_button) { return; }
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
          url: `${getApp().url}/delete/topic`,
          method: "POST",
          header: {
            "Content-Type": "application/json; charset=utf-8",
          },
          data: { pid: this.data.pid },
        }).then(() => {
          tt.showModal({ title: "成功", content: "删除成功", showCancel: false, icon: "none" });
          this.triggerEvent("delete", { pid: this.data.pid });
        }).catch(res => {
          tt.showModal({ title: "失败", content: "删除失败", showCancel: false, icon: "none" });
          console.error("delete request failed", res);
        }).finally(() => tt.hideLoading());
      }).catch(() => { });
    },
    handleReply() {
      this.triggerEvent("reply", {});
    },
    imageLoaded(event) {
      const index = event.currentTarget.dataset.index;
      this.data.previewImageList[index] = event.detail.src_local;
      this.setData({ previewImageList: this.data.previewImageList });
    },
    navToDetail() {
      if (this.data.already_detail) return;
      getApp().set_once_storage(this.data);
      tt.navigateTo({
        url: `../../pages/topic/topic?pid=${this.data.pid}`,
        fail() {
          console.error("failed to navigate to topic");
        },
      });
    },
    navToUser() {
      if (this.data.already_user) return;
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
        url = `${getApp().url}/unlike/topic`;
      }
      else {
        this.setData({ liked: true });
        this.setData({ likes: this.data.likes + 1 });
        url = `${getApp().url}/like/topic`
      }
      getApp().request_with_authentication({
        url,
        method: "POST",
        header: {
          "Content-Type": "application/json; charset=utf-8",
        },
        data: { pid: this.data.pid },
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
  }
})