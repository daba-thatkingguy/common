import * as KafkaJS from 'kafkajs'

// import { unmarshalEnvelope } from '../../helpers'
import { EventType } from "../types/Event"
import { Consumer } from '../consumer/Consumer'
import { ResponseMessage } from '../helpers/Response'
import { unmarshalMessage } from './unmarshall'

/**
 * Unmarshalls the message value and emit an enriched message event
 * @param eventName The event name e.g 'message.received' or 'message.error'
 * @param payload Kafka message
 * @param consumer consumer
 */
export async function onMessageReceived(eventName: string, payload: KafkaJS.EachMessagePayload, consumer: Consumer) {
  const { topic, partition, message } = payload

  const responseMessage = new ResponseMessage(consumer, {
    ...message,
    key: message.key?.toString(),
    value: unmarshalMessage(message.value!),
    topic,
    partition
  })
  consumer.emit(eventName, responseMessage)
}
   