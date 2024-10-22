Page({
  data: {
    avatar: '',
    name: '',
    navItem2: true,
    topic_list: [],
  },
  onLoad: function () {
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
