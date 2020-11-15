/* eslint-disable  @typescript-eslint/no-explicit-any */

export const objectKeys = (keys: string[]) => (body: {
  [key: string]: any;
}) => {
  const bodyKeys = Object.keys(body);
  console.log('bodyKeys', bodyKeys);
  console.log('keys', keys);
  for (const key of bodyKeys) {
    if (!keys.find((item) => item === key))
      throw new Error('Some extra parameters are sent');
  }
  return true;
};
