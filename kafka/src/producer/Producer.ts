import { randomBytes } from 'crypto';
import * as KafkaJS from 'kafkajs';
import { KafkaClient } from '../KafkaClient';

export default class Producer extends KafkaClient {
  private readonly producer: KafkaJS.Producer
  private readonly topics: string[]

  /**
   * Creates a new instance of the Producer
   *
   * @param brokers - List of brokers to connect to
   * @param topics - List of topics to produce to
   * @param kafkaConfig - Kafka client configuration
   * @param producerConfig - Producer configuration
   */
  constructor(
    brokers: string[],
    topics = [] as string[],
    clientId?: string,
    kafkaConfig?: Omit<KafkaJS.KafkaConfig, 'brokers'>,
    producerConfig?: KafkaJS.ProducerConfig
  ) {
    super({ clientId: clientId || randomBytes(4).toString('hex'), ...kafkaConfig, brokers })
    this.topics = topics

    this.producer = this.kafka.producer({ ...producerConfig })
  }

  /**
   * Returns the list of topics
   */
  public getTopics(): string[] {
    return this.topics
  }

  /**
   * Connects to Kafka 
   *
   * @returns a Promise that resolves if the connection is successful and rejects otherwise
   */
  public async connect(): Promise<void> {
    await this.producer.connect()
    this.isReady = true
  }

  /**
   * Disconnects from the broker and unsubscribes from the topics
   *
   * @returns a Promise that resolves if the connection is disconnected successfully
   */
  public async disconnect(): Promise<void> {
    this.checkReadiness()
    await this.producer.disconnect()
    this.removeAllListeners()
    this.isReady = false
  }

  /**
   * Starts producing messages
   */
  public async produce(options: KafkaJS.ProducerRecord): Promise<void> {
    this.checkReadiness()
    await this.producer.send({
      ...options
    })
  }

  /**
   * Produce to multiple topics
   * @param topicMessages - A list of topic messages to produce
   * @param options {ProducerConfig} - Producer configuration
   */
  async sendBatch(topicMessages: KafkaJS.TopicMessages[], options?: KafkaJS.ProducerRecord): Promise<void>  {
    await this.producer.connect()
    await this.producer.sendBatch({
      topicMessages,
      ...options
    })
  }

  private checkReadiness() {
    console.log(this.isReady)
    if (!this.isReady) {
      throw new Error('Producer is not currently connected, did you forget to call connect()?')
    }
  }
}
