<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择城市"
    width="90%"
    :close-on-click-modal="false"
    class="city-selector-dialog"
  >
    <div class="city-selector">
      <!-- 搜索框 -->
      <el-input
        v-model="searchKeyword"
        placeholder="搜索城市名称"
        clearable
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <!-- 定位城市 -->
      <div class="location-city" v-if="currentLocationCity">
        <div class="section-title">
          <el-icon><Location /></el-icon>
          定位城市
        </div>
        <div class="city-grid">
          <div
            class="city-item"
            @click="selectCity(currentLocationCity)"
          >
            {{ currentLocationCity }}
          </div>
        </div>
      </div>

      <!-- 热门城市 -->
      <div class="hot-cities" v-if="!searchKeyword">
        <div class="section-title">热门城市</div>
        <div class="city-grid">
          <div
            v-for="city in hotCities"
            :key="city"
            class="city-item"
            @click="selectCity(city)"
          >
            {{ city }}
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div class="search-results" v-if="searchKeyword && searchResults.length > 0">
        <div class="section-title">搜索结果</div>
        <div class="city-list">
          <div
            v-for="city in searchResults"
            :key="city.name"
            class="city-list-item"
            @click="selectCity(city.name)"
          >
            <div class="city-name">{{ city.name }}</div>
            <div class="city-fullname">{{ city.fullname }}</div>
          </div>
        </div>
      </div>

      <!-- 城市分组（首字母） -->
      <div class="city-groups" v-if="!searchKeyword">
        <div
          v-for="group in cityGroups"
          :key="group.letter"
          class="city-group"
        >
          <div class="group-letter">{{ group.letter }}</div>
          <div class="city-grid">
            <div
              v-for="city in group.cities"
              :key="city"
              class="city-item"
              @click="selectCity(city)"
            >
              {{ city }}
            </div>
          </div>
        </div>
      </div>

      <!-- 无搜索结果 -->
      <div class="empty-result" v-if="searchKeyword && searchResults.length === 0">
        <el-empty description="未找到相关城市" />
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app.js'
import { ElMessage } from 'element-plus'
import { Search, Location } from '@element-plus/icons-vue'
import { MapUtils } from '@/utils/map.js'

const emit = defineEmits(['select'])

const appStore = useAppStore()
const dialogVisible = ref(false)
const searchKeyword = ref('')
const searchResults = ref([])
const isSearching = ref(false)

// 热门城市
const hotCities = [
  '北京', '上海', '广州', '深圳',
  '杭州', '成都', '西安', '重庆',
  '南京', '武汉', '苏州', '天津'
]

// 城市分组（按首字母）
const cityGroups = [
  {
    letter: 'A-G',
    cities: ['鞍山', '保定', '包头', '北京', '长春', '长沙', '常州', '成都', '重庆', '大连', '东莞', '大庆', '鄂尔多斯', '佛山', '福州', '赣州', '广州', '贵阳', '桂林', '赣州']
  },
  {
    letter: 'H-N',
    cities: ['海口', '哈尔滨', '合肥', '呼和浩特', '惠州', '济南', '嘉兴', '吉林', '济南', '金华', '佳木斯', '九江', '开封', '昆明', '兰州', '连云港', '洛阳', '临沂', '柳州', '绵阳', '南昌', '南京', '南宁', '南通', '宁波']
  },
  {
    letter: 'O-T',
    cities: ['平顶山', '青岛', '泉州', '曲靖', '日照', '厦门', '汕头', '绍兴', '深圳', '沈阳', '石家庄', '苏州', '太原', '泰安', '天津', '唐山', '台州', '泰州', '通辽']
  },
  {
    letter: 'U-Z',
    cities: ['威海', '潍坊', '温州', '无锡', '芜湖', '乌鲁木齐', '武汉', '西安', '西宁', '咸阳', '厦门', '湘潭', '襄阳', '徐州', '烟台', '扬州', '宜昌', '银川', '营口', '郑州', '株洲', '珠海']
  }
]

// 当前定位的城市
const currentLocationCity = computed(() => {
  return appStore.location.city || null
})

// 打开对话框
const open = () => {
  dialogVisible.value = true
}

// 选择城市
const selectCity = async (city) => {
  try {
    // 使用高德地图API获取城市坐标
    const locationData = await MapUtils.amap.geocode(city)

    if (locationData) {
      // 更新store中的位置信息
      appStore.setLocation({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: locationData.city,
        address: locationData.formattedAddress,
        province: locationData.province,
        district: locationData.district
      })

      ElMessage.success(`已切换到 ${city}`)
      emit('select', city)
      dialogVisible.value = false
    } else {
      ElMessage.error('获取城市位置信息失败')
    }
  } catch (error) {
    console.error('切换城市失败:', error)
    ElMessage.error('切换城市失败，请重试')
  }
}

// 搜索城市
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  try {
    // 使用高德地图POI搜索
    const results = await MapUtils.amap.searchPOI(searchKeyword.value, '', 10)

    searchResults.value = results.map(poi => ({
      name: poi.name,
      fullname: `${poi.cityname || ''}${poi.adname || ''}${poi.name}`
    }))
  } catch (error) {
    console.error('搜索城市失败:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  open
})
</script>

<style scoped>
.city-selector {
  max-height: 60vh;
  overflow-y: auto;
}

.search-input {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-bottom: 24px;
}

.city-item {
  padding: 10px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #333;
  user-select: none;
}

.city-item:hover {
  background: #FF8C42;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
}

.city-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.city-list-item {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.city-list-item:hover {
  background: #FF8C42;
  color: white;
  transform: translateX(4px);
}

.city-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.city-fullname {
  font-size: 12px;
  opacity: 0.8;
}

.city-group {
  margin-bottom: 24px;
}

.group-letter {
  font-size: 18px;
  font-weight: bold;
  color: #FF8C42;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #FF8C42;
}

.empty-result {
  padding: 40px 0;
}

.location-city {
  margin-bottom: 20px;
}

.hot-cities {
  margin-bottom: 20px;
}

.search-results {
  margin-bottom: 20px;
}

/* 滚动条样式 */
.city-selector::-webkit-scrollbar {
  width: 6px;
}

.city-selector::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.city-selector::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.city-selector::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

<style>
.city-selector-dialog {
  border-radius: 16px;
}

.city-selector-dialog .el-dialog__header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.city-selector-dialog .el-dialog__body {
  padding: 20px 24px;
}

.city-selector-dialog .el-dialog__footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
}
</style>