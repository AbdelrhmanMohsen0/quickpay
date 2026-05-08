export class NotAdminError extends Error {
  constructor() {
    super("You do not have admin privileges.");
    this.name = "NotAdminError";
  }
}
