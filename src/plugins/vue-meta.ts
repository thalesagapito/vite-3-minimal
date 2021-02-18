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
// const metaManager = createMetaManager({
//   ...defaultConfig,
//   esi: {
//     group: true,
//     namespaced: true,
//     attributes: ['src', 'test', 'text'],
//   },
// }, defaultMetaResolver);

// useMeta(
//   {
//     og: {
//       something: 'test',
//     },
//   },
//   metaManager,
// );
