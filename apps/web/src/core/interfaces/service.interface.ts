export interface Service {
  name: string;
  initialize?(): Promise<void> | void;
}
