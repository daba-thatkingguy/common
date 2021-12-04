import { randomBytes } from 'crypto';
import * as KafkaJS from 'kafkajs';
import { KafkaClient } from '../KafkaClient';
import { onMessageReceived } from '../helpers/message.received';
import { IResponse } from '../interfaces/IResponse';


export class Consumer extends KafkaClient {
  private readonly consumer: KafkaJS.Consumer
  private readonly topics: string[]

  /**
   * Creates a new instance of the Consumer
   *
   * @param brokers - List of brokers to connect to
   * @param topics - List of topics to consume
   * @param kafkaConfig - Kafka client configuration
   * @param consumerConfig - Consumer configuration
   */
  constructor(
    brokers: string[],
    topics = [] as string[],
    clientId?: string,
    kafkaConfig?: Omit<KafkaJS.KafkaConfig, 'brokers'>,
    groupId?: string,
    consumerConfig?: KafkaJS.ConsumerConfig
  ) {
    super({ clientId: clientId || randomBytes(4).toString('hex'), ...kafkaConfig, brokers })
    this.topics = topics

    this.consumer = this.kafka.consumer({ groupId: groupId || randomBytes(4).toString('hex'), ...consumerConfig })
  }

  /**
   * Returns the list of topics
   */
  public getTopics(): string[] {
    return this.topics
  }

  /**
   * Connects to Kafka and subscribes to each topic
   *
   * @returns a Promise that resolves if the connection is successful and rejects otherwise
   */
  public async connect(): Promise<void> {
    await this.consumer.connect()

    for (const topic of this.topics) {
      await this.consumer.subscribe({ topic })
    }

    this.isReady = true
  }

  /**
   * Disconnects from the broker and unsubscribes from the topics
   *
   * @returns a Promise that resolves if the connection is disconnected successfully
   */
  public async disconnect(): Promise<void> {
    this.checkReadiness()
    await this.consumer.disconnect()
    this.removeAllListeners()
    this.isReady = false
  }

  /**
   * Starts consuming messages
   * @param eventName - Event name to emit when a message is received
   */
  public async consume(eventName: string): Promise<void> {
    // Not absolutely necessary but enforces user to call connect() before calling consume()
    this.checkReadiness()

    await this.consumer.run({
      autoCommit: false,
      eachMessage: async (payload) => {
        await onMessageReceived(eventName, payload, this)
      }
    })
  }

  /**
   * Commits the offsets specified by the message
   *
   * @param message - Message from which to get the offset
   */
  public async commit(message: IResponse): Promise<void> {
    this.checkReadiness()

    await this.consumer.commitOffsets([
      {
        offset: (parseInt(message.offset, 10) + 1).toString(),
        topic: message.topic,
        partition: message.partition
      }
    ])
  }

  private checkReadiness() {
    if (!this.isReady) {
      throw new Error('Consumer is not currently connected, did you forget to call connect()?')
    }
  }
} 

