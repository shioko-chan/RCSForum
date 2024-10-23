Page({
  data: {
    avatar: '',
    name: '',
    nav_item2: true,
    topic_list: [],
  },
  onLoad() {
    var app = getApp();
    this.setData({
      avatar: app.avatar,
      name: app.username,
    });
    getApp().request_with_authentication({
      url: `${app.url}/user/${app.open_id}`,
      method: "GET",
      header: { "Content-Type": "application/json; charset=utf-8" },
    }).then(data => {
      this.setData({ "topic_list": data.topics });
    });
  },
})
