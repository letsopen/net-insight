Page({
  data: {
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    speed: null
  },

  onLoad: function() {
    this.getLocation();
  },

  getLocation: function() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          accuracy: res.accuracy,
          altitude: res.altitude,
          speed: res.speed
        });
      }
    });
  }
})