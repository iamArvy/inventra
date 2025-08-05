export type FilterParams = {
  where?: Record<string, any>;
  orderBy?: Record<string, 1 | -1>;
  skip?: number;
  take?: number;
};
