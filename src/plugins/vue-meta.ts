import {
  useMeta,
  defaultConfig,
  resolveOption,
  createMetaManager,
} from 'vue-meta';

const defaultMetaResolver = resolveOption((prevValue, context) => {
  const { uid = 0 } = context.vm || {};
  if (!prevValue || prevValue < uid) return uid;
  return undefined;
});

export const metaManager = createMetaManager(defaultConfig, defaultMetaResolver);