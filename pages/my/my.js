// pages/my/my.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    hasUserInfo: false,
    state: 0,
    balance:0,
    integral:0
  },
  onShow() {
    this.init()
    if (this.data.hasUserInfo) {
      let token = app.globalData.token;
      util.http('member/info', {}, 'get', token).then(res => {
        if (res.code == 200) {
          this.setData({
            balance: res.data.balance,
            integral: res.data.integral
          })
        } else if (res.code == 201){
          wx.showToast({
            title: '请先登录',
            icon:'none'
          })
        }
      })
    }
  },
  allorder(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let data = e.currentTarget.dataset
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../allorder/allorder?id=' + data.id + '&type=' + data.type + '&allorder=' + data.allorder,
      })
    } 
  },
  collection(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../collection/collection'
      })
    }
  },
  bargain(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../myBargain/myBargain'
      })
    } 
  },
  cart(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.switchTab({
        url: '../cart/cart'
      })
    }
  },
  coupons(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../coupons/coupons'
      })
    }
  },
  redPacket(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../redPacket/redPacket'
      })
    }
  },
  myadd(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../myadd/myadd'
      })
    } 
  },
  getUserInfo(e) {
    let that = this;
    let scene = '';
    if (wx.getStorageSync('scene')) {
      scene = wx.getStorageSync('scene')
    }
    wx.login({
      success: function (res) {
        console.log(res)
        let code = res.code
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              console.log(res)
              wx.getUserInfo({
                success: msg => {
                  let encryptedData = msg.encryptedData;
                  let iv = msg.iv;
                  let token = '';
                  let json = {
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv,
                    invite_code: scene
                  }
                  json = JSON.stringify(json)
                  util.http('login/login', json, 'post', token).then(data => {
                    console.log(data)
                    if (data.code == 200) {
                      main.member();
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.distributor = data.data.distributor;
                      that.setData({
                        state: 1,
                        hasUserInfo: true,
                        userInfo: e.detail.userInfo
                      })
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          state: 1,
                          userInfo: e.detail.userInfo,
                          distributor: data.data.distributor,
                        }
                      })
                      wx.setStorage({
                        key: "invite_code",
                        data: data.data.invite_code
                      })
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                      })
                      setTimeout(() => {
                        wx.switchTab({
                          url: '../index/index'
                        })
                      }, 500)
                    }
                  })
                }
              })
            } else {
              wx.showToast({
                title: '授权才能登录哦！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  call(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone
    })
  },
  distribution(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.hasUserInfo == 1) {
      if (app.globalData.distributor == 1) {
        wx.navigateTo({
          url: '../distribution/distribution',
        })
      } else {
        let distributor = wx.getStorageSync('distributor');
        if (distributor == 1) {
          wx.navigateTo({
            url: '../distribution/distribution'
          })
        } else {
          wx.showModal({
            title: '提示',
            confirmText: '确认',
            content: '确认申请？',
            confirmColor: '#029F53',
            success: function (res) {
              if (res.confirm) {
                let token = app.globalData.token;
                util.http('Distributor/register', {}, 'post', token).then(res => {
                  if (res.code == 200) {
                    wx.setStorage({
                      key: "distributor",
                      data: 1
                    })
                    wx.setStorage({
                      key: "invite_code",
                      data: res.data.invite_code
                    })
                    wx.showToast({
                      title: '申请成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(() => {
                      wx.navigateTo({
                        url: '../distribution/distribution'
                      })
                    }, 500)
                  }
                })
              }
            }
          })
        }
      }
    }
  },
  init() {
    this.setData({
      state: app.globalData.state,
      order: [{
        name: "待付款",
        icon: "daifukuan",
        allorder: "pay",
        id: 1
      }, {
        name: "待发货",
        icon: "daifahuo",
        allorder: "deliver",
        id: 2
      }, {
        name: "待收货",
        icon: "daishouhuo",
        allorder: "receive",
        id: 3
      }, {
        name: "待评价",
        icon: "daipingjia20",
        allorder: "evaluate",
        id: 4
      }]
    })
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo
      })
    }
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init()
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }
})