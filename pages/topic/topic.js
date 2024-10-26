Page({
  data: {
    poster: null,
    comment_list: [],
    index_1: -1,
    toward: "",
  },
  onLoad() {
    const data = getApp().once_storage;
    this.setData({ poster: data });
    this.handleRefresh();
  },
  handleReply(event) {
    this.selectComponent("#bottom-bar").focusReply(event.detail);
  },
  handleComment(event) {
    const data = event.detail;
    this.data.comment_list.push(data);
    this.setData({ comment_list: this.data.comment_list });
  },
  handleRefresh() {
    tt.showLoading({
      title: '获取评论中...',
      mask: true,
    });
    getApp().request_with_authentication({
      url: `${getApp().url}/comment/${this.data.poster.pid}`,
      method: "GET",
      header: { "Content-Type": "application/json; charset=utf-8" },
    }).then(data => {
      const comments = data.comments;
      this.setData({
        comment_list: comments.map(comment => {
          if (comment.is_anonymous) {
            comment.avatar = "/assets/images/anon.png";
            comment.name = "anonymous";
          }
          return comment;
        })
      });
    }).catch(({ mes, res }) => {
      console.error(mes, res);
      getApp()._show_modal({ title: "获取评论失败", content: "" });
    }).finally(() => tt.hideLoading());
  }
})
