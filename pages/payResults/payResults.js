// pages/payResults/payResults.js
const main = require('../../utils/main.js');
Page({
  data: {},
  onLoad(op) {
    let text = "支付成功"
    if (op.payResults == 0) {
      text = "支付失败"
    }
    this.setData({
      payResults: op.payResults,
      text: text,
      id: op.id,
      status: op.status,
      order_id: op.order_id
    })
  },
  back(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    let order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?type=' + type + '&id=' + id +'&order_id=' + order_id,
    })
  }
})