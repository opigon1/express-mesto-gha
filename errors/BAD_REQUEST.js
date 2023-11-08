class BAD_REQUEST extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = BAD_REQUEST;
