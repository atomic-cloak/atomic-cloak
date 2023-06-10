export class HttpError extends Error {
  status: Number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
