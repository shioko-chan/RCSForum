Page({
  data: {
    showEmojiArea: false,
    poster: null,
  },
  onLoad: function () {
    // console.log(getApp().once_storage);
    this.setData({ "poster": getApp().once_storage });
    // console.log(this.data);
  },
  handleEmoji: function () {
    this.setData({ "showEmojiArea": !this.data.showEmojiArea });
  },
  handleScrollUpdate: function () {
    console.log("scrolled");
  }
})
