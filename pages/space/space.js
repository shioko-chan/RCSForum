Page({
  data: {
    avatar: '',
    username: '',
    navItem2: true,
  },
  onLoad: function () {
    var app = getApp();
    this.setData({
      avatar: app.avatar,
      username: app.username,
    });
  },
})
