Page({
  data: {
    avatar: '',
    username: '',
  },
  onLoad: function () {
    var app = getApp();
    this.setData({
      avatar: app.avatar,
      username: app.username,
    });
  },
})
