<template>
  <div id="app">
    <CocoComponent>
      <coco-banner :obj="{
        src: 'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2e81c9d78a24c5fb0cb33bfcc366dce~tplv-k3u1fbpfcp-watermark.image',
        link: 'https://coco.com',
      }" />
      <coco-form />
    </CocoComponent>
  </div>
</template>

<script>
import CocoComponent from './common/coco-component';
import CocoBanner from './components/coco-banner/index';
import CocoForm from './components/coco-form/index';
export default {
  name: 'App',
  components: {
    CocoBanner,
    CocoForm,
    CocoComponent,
  }
}
</script>
