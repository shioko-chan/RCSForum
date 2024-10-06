Page({
  data: {

  },
  onLoad: function () {
    console.log('Welcome to Mini Code');

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
    tt.request({
      url: "http://127.0.0.1:5000/fuck",
      success: res => { console.log(res) }
    });
  },
  handleEmoji: function () {
    console.log(123);
  }
})
