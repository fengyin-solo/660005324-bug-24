import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
const MAX_HISTORY = 120; // 环形缓冲上限（秒），切换时段只在这份序列上切片
export const useFactoryStore = defineStore('factory', () => {
    const data = ref(null);
    const ws = ref(null);
    const connected = ref(false);
    // —— 设备列表与趋势面板共享的同一份筛选/定位条件 ——
    const typeFilter = ref('');
    const statusFilter = ref('');
    const locatedId = ref(null);
    const trendRange = ref(30);
    // —— 同一份采样序列：每次推送只追加一次，折线与标记都从这里取数 ——
    const history = ref({});
    const devices = computed(() => data.value?.devices ?? []);
    const filteredDevices = computed(() => devices.value.filter(d => (!typeFilter.value || d.type === typeFilter.value)
        && (!statusFilter.value || d.status === statusFilter.value)));
    // 定位设备必须在当前筛选结果中，被过滤掉时由下方 watcher 清空 locatedId
    const locatedDevice = computed(() => {
        const list = filteredDevices.value;
        return locatedId.value === null ? null : list.find(d => d.id === locatedId.value) ?? null;
    });
    function setTypeFilter(t) { typeFilter.value = t; }
    function setStatusFilter(s) { statusFilter.value = s; }
    function clearFilters() { typeFilter.value = ''; statusFilter.value = ''; }
    const hasFilter = computed(() => !!(typeFilter.value || statusFilter.value));
    function locateDevice(id) { locatedId.value = id; }
    function clearLocate() { locatedId.value = null; }
    function setTrendRange(r) { trendRange.value = r; }
    // 筛选变化使定位目标失效时（如连续切换筛选），显式清掉，不留陈旧状态。
    // 不能只 watch(locatedDevice)：loc 初始为 null 时其 getter 从未求值，
    // watcher 收集不到筛选依赖，“先定位再改筛选”路径不会触发。
    watch([filteredDevices, locatedId], ([list, id]) => { if (id !== null && !list.some(d => d.id === id))
        locatedId.value = null; }, { flush: 'sync' });
    function pushSample(now) {
        if (!data.value)
            return;
        const next = {};
        for (const d of data.value.devices) {
            const prev = history.value[d.id] ?? [];
            const arr = prev.length >= MAX_HISTORY ? prev.slice(prev.length - MAX_HISTORY + 1) : prev.slice();
            arr.push({ t: now, temperature: d.temperature, vibration: d.vibration });
            next[d.id] = arr;
        }
        history.value = next;
    }
    function connect() {
        if (ws.value)
            return;
        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        const s = new WebSocket(`${protocol}//${location.hostname}:8000/ws`);
        s.onopen = () => { connected.value = true; console.log('WS connected'); };
        s.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                data.value = msg;
                pushSample(Date.now());
            }
            catch { }
        };
        s.onclose = () => { connected.value = false; ws.value = null; };
        ws.value = s;
    }
    function disconnect() {
        ws.value?.close();
        ws.value = null;
        connected.value = false;
    }
    return {
        data, connected,
        typeFilter, statusFilter, locatedId, trendRange, history,
        devices, filteredDevices, locatedDevice, hasFilter,
        setTypeFilter, setStatusFilter, clearFilters, locateDevice, clearLocate, setTrendRange,
        pushSample, connect, disconnect
    };
});
