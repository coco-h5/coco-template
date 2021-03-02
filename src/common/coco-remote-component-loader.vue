<template>
  <div
      v-if="component"
      :is="component"
      :obj="obj"
  />
</template>

<script>
import Vue from 'vue';

export default {
  name: 'coco-remote-component-loader',
  props: {
    obj: {
      type: Object,
      default: () => {}
    },
    config: {},
  },
  data() {
    return {
      data: {},
      component: '',
    }
  },
  created() {
    // 动态添加组件，用于可视化编辑场景
    const {
      name,
      js,
      css,
      index,
    } = this.config;
    const component = window[name];
    if (!component) {
      const script = document.createElement('script');
      const link = document.createElement('link');
      script.src = js;
      link.href = css;
      link.rel= 'stylesheet';
      document.head.appendChild(link);
      document.body.appendChild(script);
      script.onload = () => {
        this.$emit('onRemoteComponentLoad', {
          ...window[name],
          index,
        });
        this.component = Vue.extend(window[name].Component);
      }
    } else  {
      // 非动态化添加，用于构建场景
      this.$emit('onRemoteComponentLoad', {
        ...window[name],
        index,
      });
      // 先有 props 再挂组件，不然 props 是 null 可能会有错
      this.$nextTick(() => {
        this.component = Vue.extend(window[name].Component);
      });
    }
  },
  watch: {
    'config.name'() {
      this.component = Vue.extend(window[this.config.name].Component);
    }
  }
}
</script>
