export interface AIProvider {
  generateRoutine(prompt: string): Promise<string>;
}