import { IResponseValue } from "../interfaces/IResponse"

export function unmarshalMessage(data: Buffer): IResponseValue {
  // @ts-ignore
  const envelopeMessage = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
  return {
    id: envelopeMessage.id!,
    event: envelopeMessage.event!,
    data: envelopeMessage.data!,
  }
} 