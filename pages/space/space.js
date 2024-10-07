Page({
  data: {

  },
  onLoad: function () {
    console.log('Welcome to Mini Code');
    tt.request({
      url: "http://127.0.0.1:5000/fuck",
      success: res => { console.log(res) }
    });
  },
  handleEmoji: function () {
    this.setData({ showEmojiArea: !this.data.showEmojiArea });
    console.log(123);
  }
})
