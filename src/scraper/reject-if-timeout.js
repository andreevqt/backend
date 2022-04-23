'use stict';

'use strict';

const { cancelable } = require('cancelable-promise');

const rejectIfTimeout = async (
  promise,
  timeout = 35000
) => {
  const p = cancelable(promise);

  const checkTimeout = new Promise(
    (resolve) => setTimeout(() => resolve('timeout'), timeout)
  );

  const result = await Promise.race([
    p,
    checkTimeout
  ]);

  if (result !== 'timeout') {
    return result;
  }

  p.cancel();
  throw new Error('Promise timed out');
};

module.exports = rejectIfTimeout;
