export default class {
  static formatDateYYYYMMDD(date, split) {
    date = date instanceof Date ? date : date ? new Date(date) : new Date();
    let y = date.getFullYear();
    let M = ("0" + (date.getMonth() + 1)).slice(-2);
    let d = ("0" + date.getDate()).slice(-2);
    return [y, M, d].join(split || "-");
  }
}
