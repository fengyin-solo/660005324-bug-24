import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FactoryData, Device } from '@/types'

/** 单次采样：时间戳 + 每台设备在该时刻的读数 */
export interface TrendSample {
  t: number
  readings: { id: number; temperature: number; vibration: number }[]
}

export type TrendMetric = 'temperature' | 'vibration'

export const useFactoryStore = defineStore('factory', () => {
  const data = ref<FactoryData | null>(null)
  const ws = ref<WebSocket | null>(null)
  const connected = ref(false)

  // ---- 同一份筛选条件（设备列表与趋势面板共用，杜绝两边各取各的数据）----
  const filterType = ref('')
  const filterStatus = ref('')
  // ---- 定位到的设备（null 表示未定位）----
  const locatedDeviceId = ref<number | null>(null)
  // ---- 趋势时段（秒，即取最近多少个采样点，推送频率为 1 个/秒）----
  const timeRange = ref(60)
  const metric = ref<TrendMetric>('temperature')
  // ---- 同一份采样序列：随实时推送累积，供折线与标记点共同派生 ----
  const samples = ref<TrendSample[]>([])

  const MAX_SAMPLES = 300

  /** 唯一的设备筛选逻辑：类型 + 状态，任一为空表示不过滤该维度 */
  const filteredDevices = computed<Device[]>(() => {
    const all = data.value?.devices ?? []
    return all.filter(d =>
      (!filterType.value || d.type === filterType.value) &&
      (!filterStatus.value || d.status === filterStatus.value)
    )
  })

  /** 当前时段内的采样切片：折线刻度、折线数值、定位标记全部从这同一个数组派生 */
  const windowSamples = computed<TrendSample[]>(() => {
    const list = samples.value
    if (list.length <= timeRange.value) return list
    return list.slice(list.length - timeRange.value)
  })

  const locatedDevice = computed(() =>
    filteredDevices.value.find(d => d.id === locatedDeviceId.value) ?? null
  )

  function setFilterType(v: string) {
    filterType.value = v
    clearLocateIfHidden()
  }
  function setFilterStatus(v: string) {
    filterStatus.value = v
    clearLocateIfHidden()
  }
  function clearFilters() {
    filterType.value = ''
    filterStatus.value = ''
    clearLocateIfHidden()
  }

  function locateDevice(id: number | null) {
    locatedDeviceId.value = id
  }

  function setTimeRange(seconds: number) {
    timeRange.value = seconds
  }

  function setMetric(m: TrendMetric) {
    metric.value = m
  }

  /** 被定位设备被筛选条件排除时，定位随之失效，避免标记点指向不可见的设备 */
  function clearLocateIfHidden() {
    if (locatedDeviceId.value == null) return
    if (!filteredDevices.value.some(d => d.id === locatedDeviceId.value)) {
      locatedDeviceId.value = null
    }
  }

  function pushSnapshot(payload: FactoryData) {
    samples.value.push({
      t: Date.now(),
      readings: payload.devices.map(d => ({ id: d.id, temperature: d.temperature, vibration: d.vibration }))
    })
    if (samples.value.length > MAX_SAMPLES) {
      samples.value.splice(0, samples.value.length - MAX_SAMPLES)
    }
  }

  function connect() {
    if (ws.value) return
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const s = new WebSocket(`${protocol}//${location.hostname}:8000/ws`)
    s.onopen = () => { connected.value = true; console.log('WS connected') }
    s.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data) as FactoryData
        data.value = payload
        pushSnapshot(payload)
      } catch {}
    }
    s.onclose = () => { connected.value = false; ws.value = null }
    ws.value = s
  }

  function disconnect() {
    ws.value?.close()
    ws.value = null
    connected.value = false
  }

  return {
    data, connected, samples,
    filterType, filterStatus, locatedDeviceId, timeRange, metric,
    filteredDevices, windowSamples, locatedDevice,
    setFilterType, setFilterStatus, clearFilters,
    locateDevice, setTimeRange, setMetric,
    pushSnapshot, connect, disconnect
  }
})
