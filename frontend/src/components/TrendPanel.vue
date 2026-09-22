<template>
  <div class="chart-panel">
    <div class="panel-head">
      <h4>📈 温度/振动趋势</h4>
      <span v-if="store.locatedDevice" class="locate-chip" @click="store.locateDevice(null)">
        定位中 {{ store.locatedDevice.type }}-#{{ store.locatedDevice.id }} · 返回 ✕
      </span>
    </div>
    <div class="toolbar">
      <div class="seg">
        <button :class="{on: store.metric==='temperature'}" @click="store.setMetric('temperature')">温度°C</button>
        <button :class="{on: store.metric==='vibration'}" @click="store.setMetric('vibration')">振动</button>
      </div>
      <div class="seg">
        <button v-for="r in RANGES" :key="r" :class="{on: store.timeRange===r}" @click="store.setTimeRange(r)">{{ r }}秒</button>
      </div>
    </div>
    <div ref="chart" class="chart"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useFactoryStore } from '../store/factory'
import { DEVICE_COLORS } from '../types'

const store = useFactoryStore()
const chart = ref<HTMLDivElement>()
let inst: echarts.ECharts | null = null
const RANGES = [30, 60, 120]

function fmtTime(t: number) {
  return new Date(t).toLocaleTimeString('zh-CN', { hour12: false })
}
function fallbackColor(id: number) {
  const palette = ['#f97316', '#a78bfa', '#22d3ee', '#f472b6', '#a3e635', '#facc15']
  return palette[id % palette.length]
}

/**
 * 单一事实来源：
 * 刻度(categories)、每条折线(data)、定位标记(markPoint) 全部由
 * store.windowSamples（同一采样切片）与 store.filteredDevices（同一筛选结果）派生，
 * 任何一路刷新（连续切筛选 / 定位后返回 / 切时段）都是整体重算，不存在错位来源。
 */
const option = computed(() => {
  const samples = store.windowSamples
  const devs = store.filteredDevices
  const locatedId = store.locatedDeviceId
  const metric = store.metric
  const unit = metric === 'temperature' ? '°C' : 'mm/s'
  const precision = metric === 'temperature' ? 1 : 2

  // 刻度与数值共用这一份 samples，长度、顺序严格对齐
  const categories = samples.map(s => fmtTime(s.t))

  const series = devs.map(d => {
    // 按设备 id 在每个采样点取自己的读数，缺失补 null，绝不按位置/序号串设备
    const values = samples.map(s => {
      const r = s.readings.find(x => x.id === d.id)
      return r ? r[metric] : null
    })
    const isLocated = locatedId === d.id
    const dimmed = locatedId != null && !isLocated
    const color = DEVICE_COLORS[d.type] || fallbackColor(d.id)
    const sObj: Record<string, unknown> = {
      name: `${d.type}-#${d.id}`,
      type: 'line',
      data: values,
      smooth: true,
      showSymbol: false,
      connectNulls: true,
      animation: false,
      lineStyle: { color, width: isLocated ? 2.5 : 1.2, opacity: dimmed ? 0.2 : 1 },
      itemStyle: { color }
    }

    if (isLocated) {
      // 标记点坐标 = 本设备在当前采样窗口内最后一个有效读数的【样本序号】，
      // 与设备数组下标无关，因此不会落到“上一台”的位置
      let idx = -1
      let val: number | null = null
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i] != null) { idx = i; val = values[i]; break }
      }
      if (idx >= 0 && val != null) {
        sObj.markPoint = {
          symbol: 'circle', symbolSize: 12, animation: false,
          itemStyle: { color: '#fbbf24', borderColor: '#ffffff', borderWidth: 1.5 },
          label: {
            show: true, color: '#0d1b2a', fontSize: 9, fontWeight: 'bold',
            formatter: `#${d.id} ${val.toFixed(precision)}`, position: 'top'
          },
          data: [{ coord: [idx, val] }]
        }
      }
    }
    return sObj
  })

  return {
    backgroundColor: 'transparent',
    grid: { left: 40, right: 15, top: 12, bottom: 34 },
    tooltip: { trigger: 'axis' },
    legend: {
      type: 'scroll', bottom: 0, icon: 'roundRect', itemWidth: 10, itemHeight: 3,
      textStyle: { color: '#94a3b8', fontSize: 9 }
    },
    xAxis: {
      type: 'category', data: categories, boundaryGap: false,
      axisLabel: { color: '#94a3b8', fontSize: 9, rotate: 20, hideOverlap: true }
    },
    yAxis: {
      type: 'value', scale: true, name: unit,
      nameTextStyle: { color: '#64748b', fontSize: 9 },
      axisLabel: { color: '#94a3b8', fontSize: 9 }
    },
    series,
    // 无匹配设备时的占位（整体替换模式下不会残留旧图形）
    graphic: devs.length ? [] : [{
      type: 'text', left: 'center', top: 'middle',
      style: { text: '无匹配设备', fill: '#64748b', fontSize: 12 }
    }]
  }
})

function render() {
  // notMerge=true：series/markPoint/刻度整体替换，切筛选、切时段、清空、返回后绝不残留上一段
  inst?.setOption(option.value as echarts.EChartsCoreOption, true)
}

onMounted(() => {
  if (chart.value) {
    inst = echarts.init(chart.value)
    render()
  }
})
watch(option, render)
onUnmounted(() => inst?.dispose())
</script>
<style scoped>
.chart-panel{background:#0d1b2a;border-radius:8px;padding:12px;border:1px solid #1e3a5f}
.chart-panel h4{color:#64b5f6;font-size:13px}
.panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.locate-chip{font-size:10px;color:#0d1b2a;background:#fbbf24;border-radius:10px;padding:2px 8px;cursor:pointer;white-space:nowrap}
.toolbar{display:flex;justify-content:space-between;gap:6px;margin-bottom:4px}
.seg{display:inline-flex;background:#112233;border:1px solid #1e3a5f;border-radius:4px;overflow:hidden}
.seg button{border:0;background:transparent;color:#94a3b8;font-size:10px;padding:3px 8px;cursor:pointer}
.seg button.on{background:#2563eb;color:#fff}
.chart{width:100%;height:200px}
</style>
