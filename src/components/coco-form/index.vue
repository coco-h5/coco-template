<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="username"
      name="用户名"
      label="用户名"
      placeholder="用户名"
    />
    <van-field
      v-model="phone"
      type="phone"
      name="手机号"
      label="手机号"
      placeholder="手机号"
    />
    <van-field
      v-model="address"
      type="address"
      name="地址"
      label="地址"
      placeholder="地址"
    />
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">提交</van-button>
    </div>
  </van-form>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      address: '',
      phone: ''
    };
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values);
    },
  },
};
</script>

<style scoped>

</style>