export class stringHelper {
  static format(format: string, ...params: string[]) {
    if (!format) {
      return null;
    }

    if (!params && params.length == 0) {
      return format;
    }

    for (var i = 0; i < params.length; i++) {
      const item = params[i]

      format = format.replace(`{${i}}`, item);
    }

    return format;
  }
}
