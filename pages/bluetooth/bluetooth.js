Page({
  data: {
    devices: [],
    scanning: false,
    authorized: false
  },

  onLoad: function() {
    this.checkBluetoothPermission();
  },

  checkBluetoothPermission: function() {
    wx.openBluetoothAdapter({
      success: (res) => {
        this.setData({ authorized: true });
        this.startBluetoothDevicesDiscovery();
      },
      fail: (res) => {
        wx.showModal({
          title: '提示',
          content: '请开启蓝牙功能',
          showCancel: false
        });
      }
    });
  },

  startBluetoothDevicesDiscovery: function() {
    if (this.data.scanning) return;
    
    this.setData({ scanning: true });
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      success: (res) => {
        this.onBluetoothDeviceFound();
      },
      fail: (res) => {
        wx.showToast({
          title: '搜索蓝牙设备失败',
          icon: 'none'
        });
        this.setData({ scanning: false });
      }
    });
  },

  stopBluetoothDevicesDiscovery: function() {
    wx.stopBluetoothDevicesDiscovery({
      success: (res) => {
        this.setData({ scanning: false });
      }
    });
  },

  onBluetoothDeviceFound: function() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          device.name = '未知设备';
        }
        // 更新设备列表，避免重复
        const idx = this.data.devices.findIndex(d => d.deviceId === device.deviceId);
        if (idx === -1) {
          this.data.devices.push(device);
          this.setData({
            devices: this.data.devices
          });
        }
      });
    });
  },

  onUnload: function() {
    this.stopBluetoothDevicesDiscovery();
    wx.closeBluetoothAdapter();
  }
})