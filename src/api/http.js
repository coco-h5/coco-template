import axios from 'axios';
import { env } from '@/config';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 30000,
  withCredentials: true
});

const http = opt => {
  const { url, method, params, config = {} } = opt;
  // mock环境
  if (env === 'mock') {
    const fileName = url.replace(/\//g, '^');
    const mock = require(`../mock/${fileName}${method}.json`);
    return Promise.resolve(mock);
  }
  return instance[method.toLocaleLowerCase()](url, params, config);
};

export default http;
