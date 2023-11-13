class INTERNAL_SERVER_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = INTERNAL_SERVER_ERROR;
