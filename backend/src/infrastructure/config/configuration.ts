export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  payment_gateway: {
    apiUrl: process.env.PAYMENT_GATEWAY_API_URL,
    publicKey: process.env.PAYMENT_GATEWAY_PUBLIC_KEY,
    privateKey: process.env.PAYMENT_GATEWAY_PRIVATE_KEY,
    eventsSecret: process.env.PAYMENT_GATEWAY_EVENTS_KEY,
  },
})
