const pipe = (...fns: any[]) =>
  <T>(initialValue: T) => fns.reduce((current, next) => current.then(next), Promise.resolve(initialValue));

export default pipe;