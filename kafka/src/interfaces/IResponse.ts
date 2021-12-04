import { IHeaders, KafkaMessage } from 'kafkajs'


export interface IResponse extends Omit<KafkaMessage, 'key' | 'value'> {
  key: string
  timestamp: string
  value: IResponseValue
  size: number
  attributes: number
  offset: string
  headers?: IHeaders
  partition: number
  topic: string
}

export interface IResponseValue {
  id: string
  event: string
  data: any
}