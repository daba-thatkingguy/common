import { Consumer } from "../consumer/Consumer";
import { ResponseMessage } from "../helpers/Response";


const consume = async (consumer: Consumer) => {
  await consumer.connect()
  consumer.on('response', async (message: ResponseMessage) => {
    const { value, topic, offset } = message.content()
    
    console.log('Message received', {
      id: value.id,
      event: value.event,
      data: value.data,
      topic,
      offset
    })
    // at this point, we can process the value of the message and after successfully processing the message, we can commit the offset
    await message.commit()
    console.log('Message comitted')
  })
  await consumer.consume('response')
}

export const start = async () => {
  try {
    const consumer = new Consumer(['localhost:9092'], ['topic-test'], 'example', {
      connectionTimeout: 3000,
      // @ts-ignore
      logLevel: 'debug'
    } )
    await consume(consumer)
  } catch (error) {
    console.error(error)
  }
}

start()