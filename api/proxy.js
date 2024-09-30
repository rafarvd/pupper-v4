const proxy = {
  host: process.env.IP_PROXY || false,
  port: process.env.PORT_PROXY,
  username: process.env.USER_PROXY,
  password: process.env.PASS_PROXY,
};

module.exports = proxy;

