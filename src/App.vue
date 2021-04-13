<template>
  <div id="app">
    <CocoComponent>
      <coco-banner :obj="{
        src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
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
<style>
* {
  margin: 0;
  padding: 0;
}
img {
  vertical-align: top;
}
</style>
