export interface EventPublisher {
  publish(topic: string, message: any): Promise<void>;
}