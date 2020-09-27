export const flushPromises = () => new Promise(setImmediate);

export const flushTimeouts = () => new Promise(v => setTimeout(v, 0));
