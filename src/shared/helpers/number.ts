export const roundFloat = (value: number, precision: number) =>
  parseFloat(value.toFixed(precision));
export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
