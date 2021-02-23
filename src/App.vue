<template>
  <div id="app">
    <CocoComponent>
      <coco-banner :obj="{
        src: require('./assets/banner.jpg'),
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
