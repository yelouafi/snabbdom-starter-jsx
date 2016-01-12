import Type from 'union-type';

const T = () => true;

export const UpdateResult = Type({
  Pure: [T],
  WithEffects: [T, T]
});

export const pure        = v      => UpdateResult.Pure(v);
export const withEffects = (v,ef) => UpdateResult.WithEffects(v, ef);
