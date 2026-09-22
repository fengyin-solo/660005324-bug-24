<template>
  <div class="panel">
    <div class="panel-head">
      <h4>📋 设备状态</h4>
      <el-button
        size="small" link type="primary" :disabled="!hasFilter"
        @click="store.clearFilters()"
      >清空筛选</el-button>
    </div>

    <div class="filter-bar">
      <el-select
        :model-value="store.filterType" size="small" placeholder="全部类型" clearable
        class="filter-select" @update:model-value="store.setFilterType($event || '')"
      >
        <el-option v-for="t in DEVICE_TYPES" :key="t" :label="t" :value="t" />
      </el-select>
      <el-select
        :model-value="store.filterStatus" size="small" placeholder="全部状态" clearable
        class="filter-select" @update:model-value="store.setFilterStatus($event || '')"
      >
        <el-option v-for="s in DEVICE_STATUSES" :key="s" :label="s" :value="s" />
      </el-select>
    </div>

    <div v-if="store.locatedDevice" class="locate-bar">
      <span class="locate-text">已定位 {{ store.locatedDevice.type }}-#{{ store.locatedDevice.id }}</span>
      <el-button size="small" type="primary" plain @click="store.locateDevice(null)">返回列表</el-button>
    </div>

    <div class="dev-list">
      <div v-if="!devices.length" class="empty">无匹配设备</div>
      <div
        v-for="dev in devices" :key="dev.id" class="dev-row"
        :class="{ located: store.locatedDeviceId === dev.id }"
        :style="{ borderLeftColor: STATUS_COLORS[dev.status] }"
        @click="store.locateDevice(dev.id)"
      >
        <div class="dev-info">
          <span class="dev-type">{{ dev.type }}</span>
          <span class="dev-id">#{{ dev.id }}</span>
        </div>
        <div class="dev-metrics">
          <span class="metric">{{ dev.temperature.toFixed(1) }}°C</span>
          <span class="metric">{{ dev.vibration.toFixed(2) }}mm/s</span>
        </div>
        <el-tag size="small" :type="tagType(dev.status)">{{ dev.status }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFactoryStore } from '../store/factory'
import { STATUS_COLORS, DEVICE_TYPES, DEVICE_STATUSES } from '../types'
const store = useFactoryStore()
const devices = computed(() => store.filteredDevices)
const hasFilter = computed(() => !!(store.filterType || store.filterStatus))

function tagType(s: string) {
  const m: Record<string, any> = { RUNNING: 'success', IDLE: 'warning', FAULT: 'danger' }
  return m[s] || 'info'
}
</script>

<style scoped>
.panel{background:#0d1b2a;border-radius:8px;padding:12px;border:1px solid #1e3a5f}
.panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.panel h4{color:#64b5f6;font-size:13px}
.filter-bar{display:flex;gap:6px;margin-bottom:8px}
.filter-select{flex:1}
.filter-select :deep(.el-select__wrapper){min-height:28px;font-size:12px}
.locate-bar{display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:8px;padding:4px 8px;background:#112233;border:1px solid #2563eb66;border-radius:4px}
.locate-text{font-size:11px;color:#93c5fd}
.dev-list{display:flex;flex-direction:column;gap:4px;max-height:250px;overflow-y:auto}
.empty{color:#64748b;font-size:12px;text-align:center;padding:16px 0}
.dev-row{display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#112233;border-radius:4px;border-left:3px solid #666;cursor:pointer;transition:background .15s}
.dev-row:hover{background:#16304a}
.dev-row.located{background:#1e3a5f;box-shadow:inset 0 0 0 1px #2563eb}
.dev-info{display:flex;gap:6px;align-items:center}
.dev-type{font-size:12px;color:#e0e6ed;font-weight:600}
.dev-id{font-size:11px;color:#64748b}
.dev-metrics{display:flex;gap:10px;font-size:11px;color:#94a3b8}
</style>
