Page({
  data: {
    avatar: '',
    name: '',
    nav_item2: true,
    topic_list: [],
    is_me: false,
  },
  deleteFromList(event) {
    this.data.topic_list.splice(this.data.topic_list.findIndex(item => item.pid === event.detail.pid), 1);
    this.setData({ topic_list: this.data.topic_list });
  },
  onLoad({ uid }) {
    tt.showLoading({ title: "加载中...", mask: true });
    getApp().request_with_authentication({
      url: `${getApp().url}/user/${uid}`,
      method: "GET",
      header: { "Content-Type": "application/json; charset=utf-8" }
    })
      .then(data => {
        this.setData({ avatar: data.avatar, name: data.name, is_me: uid === getApp().open_id });
        this.setData({ topic_list: data.topics });
      })
      .catch(({ mes, res }) => console.error("Error msg: ", mes, "result: ", res)).finally(() => tt.hideLoading());
  },
})
