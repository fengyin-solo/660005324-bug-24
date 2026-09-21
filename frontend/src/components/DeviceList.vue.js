/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useFactoryStore } from '../store/factory';
import { STATUS_COLORS } from '../types';
const store = useFactoryStore();
const devices = computed(() => store.filteredDevices);
const deviceTypes = computed(() => Array.from(new Set(store.devices.map(d => d.type))));
const STATUSES = ['RUNNING', 'IDLE', 'FAULT', 'OFFLINE'];
// 选择/清空统一走 store action，保证趋势面板拿到的是同一份条件
function onTypeChange(v) { store.setTypeFilter(v ?? ''); }
function onStatusChange(v) { store.setStatusFilter(v ?? ''); }
function tagType(s) {
    const m = { RUNNING: 'success', IDLE: 'warning', FAULT: 'danger' };
    return m[s] || 'info';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['dev-row']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-bar" },
});
const __VLS_0 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.store.typeFilter),
    size: "small",
    placeholder: "全部类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.store.typeFilter),
    size: "small",
    placeholder: "全部类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onChange: (__VLS_ctx.onTypeChange)
};
__VLS_3.slots.default;
for (const [t] of __VLS_getVForSourceType((__VLS_ctx.deviceTypes))) {
    const __VLS_8 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        key: (t),
        label: (t),
        value: (t),
    }));
    const __VLS_10 = __VLS_9({
        key: (t),
        label: (t),
        value: (t),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
var __VLS_3;
const __VLS_12 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.store.statusFilter),
    size: "small",
    placeholder: "全部状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.store.statusFilter),
    size: "small",
    placeholder: "全部状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onChange: (__VLS_ctx.onStatusChange)
};
__VLS_15.slots.default;
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.STATUSES))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (s),
        label: (s),
        value: (s),
    }));
    const __VLS_22 = __VLS_21({
        key: (s),
        label: (s),
        value: (s),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_15;
if (__VLS_ctx.store.hasFilter) {
    const __VLS_24 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onClick': {} },
        size: "small",
        text: true,
        ...{ class: "clear-btn" },
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClick': {} },
        size: "small",
        text: true,
        ...{ class: "clear-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.store.hasFilter))
                return;
            __VLS_ctx.store.clearFilters();
        }
    };
    __VLS_27.slots.default;
    var __VLS_27;
}
if (__VLS_ctx.store.locatedDevice) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "locate-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "locate-text" },
    });
    (__VLS_ctx.store.locatedDevice.type);
    (__VLS_ctx.store.locatedDevice.id);
    const __VLS_32 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        size: "small",
        text: true,
        ...{ class: "clear-btn" },
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        size: "small",
        text: true,
        ...{ class: "clear-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_36;
    let __VLS_37;
    let __VLS_38;
    const __VLS_39 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.store.locatedDevice))
                return;
            __VLS_ctx.store.clearLocate();
        }
    };
    __VLS_35.slots.default;
    var __VLS_35;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dev-list" },
});
if (!__VLS_ctx.devices.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
}
for (const [dev] of __VLS_getVForSourceType((__VLS_ctx.devices))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.store.locateDevice(dev.id);
            } },
        key: (dev.id),
        ...{ class: "dev-row" },
        ...{ class: ({ located: __VLS_ctx.store.locatedId === dev.id }) },
        ...{ style: ({ borderLeftColor: __VLS_ctx.STATUS_COLORS[dev.status] }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dev-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dev-type" },
    });
    (dev.type);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dev-id" },
    });
    (dev.id);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dev-metrics" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "metric" },
    });
    (dev.temperature.toFixed(1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "metric" },
    });
    (dev.vibration.toFixed(2));
    const __VLS_40 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        size: "small",
        type: (__VLS_ctx.tagType(dev.status)),
    }));
    const __VLS_42 = __VLS_41({
        size: "small",
        type: (__VLS_ctx.tagType(dev.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    (dev.status);
    var __VLS_43;
}
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['locate-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['locate-text']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dev-list']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['dev-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dev-info']} */ ;
/** @type {__VLS_StyleScopedClasses['dev-type']} */ ;
/** @type {__VLS_StyleScopedClasses['dev-id']} */ ;
/** @type {__VLS_StyleScopedClasses['dev-metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['metric']} */ ;
/** @type {__VLS_StyleScopedClasses['metric']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            STATUS_COLORS: STATUS_COLORS,
            store: store,
            devices: devices,
            deviceTypes: deviceTypes,
            STATUSES: STATUSES,
            onTypeChange: onTypeChange,
            onStatusChange: onStatusChange,
            tagType: tagType,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
