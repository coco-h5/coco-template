import { isEdit } from '@/common/utils';

export const getEnv = () => {
  let env = 'mock';
  const host = location.host;
  if (isEdit || process.env.VUE_APP_ENV === 'mock') {
    env = 'mock';
  } else if (/\.dev\.|\d+\.\d+\.|localhost/.test(host)) {
    env = 'dev';
  } else if (/\.qa\./.test(host)) {
    env = 'qa';
  } else if (/\.pre\./.test(host)) {
    env = 'pre';
  } else {
    env = 'pro';
  }

  return env;
};

export const env = getEnv();

