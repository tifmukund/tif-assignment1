import { Snowflake } from "@theinternetfolks/snowflake";

export const listToColumn = <T extends string>(
  columns: readonly string[]
): Record<T, string> => {
  type IColumnList = Record<T, string>;
    return columns.reduce<IColumnList>(
        (prev, current) => ({...prev,[current]: current,}),
        {} as IColumnList
  );
};
