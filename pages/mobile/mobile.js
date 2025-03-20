Page({
  data: {
    networkType: '',
    isConnected: false,
    signalStrength: null
  },

  onLoad: function() {
    this.getNetworkInfo();
  },

  getNetworkInfo: function() {
    // 获取网络状态
    wx.getNetworkType({
      success: (res) => {
        this.setData({
          networkType: this.formatNetworkType(res.networkType),
          isConnected: res.networkType !== 'none'
        });
      }
    });

    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      this.setData({
        isConnected: res.isConnected,
        networkType: this.formatNetworkType(res.networkType)
      });
    });
  },

  formatNetworkType: function(type) {
    const typeMap = {
      'wifi': 'Wi-Fi',
      '2g': '2G',
      '3g': '3G',
      '4g': '4G',
      '5g': '5G',
      'unknown': '未知',
      'none': '无网络'
    };
    return typeMap[type] || type;
  },

  onUnload: function() {
    wx.offNetworkStatusChange();
  }
})