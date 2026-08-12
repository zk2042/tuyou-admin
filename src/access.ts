import type { InitialState } from './app';

export default (initialState?: InitialState) => {
  const permKeys = new Set(initialState?.perm_keys ?? []);

  return {
    hasPerm: (permKey: string) => permKeys.has(permKey),
  };
};
