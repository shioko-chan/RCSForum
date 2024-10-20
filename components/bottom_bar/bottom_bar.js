Component({
  properties: {
    showEmojiArea: {
      type: Boolean,
      value: true,
    }
  },
  data: {
    defaultStates: {}
  },
  methods: {
    handleEmoji: function () {
      this.setData({ showEmojiArea: !this.data.showEmojiArea });
    }
  }
})