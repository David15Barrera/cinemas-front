type Filter<T extends string> = Partial<Record<T, string>>;

export type Pageable<T extends string> = Filter<T> & {
  page?: number;
  size?: number;
  sort?: string[];
};

export type Page<T extends object> = {
  content: T[];
  last?: boolean;
  first?: boolean;
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  pageable?: {
    pageNumber?: number;
    pageSize?: number;
    offset?: number;
  };
  number?: number;
  size?: number;
  empty?: boolean;
};
