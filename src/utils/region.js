// 中国省市区数据 - 简化版本
// 实际项目中应使用完整的行政区划数据

export const regionData = [
  {
    code: '110000',
    name: '北京市',
    children: [
      {
        code: '110100',
        name: '北京市',
        children: [
          { code: '110101', name: '东城区' },
          { code: '110102', name: '西城区' },
          { code: '110105', name: '朝阳区' },
          { code: '110106', name: '丰台区' },
          { code: '110107', name: '石景山区' },
          { code: '110108', name: '海淀区' },
          { code: '110109', name: '门头沟区' },
          { code: '110111', name: '房山区' },
          { code: '110112', name: '通州区' },
          { code: '110113', name: '顺义区' },
          { code: '110114', name: '昌平区' },
          { code: '110115', name: '大兴区' },
          { code: '110116', name: '怀柔区' },
          { code: '110117', name: '平谷区' },
          { code: '110118', name: '密云区' },
          { code: '110119', name: '延庆区' }
        ]
      }
    ]
  },
  {
    code: '310000',
    name: '上海市',
    children: [
      {
        code: '310100',
        name: '上海市',
        children: [
          { code: '310101', name: '黄浦区' },
          { code: '310104', name: '徐汇区' },
          { code: '310105', name: '长宁区' },
          { code: '310106', name: '静安区' },
          { code: '310107', name: '普陀区' },
          { code: '310108', name: '虹口区' },
          { code: '310109', name: '杨浦区' },
          { code: '310110', name: '闵行区' },
          { code: '310111', name: '宝山区' },
          { code: '310112', name: '嘉定区' },
          { code: '310113', name: '浦东新区' },
          { code: '310114', name: '金山区' },
          { code: '310115', name: '松江区' },
          { code: '310116', name: '青浦区' },
          { code: '310117', name: '奉贤区' },
          { code: '310118', name: '崇明区' }
        ]
      }
    ]
  },
  {
    code: '440000',
    name: '广东省',
    children: [
      {
        code: '440100',
        name: '广州市',
        children: [
          { code: '440103', name: '荔湾区' },
          { code: '440104', name: '越秀区' },
          { code: '440105', name: '海珠区' },
          { code: '440106', name: '天河区' },
          { code: '440111', name: '白云区' },
          { code: '440112', name: '黄埔区' },
          { code: '440113', name: '番禺区' },
          { code: '440114', name: '花都区' },
          { code: '440115', name: '南沙区' },
          { code: '440117', name: '从化区' },
          { code: '440118', name: '增城区' }
        ]
      },
      {
        code: '440300',
        name: '深圳市',
        children: [
          { code: '440303', name: '罗湖区' },
          { code: '440304', name: '福田区' },
          { code: '440305', name: '南山区' },
          { code: '440306', name: '宝安区' },
          { code: '440307', name: '龙岗区' },
          { code: '440308', name: '盐田区' },
          { code: '440309', name: '龙华区' },
          { code: '440310', name: '坪山区' },
          { code: '440311', name: '光明区' }
        ]
      }
    ]
  },
  {
    code: '320000',
    name: '江苏省',
    children: [
      {
        code: '320100',
        name: '南京市',
        children: [
          { code: '320102', name: '玄武区' },
          { code: '320104', name: '秦淮区' },
          { code: '320105', name: '建邺区' },
          { code: '320106', name: '鼓楼区' },
          { code: '320111', name: '浦口区' },
          { code: '320113', name: '栖霞区' },
          { code: '320114', name: '雨花台区' },
          { code: '320115', name: '江宁区' },
          { code: '320116', name: '六合区' },
          { code: '320117', name: '溧水区' },
          { code: '320118', name: '高淳区' }
        ]
      }
    ]
  },
  {
    code: '330000',
    name: '浙江省',
    children: [
      {
        code: '330100',
        name: '杭州市',
        children: [
          { code: '330102', name: '上城区' },
          { code: '330103', name: '下城区' },
          { code: '330104', name: '江干区' },
          { code: '330105', name: '拱墅区' },
          { code: '330106', name: '西湖区' },
          { code: '330108', name: '滨江区' },
          { code: '330109', name: '萧山区' },
          { code: '330110', name: '余杭区' },
          { code: '330111', name: '富阳区' },
          { code: '330112', name: '临安区' },
          { code: '330113', name: '临平区' },
          { code: '330114', name: '钱塘区' }
        ]
      }
    ]
  }
]

// 获取省份列表
export const getProvinces = () => {
  return regionData.map(item => ({
    code: item.code,
    name: item.name
  }))
}

// 根据省份获取城市列表
export const getCitiesByProvince = (provinceName) => {
  const province = regionData.find(p => p.name === provinceName)
  return province?.children?.map(item => ({
    code: item.code,
    name: item.name
  })) || []
}

// 根据城市获取区县列表
export const getDistrictsByCity = (provinceName, cityName) => {
  const province = regionData.find(p => p.name === provinceName)
  const city = province?.children?.find(c => c.name === cityName)
  return city?.children || []
}

// 根据地区代码获取完整地址
export const getFullAddress = (province, city, district) => {
  const parts = [province, city, district].filter(Boolean)
  return parts.join(' ')
}

// 验证统一社会信用代码
export const validateLicenseNo = (code) => {
  const regex = /^[0-9A-Z]{18}$/
  return regex.test(code)
}

// 获取机构类型列表
export const getOrgTypes = () => [
  { value: 'RESCUE', label: '救助站' },
  { value: 'HOSPITAL', label: '宠物医院' },
  { value: 'PET_SHOP', label: '宠物店' },
  { value: 'CHARITY', label: '公益组织' },
  { value: 'OTHER', label: '其他' }
]