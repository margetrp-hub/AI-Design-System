export interface UiOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
export interface UiMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}
export interface UiTab {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface UiAccordionItem {
  value: string;
  title: string;
  description?: string;
  disabled?: boolean;
}
export type RowId = string | number;
export interface DataColumn<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  numeric?: boolean;
  format?: (value: T[keyof T], row: T) => string;
}
export type SortState = { key: string; direction: "asc" | "desc" } | null;
