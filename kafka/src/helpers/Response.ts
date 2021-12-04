import { IResponse } from '../interfaces/IResponse';

import { Consumer } from '../consumer/Consumer';
/**
 * Response class representing a message from Daba platform
 */
export class ResponseMessage {
  constructor(private readonly consumer: Consumer, private readonly message: IResponse) {}

  /**
   * Commits the message offset
   */
  public async commit(): Promise<void> {
    await this.consumer.commit(this.message)
  }

  /**
   * Gets the message
   */
  public content(): IResponse {
    return this.message
  }
}
  