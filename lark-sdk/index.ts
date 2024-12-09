import * as lark from '@larksuiteoapi/node-sdk';

export const client = new lark.Client({
  appId: process.env.appId || '',
  appSecret: process.env.appSecret || '',
  appType: lark.AppType.SelfBuild,
  domain: lark.Domain.Feishu,
});
