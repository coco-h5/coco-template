<!-- eslint-disable -->
<template>
  <div id="slider-view" class="slider-view" v-if="loaded">
    <!-- 编辑容器 -->
    <div
      :data-layout="component.props && component.props._layout"
      :id="`coco-render-id-_component_${index}`"
      :key="index"
      v-for="(component, index) in components"
    >
      <div
        :is="component.name"
        :key="component + index"
        :obj="component.props || {}"
        :config="component.config"
        @onRemoteComponentLoad="remoteComponentLoad"
      />
    </div>
  </div>
</template>
<script>
import {
  postMsgToParent,
  isEdit,
  config,
  isPreview,
  baseUrl,
  pageId,
  xhrGet,
} from './utils';

import CocoComponentsLoader from './coco-remote-component-loader';

export default {
  name: 'coco-component',
  data() {
    return {
      init: false, // coco-admin 内嵌 iframe 初始化完成
      loaded: false, // 页面数据准备完成，为了预览功能
      sortOption: {
        group: {
          name: 'components',
          pull: true,
          put: true
        },
        sort: true,
        animation: 200
      },
      isEdit,
      components: window.__coco_config__.components.length
        ? window.__coco_config__.components // window.__coco_config__.components 是服务端注入的用户选择组件
        : this.$slots.default.map(c => {
          const name = c.componentOptions.tag;
          const { data } =  config.componentConfig.filter(config => config.name === name)[0];
          return {
            name,
            props: c.componentOptions.propsData?.obj || data
          };
        }),
      componentConfig: config.componentConfig,
      currentIndex: 0,
      remoteComponents: [],
      page: {
        schema: config.pageConfig.schema,
        props: (window.__coco_config__.pageData && window.__coco_config__.pageData.props) || config.pageConfig.data
      }
    };
  },
  created() {
    // 预览
    if (isPreview && baseUrl && pageId) {
      xhrGet(`${baseUrl}/project/preview?id=${pageId}`, (res) => {
        this.components = res.result.components;
        this.page = res.result.pageData;
        this.$emit('init', this.page.props);
        this.loaded = true;
      });
      return;
    }
    this.loaded = true;
    this.$emit('init', this.page.props);
    if (!isEdit) return;
    window.addEventListener('message', (e) => {
      // 不接受消息源来自于当前窗口的消息
      if (e.source === window || e.data === 'loaded') {
        return;
      }
      this.isEdit = true;
      this[e.data.type](e.data.data);
    });
  },
  methods: {
    /**
     * 设置组件
     * @param config
     */
    setConfig(config) {
      this.components = config.userSelectComponents;
      this.page = config.page;
      this.getConfig();
    },
    /**
     * 返回内容
     */
    getConfig() {
      this.init = true;
      postMsgToParent({
        type: 'returnConfig',
        data: {
          components: this.componentConfig,
          userSelectComponents: this.components,
          currentIndex: this.currentIndex,
          remoteComponents: this.remoteComponents,
          page: this.page
        }
      });
    },
    reset({ userSelectComponents, currentIndex, page }) {
      this.components = userSelectComponents;
      this.currentIndex = currentIndex;
      this.page = page;
      this.$emit('init', this.page.props);
    },
    /**
     * 远程组件加载完成后需要生成 props
     * @param config
     * @param index
     */
    remoteComponentLoad({ config, index }) {
      if (!this.isEdit) return;
      const has = this.remoteComponents.filter(item => `${config.name}.${config.version}` === `${item.name}.${item.version}`)[0];
      if (!has) {
        this.remoteComponents.push(config);
      }
      this.components.forEach(item => {
        if (item.config && item.config.index === index) {
          item.props = item.props || config.data;
        }
      });
      this.init && this.getConfig();
    },
    /**
     * 响应编辑器增加组件事件
     * @param data
     * @param index
     */
    addComponent({data, index}) {
      // 没有 schema 是系统组件
      this.currentIndex = index ? index + 1 : index;
      if (!data.schema) {
        this.components = [...this.components.slice(0, this.currentIndex), {
          name: 'coco-components-loader',
          props: null,
          config: {
            ...data,
            index: this.currentIndex
          }
        }, ...this.components.slice(this.currentIndex, this.components.length)];
      } else {
        this.components = [...this.components.slice(0, this.currentIndex), {
          name: data.name,
          props: data.data
        }, ...this.components.slice(this.currentIndex, this.components.length)];
        this.getConfig();
      }
    },
    /**
     * 修改 props
     * @param payload
     */
    changeProps(payload) {
      if (payload.type === '__page') {
        this.page.props = payload;
        this.$emit('init', this.page.props);
      } else {
        this.$set(this.components[this.currentIndex], 'props', payload);
      }
      this.getConfig();
    },
    /**
     * 修改 index
     * @param index
     */
    changeIndex(index) {
      this.currentIndex = index;
      this.getConfig();
    },
    deleteComponent(index) {
      this.components.splice(index, 1);
      this.changeIndex(index - 1 < 0 ? 0 : index - 1);
    },
    sortComponent({ index, op }) {
      const components = JSON.parse(JSON.stringify(this.components));
      const tmp = components[index];
      const next = index + op;
      components[index] = components[next];
      components[next] = tmp;
      this.components = components;
      this.changeIndex(next);
    },
    copyComponent(index) {
      this.components = [
        ...this.components.slice(0, index),
        JSON.parse(JSON.stringify(this.components[index])),
        ...this.components.slice(index, this.components.length)
      ];
      this.changeIndex(index + 1);
    }
  },
  components: {
    CocoComponentsLoader,
  }
};
</script>

