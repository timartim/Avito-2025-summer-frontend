export interface Notification {
   open: boolean;
   message: string;
   severity: 'success' | 'error' | 'info';
}
export interface Filter {
   priorities: string[];
   statuses: string[];
   boards: string[];
}