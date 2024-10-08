Page({
  data: {
    showEmojiArea: false,
    navItem1: false,
    navItem2: false,
  },
  onLoad: function () {
    // tt.request({
    //   url: "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    //   method: "POST",
    //   data: {
    //     app_id: "cli_a67536fc8d7c900c",
    //     app_secret: "jP6JiySRzOLy6TiZEjS6GcK4eAU4QnmI",
    //   },
    //   success: res => {
    //     console.log(res, "success");
    //   },
    //   fail: res => {
    //     console.log(res, "fail");
    //   }
    // })
  },
  handleEmoji: function () {
    this.setData({ showEmojiArea: !this.data.showEmojiArea });
    console.log(123);
  }
})
