import { app, ipcMain, shell } from 'electron'
import store from './store.js'

export const development = process.env.NODE_ENV?.trim() === 'development'

const flags = [
  // not sure if safe?
  ['disable-gpu-sandbox'], ['disable-direct-composition-video-overlays'], ['double-buffer-compositing'], ['enable-zero-copy'], ['ignore-gpu-blocklist'],
  ['force_high_performance_gpu'],
  // should be safe
  ['enable-hardware-overlays', 'single-fullscreen,single-on-top,underlay'],
  // safe performance stuff
  ['enable-features', 'PlatformEncryptedDolbyVision,CanvasOopRasterization,ThrottleDisplayNoneAndVisibilityHiddenCrossOriginIframes,UseSkiaRenderer,WebAssemblyLazyCompilation'],
  ['disable-renderer-backgrounding'],
  // disabling shit, vulkan rendering, widget layering aka right click context menus [I think] for macOS [I think], rest is for chromium detecting how much video it should buffer, hopefully it makes it buffer more
  ['disable-features', 'Vulkan,WidgetLayering,MediaEngagementBypassAutoplayPolicies,PreloadMediaEngagementData,RecordMediaEngagementScores'],
  // utility stuff, aka website security that's useless for a native app:
  ['autoplay-policy', 'no-user-gesture-required'], ['disable-notifications'], ['disable-logging'], ['disable-permissions-api'], ['no-sandbox'], ['no-zygote'], ['bypasscsp-schemes'],
  // chromium throttles stuff if it detects slow network, nono, this is native, dont do that
  ['force-effective-connection-type', '4G'],
  // image video etc cache, hopefully lets video buffer more and remembers more images, might be bad to touch this?
  ['disk-cache-size', '500000000']
]
for (const [flag, value] of flags) {
  app.commandLine.appendSwitch(flag, value)
}

app.commandLine.appendSwitch('use-angle', store.get('angle') || 'default')

if (!app.requestSingleInstanceLock()) app.quit()

ipcMain.on('open', (event, url) => {
  shell.openExternal(url)
})

ipcMain.on('doh', (event, dns) => {
  try {
    app.configureHostResolver({
      secureDnsMode: 'secure',
      secureDnsServers: ['' + new URL(dns)]
    })
  } catch (e) {}
})

ipcMain.on('angle', (e, data) => {
  store.set('angle', data)
})

ipcMain.on('close', () => {
  app.quit()
})

ipcMain.on('version', ({ sender }) => {
  sender.send('version', app.getVersion()) // fucking stupid
})

app.setJumpList?.([
  {
    name: 'Frequent',
    items: [
      {
        type: 'task',
        program: 'miru://schedule/',
        title: 'Airing Schedule',
        description: 'Open The Airing Schedule'
      },
      {
        type: 'task',
        program: 'miru://w2g/',
        title: 'Watch Together',
        description: 'Create a New Watch Together Lobby'
      },
      {
        type: 'task',
        program: 'miru://donate/',
        title: 'Donate',
        description: 'Support This App'
      }
    ]
  }
])
// mainWindow.setThumbarButtons([
//   {
//     tooltip: 'button1',
//     icon: nativeImage.createFromPath('path'),
//     click () { console.log('button1 clicked') }
//   }, {
//     tooltip: 'button2',
//     icon: nativeImage.createFromPath('path'),
//     click () { console.log('button2 clicked.') }
//   }
// ])
