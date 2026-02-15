// 地图相关工具函数
export class MapUtils {
  // 计算两点间距离（单位：公里）
  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // 地球半径（公里）
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // 角度转弧度
  static toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  // 弧度转角度
  static toDegrees(radians) {
    return radians * (180 / Math.PI)
  }

  // 格式化距离显示
  static formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    } else if (distance < 10) {
      return `${distance.toFixed(1)}km`
    } else {
      return `${Math.round(distance)}km`
    }
  }

  // 根据距离和中心点获取边界坐标
  static getBounds(lat, lng, radius) {
    const earthRadius = 6371 // 地球半径（公里）
    const latDelta = radius / earthRadius
    const lngDelta = radius / (earthRadius * Math.cos(this.toRadians(lat)))
    
    return {
      minLat: lat - latDelta,
      maxLat: lat + latDelta,
      minLng: lng - lngDelta,
      maxLng: lng + lngDelta
    }
  }

  // 检查点是否在指定范围内
  static isPointInRange(centerLat, centerLng, pointLat, pointLng, radius) {
    const distance = this.calculateDistance(centerLat, centerLng, pointLat, pointLng)
    return distance <= radius
  }

  // 获取地图缩放级别（基于距离）
  static getZoomLevel(distance) {
    if (distance < 0.5) return 15
    if (distance < 1) return 14
    if (distance < 2) return 13
    if (distance < 5) return 12
    if (distance < 10) return 11
    if (distance < 20) return 10
    if (distance < 50) return 9
    return 8
  }

  // 腾讯地图API封装
  static tencentMap = {
    // 地理编码（地址转坐标）
    async geocode(address) {
      try {
        // TODO: 集成腾讯地图地理编码API
        // const response = await fetch(`https://apis.map.qq.com/ws/geocoder/v1/?address=${encodeURIComponent(address)}&key=YOUR_API_KEY`)
        // const data = await response.json()
        // return data.result.location
        throw new Error('腾讯地图API未配置')
      } catch (error) {
        console.error('地理编码失败:', error)
        return null
      }
    },

    // 逆地理编码（坐标转地址）
    async reverseGeocode(lat, lng) {
      try {
        // TODO: 集成腾讯地图逆地理编码API
        // const response = await fetch(`https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=YOUR_API_KEY`)
        // const data = await response.json()
        // return data.result
        throw new Error('腾讯地图API未配置')
      } catch (error) {
        console.error('逆地理编码失败:', error)
        return null
      }
    },

    // 搜索附近地点
    async searchNearby(lat, lng, keyword, radius = 1000) {
      try {
        // TODO: 集成腾讯地图搜索API
        // const response = await fetch(`https://apis.map.qq.com/ws/place/v1/search?boundary=nearby(${lat},${lng},${radius})&keyword=${encodeURIComponent(keyword)}&key=YOUR_API_KEY`)
        // const data = await response.json()
        // return data.data
        throw new Error('腾讯地图API未配置')
      } catch (error) {
        console.error('搜索附近地点失败:', error)
        return []
      }
    }
  }

