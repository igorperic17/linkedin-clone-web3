export default () => ({
  walletKit: {
    port: parseInt(process.env.WALLET_KIT_PORT, 10) || 8080,
    baseUrl: process.env.WALLET_KIT_BASE_URL || 'http://walletkit'
  }
});