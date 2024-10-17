Page({
  data: {
    showEmojiArea: false,
  },
  onLoad: function () {
  },
  handleEmoji: function () {
    this.setData({ showEmojiArea: !this.data.showEmojiArea });
  },
  handleScrollUpdate: function () {
    console.log("scrolled");
  }
})
