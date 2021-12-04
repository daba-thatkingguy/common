import { Producer } from "../producer/Producer";
import { CompressionTypes } from "kafkajs";


const produce = async (producer: Producer) => {
  await producer.connect()
  const data = {
    id: '1',
    event: 'test',
    data: {
      test: 'test',
      name: 'king',
      age: 23
    }
  }
  await producer.produce({
    topic: "topic-test",
    messages: [{ value: JSON.stringify(data) }],
    compression: CompressionTypes.GZIP
 })
}

export const start = async () => {
  try {
    const producer = new Producer(['localhost:9092'], ['topic-test'], 'example', {
      connectionTimeout: 3000,
      // @ts-ignore
      logLevel: 'debug'
    } )
    await produce(producer)
  } catch (error) {
    console.error(error)
  }
}

start()