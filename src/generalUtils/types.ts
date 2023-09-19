

export type SortOrders = "ASC" | "DESC";
// to array
export const SortOrderValues: SortOrders[] = ["ASC", "DESC"];

export type AgGridFilter = 'contains' | 'notContains' | 'equals' | 'notEqual' | 'startsWith' | 'endsWith' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual' | 'inRange' | 'empty' | 'notEmpty';
export const AgGridFilterValues: AgGridFilter[] = ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'inRange', 'empty', 'notEmpty'];