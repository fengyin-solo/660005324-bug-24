/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { useFactoryStore } from '../store/factory';
import { DEVICE_COLORS } from '../types';
const store = useFactoryStore();
const chart = ref();
let inst = null;
const RANGES = [
    { v: 15, label: '15秒' }, { v: 30, label: '30秒' }, { v: 60, label: '60秒' }
];
// 时段同样落在 store 里，折线、刻度、标记都按它切同一份序列
const rangeModel = computed({
    get: () => store.trendRange,
    set: (v) => store.setTrendRange(v)
});
function fmt(t) {
    const d = new Date(t);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}
// 折线与标记唯一的取数入口：同一份筛选结果 + 同一份采样序列 + 同一时段
function seriesOf() {
    const now = Date.now();
    const from = now - store.trendRange * 1000;
    const result = [];
    for (const d of store.filteredDevices) {
        const raw = (store.history[d.id] ?? []).filter(p => p.t >= from);
        result.push({
            id: d.id,
            name: `${d.type}-${d.id}`,
            color: DEVICE_COLORS[d.type] ?? '#94a3b8',
            temp: raw.map(p => [p.t, p.temperature]),
            vib: raw.map(p => [p.t, +(p.vibration * 20).toFixed(2)])
        });
    }
    return { from, now, result };
}
function update() {
    if (!inst)
        return;
    const { from, now, result } = seriesOf();
    const located = store.locatedDevice;
    const series = result.map(s => {
        const isLocated = located?.id === s.id;
        const item = {
            name: s.name,
            type: 'line',
            data: s.temp,
            smooth: true,
            symbol: 'none',
            showSymbol: false,
            lineStyle: { color: s.color, width: isLocated ? 3 : 1.2, opacity: located && !isLocated ? 0.3 : 1 },
            itemStyle: { color: s.color },
            emphasis: { focus: 'series' }
        };
        // 标记点挂在被定位设备自己的系列上，坐标取该设备序列的最新采样点，
        // 因此不会落到上一台设备；定位返回后 notMerge 重绘，标记一并移除
        if (isLocated && s.temp.length) {
            const last = s.temp[s.temp.length - 1];
            item.markPoint = {
                symbol: 'pin', symbolSize: 42,
                itemStyle: { color: '#fbbf24' },
                label: { color: '#0d1b2a', fontSize: 9, formatter: `#${s.id}` },
                data: [{ coord: last, value: last[1] }]
            };
        }
        return item;
    });
    // 被定位设备的振动序列（沿用原面板 振动×20 的刻度），与温度共享同一份采样点
    if (located) {
        const s = result.find(r => r.id === located.id);
        if (s) {
            series.push({
                name: `${s.name} 振动`,
                type: 'line',
                data: s.vib,
                smooth: true,
                symbol: 'none',
                showSymbol: false,
                lineStyle: { color: '#a78bfa', width: 1.5, type: 'dashed' },
                itemStyle: { color: '#a78bfa' }
            });
        }
    }
    inst.setOption({
        backgroundColor: 'transparent',
        grid: { left: 40, right: 15, top: 24, bottom: 40 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
        // 数值时间轴：刻度范围与折线取自同一批采样点，切换时段不会错位
        xAxis: {
            type: 'time', min: from, max: now,
            axisLabel: { color: '#94a3b8', fontSize: 9, formatter: (v) => fmt(v) }
        },
        yAxis: { type: 'value', name: '温度°C', nameTextStyle: { color: '#94a3b8', fontSize: 9 }, axisLabel: { color: '#94a3b8' } },
        legend: { bottom: 0, textStyle: { color: '#94a3b8', fontSize: 10 }, type: 'scroll' },
        series,
        animation: false
    }, true); // notMerge：连续切换筛选/清空/刷新时不残留上一段折线与标记
}
onMounted(() => { if (chart.value) {
    inst = echarts.init(chart.value);
    update();
} });
// 任一共享输入变化（数据刷新、筛选、定位、返回、时段）都整体重算
watch(() => [store.history, store.filteredDevices, store.locatedId, store.trendRange], update, { deep: true });
onUnmounted(() => inst?.dispose());
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['chart-panel']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "range-btns" },
});
const __VLS_0 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.rangeModel),
    size: "small",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.rangeModel),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
for (const [r] of __VLS_getVForSourceType((__VLS_ctx.RANGES))) {
    const __VLS_4 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        key: (r.v),
        value: (r.v),
    }));
    const __VLS_6 = __VLS_5({
        key: (r.v),
        value: (r.v),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    (r.label);
    var __VLS_7;
}
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "chart",
    ...{ class: "chart" },
});
/** @type {typeof __VLS_ctx.chart} */ ;
/** @type {__VLS_StyleScopedClasses['chart-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['range-btns']} */ ;
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            chart: chart,
            RANGES: RANGES,
            rangeModel: rangeModel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
