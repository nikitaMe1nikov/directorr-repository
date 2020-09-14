export default () => (next: any) => (action: any) => {
  console.log('log action:', action);
  next(action);
};
