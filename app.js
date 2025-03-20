App({
  globalData: {
    networkInfo: null,
    wifiInfo: null,
    locationInfo: null
  },

  onLaunch() {
    // 检查并请求必要的权限
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              // 用户已经同意位置授权
            }
          })
        }
      }
    })
  },

  onShow() {
    // 当小程序启动，或从后台进入前台显示时触发
  },

  onHide() {
    // 当小程序从前台进入后台时触发
  }
})