Page({
  data: {
    showEmojiArea: false,
    centerItem: true,
  },
  onLoad: function () {

  },
  handleEmoji: function () {
    this.setData({ showEmojiArea: !this.data.showEmojiArea });
    console.log(123);
  }
})