// 高德地图API封装（备选）
  static amap = {
    apiKey: '61367e2d3e9fcade23b0817da7a63c82',

    // 地理编码（地址转坐标）
    async geocode(address) {
      try {
        const url = `https://restapi.amap.com/v3/geocode/geo?key=${this.apiKey}&address=${encodeURIComponent(address)}`
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
          const geocode = data.geocodes[0]
          const location = geocode.location.split(',')
          return {
            latitude: parseFloat(location[1]),
            longitude: parseFloat(location[0]),
            formattedAddress: geocode.formatted_address,
            province: geocode.province,
            city: geocode.city,
            district: geocode.district,
            adcode: geocode.adcode
          }
        }

        console.warn('高德地理编码未找到结果:', data)
        return null
      } catch (error) {
        console.error('高德地理编码失败:', error)
        return null
      }
    },

    // 逆地理编码（坐标转地址）
    async reverseGeocode(lat, lng) {
      try {
        const url = `https://restapi.amap.com/v3/geocode/regeo?key=${this.apiKey}&location=${lng},${lat}&extensions=all`
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === '1' && data.regeocode) {
          const regeocode = data.regeocode
          return {
            formattedAddress: regeocode.formatted_address,
            province: regeocode.addressComponent.province,
            city: regeocode.addressComponent.city || regeocode.addressComponent.province,
            district: regeocode.addressComponent.district,
            street: regeocode.addressComponent.street,
            streetNumber: regeocode.addressComponent.streetNumber,
            adcode: regeocode.addressComponent.adcode,
            township: regeocode.addressComponent.township,
            poi: regeocode.pois ? regeocode.pois[0] : null
          }
        }

        console.warn('高德逆地理编码未找到结果:', data)
        return null
      } catch (error) {
        console.error('高德逆地理编码失败:', error)
        return null
      }
    },

    // 周边搜索
    async searchNearby(lat, lng, keyword, radius = 1000) {
      try {
        const url = `https://restapi.amap.com/v3/place/around?key=${this.apiKey}&location=${lng},${lat}&keywords=${encodeURIComponent(keyword)}&radius=${radius}&output=json`
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === '1' && data.pois) {
          return data.pois.map(poi => ({
            id: poi.id,
            name: poi.name,
            address: poi.address,
            location: {
              latitude: parseFloat(poi.location.split(',')[1]),
              longitude: parseFloat(poi.location.split(',')[0])
            },
            distance: parseInt(poi.distance),
            type: poi.type,
            tel: poi.tel,
            businessArea: poi.businessarea,
            pinyin: poi.pinyin
          }))
        }

        console.warn('高德周边搜索未找到结果:', data)
        return []
      } catch (error) {
        console.error('高德周边搜索失败:', error)
        return []
      }
    },

    // POI 关键词搜索
    async searchPOI(keyword, city = '', limit = 20) {
      try {
        let url = `https://restapi.amap.com/v3/place/text?key=${this.apiKey}&keywords=${encodeURIComponent(keyword)}&output=json&offset=${limit}`
        if (city) {
          url += `&city=${encodeURIComponent(city)}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (data.status === '1' && data.pois) {
          return data.pois.map(poi => ({
            id: poi.id,
            name: poi.name,
            address: poi.address,
            location: {
              latitude: parseFloat(poi.location.split(',')[1]),
              longitude: parseFloat(poi.location.split(',')[0])
            },
            type: poi.type,
            tel: poi.tel,
            cityname: poi.cityname,
            adname: poi.adname
          }))
        }

        console.warn('高德POI搜索未找到结果:', data)
        return []
      } catch (error) {
        console.error('高德POI搜索失败:', error)
        return []
      }
    },

    // 天气查询
    async getWeather(city) {
      try {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${this.apiKey}&city=${encodeURIComponent(city)}&extensions=base`
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === '1' && data.lives && data.lives.length > 0) {
          const weather = data.lives[0]
          return {
            province: weather.province,
            city: weather.city,
            weather: weather.weather,
            temperature: weather.temperature,
            winddirection: weather.winddirection,
            windpower: weather.windpower,
            humidity: weather.humidity,
            reporttime: weather.reporttime
          }
        }

        return null
      } catch (error) {
        console.error('高德天气查询失败:', error)
        return null
      }
    },

    // 路径规划（驾车）
    async getDrivingRoute(startLng, startLat, endLng, endLat) {
      try {
        const url = `https://restapi.amap.com/v3/direction/driving?key=${this.apiKey}&origin=${startLng},${startLat}&destination=${endLng},${endLat}&extensions=all`
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === '1' && data.route && data.route.paths.length > 0) {
          const path = data.route.paths[0]
          return {
            distance: parseInt(path.distance), // 米
            duration: parseInt(path.duration), // 秒
            steps: path.steps.map(step => ({
              instruction: step.instruction,
              distance: parseInt(step.distance),
              duration: parseInt(step.duration),
              action: step.action,
              polyline: step.polyline
            }))
          }
        }

        return null
      } catch (error) {
        console.error('高德路径规划失败:', error)
        return null
      }
    }
  }
}

// 位置服务类
export class LocationService {
  constructor() {
    this.watchId = null
    this.currentPosition = null
  }

  // 获取当前位置（单次）
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5分钟缓存
    }

    const finalOptions = { ...defaultOptions, ...options }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理定位'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          }
          resolve(this.currentPosition)
        },
        (error) => {
          let errorMessage = '获取位置失败'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '用户拒绝了位置请求'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = '位置信息不可用'
              break
            case error.TIMEOUT:
              errorMessage = '获取位置超时'
              break
          }
          reject(new Error(errorMessage))
        },
        finalOptions
      )
    })
  }

  // 监听位置变化
  watchPosition(callback, options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1分钟缓存
    }

    const finalOptions = { ...defaultOptions, ...options }

    if (this.watchId) {
      this.stopWatching()
    }

    this.watchId = navigator.geolocation.watchPosition(
      callback,
      (error) => {
        console.error('位置监听错误:', error)
      },
      finalOptions
    )

    return this.watchId
  }

  // 停止监听位置
  stopWatching() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  // 检查定位权限
  async checkLocationPermission() {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' })
        return result.state
      } catch (error) {
        console.error('检查位置权限失败:', error)
      }
    }
    return 'prompt'
  }

  // 请求定位权限
  async requestLocationPermission() {
    try {
      await this.getCurrentPosition()
      return 'granted'
    } catch (error) {
      if (error.message.includes('用户拒绝了位置请求')) {
        return 'denied'
      }
      return 'prompt'
    }
  }
}

// 导出实例
export const locationService = new LocationService()