Page({
  data: {
    wifiEnabled: false,
    wifiInfo: null,
    scanning: false,
    networkDevices: [],
    udpSocket: null
  },

  onLoad: function() {
    this.getWifiInfo();
    this.startDeviceDiscovery();
  },

  getWifiInfo: function() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          wifiEnabled: res.wifiEnabled
        });
      }
    });

    wx.startWifi({
      success: () => {
        wx.getConnectedWifi({
          success: (res) => {
            this.setData({
              wifiInfo: res.wifi
            });
          }
        });
      }
    });
  },

  startDeviceDiscovery: function() {
    this.setData({ scanning: true });
    
    // 创建 UDP Socket
    const udp = wx.createUDPSocket();
    this.setData({ udpSocket: udp });
    
    // 监听端口
    udp.bind();
    
    // 监听收到的消息
    udp.onMessage((res) => {
      try {
        const device = JSON.parse(res.message);
        // 检查是否已存在该设备
        const exists = this.data.networkDevices.some(d => d.address === device.address);
        if (!exists) {
          this.setData({
            networkDevices: [...this.data.networkDevices, {
              address: res.remoteInfo.address,
              deviceName: device.deviceName || '未知设备',
              deviceType: device.deviceType || '未知类型',
              timestamp: new Date().getTime()
            }]
          });
        }
      } catch (e) {
        console.error('解析设备信息失败:', e);
      }
    });

    // 广播发现请求
    this.broadcastDiscovery();
  },

  broadcastDiscovery: function() {
    if (!this.data.udpSocket) return;
    
    const message = JSON.stringify({
      type: 'DISCOVERY_REQUEST',
      timestamp: new Date().getTime()
    });

    // 在局域网广播
    this.data.udpSocket.send({
      address: '255.255.255.255',
      port: 8888,
      message: message
    });

    // 每5秒广播一次
    if (this.data.scanning) {
      setTimeout(() => {
        this.broadcastDiscovery();
      }, 5000);
    }
  },

  stopDeviceDiscovery: function() {
    this.setData({ scanning: false });
    if (this.data.udpSocket) {
      this.data.udpSocket.close();
      this.setData({ udpSocket: null });
    }
  },

  refreshDevices: function() {
    this.setData({ networkDevices: [] });
    this.startDeviceDiscovery();
  },

  onUnload: function() {
    this.stopDeviceDiscovery();
  }
});