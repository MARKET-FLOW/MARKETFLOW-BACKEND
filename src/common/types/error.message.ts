import { ErrorType } from './error-type.enum';

export class ErrorMessage {
  private readonly type: ErrorType;
  private readonly message: string;

  constructor(type: ErrorType, message: string) {
    this.type = type;
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }

  getType(): ErrorType {
    return this.type;
  }
}
