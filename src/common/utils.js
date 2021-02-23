import { parse } from 'qs';
import Vue from 'vue';

import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';

function getComponent() {
  const componentConfig = [];
  const requireConfig = require.context(
    '../components',
    // 是否查询其子目录
    true,
    /package.json$/
  );
  requireConfig.keys().forEach(fileName => {
    const config = requireConfig(fileName);
    componentConfig.push(config);
  });

  return componentConfig;
}

function getPageConfig() {
  let pageConfig = {};
  const requireConfig = require.context(
    '../',
    // 是否查询其子目录
    false,
    /package.json$/
  );
  requireConfig.keys().forEach(fileName => {
    const config = requireConfig(fileName);
    pageConfig = config;
  });

  return pageConfig;
}

function registerComponent(Vue) {
  const requireComponent = require.context(
    '../components',
    // 是否查询其子目录
    true,
    /\.vue$/
  );

  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName);

    // 获取组件的 PascalCase 命名
    const componentName = upperFirst(
      camelCase(
        fileName
          .split('/')[1]
          .replace(/\.\w+$/, '')
      )
    );
    // 注册组件
    Vue.component(
      componentName,
      componentConfig.default || componentConfig
    );
  });
}

registerComponent(Vue);

let config = {
  componentConfig: getComponent(),
  pageConfig: getPageConfig()
};


export {
  config
}

const query = parse(location.href.split('?')[1]) || {};

export const isEdit = query.isEdit === 'true';

export const isPreview = query.isPreview === 'true';
const env = query.env;

export const pageId = query.pageId

export const baseUrl = {
  development: 'http://dev.api.com',
  production: ''
}[env]


export function postMsgToParent (message) {
  window.parent.postMessage(
    message,
    '*'
  );
}

export function getDefaultProps (schema) {
  const props = {};
  Object.keys(schema).forEach(key => {
    const { type, defaultValue, values } = schema[key];
    if (type === 'object') {
      props[key] = getDefaultProps(values);
    } else if (type === 'array') {
      props[key] = [getDefaultProps(values[0])];
    } else {
      props[key] = defaultValue;
    }
  });
  return props;
}

export function xhrGet( url, callback ){
  const request = new XMLHttpRequest();
  request.open( "GET", url );
  request.withCredentials = true
  request.responseType = 'json'
  request.onreadystatechange = function(){
    if( request.readyState !== 4 ) return;
    if( request.status === 200 ){
      callback( request.response );
    }
  }
  request.send( null )
}
