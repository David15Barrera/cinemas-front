export class HandlerError {
  public static handleError(error: any, alertStore: any, msgDefault: string) {
    const erroCode: number = error.error.status;
    const msg = error.error.message;
    switch (erroCode) {
      case 500:
        alertStore.addAlert({
          message: msgDefault,
          type: 'error',
        });
        break;
      default:
        alertStore.addAlert({
          message: msg,
          type: 'error',
        });
        break;
    }
  }
}
