import http from './http';

export const getCampaignInfo = params => {
  const url = 'api/1.0.0/getCampaignInfo';
  return http({
    url,
    method: 'Post',
    params
  });
};
