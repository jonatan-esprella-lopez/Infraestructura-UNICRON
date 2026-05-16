export interface ProviderPort {
  readonly name: string;
  isConfigured(): boolean;
}
