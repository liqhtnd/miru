const mode = process.env.NODE_ENV?.trim() || 'development'

const config = {
  appId: 'watch.migu',
  appName: 'Migu',
  webDir: 'build',
  android: {
    buildOptions: {
      keystorePath: './watch.migu',
      keystorePassword: '',
      keystoreAlias: 'watch.migu'
    },
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: { launchShowDuration: 0 },
    CapacitorHttp: { enabled: true },
    CapacitorNodeJS: { nodeDir: 'nodejs' }
  },
  server: {
    cleartext: true
  }
}

if (mode === 'development') config.server.url = 'http://localhost:5001/index.html'

module.exports = config
