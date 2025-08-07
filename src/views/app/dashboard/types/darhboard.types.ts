export interface Cashflow {
  net: {
    value: number;
    growth: number;
  };
  in: {
    value: number;
    growth: number;
  };
  out: {
    value: number;
    growth: number;
  };
  ratio: {
    value: number;
    // growth: number;
  };
}
