import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'child_process'
import path from 'path'
import net from 'net'

function autoStartBackendPlugin() {
  return {
    name: 'auto-start-backend',
    configureServer() {
      const socket = new net.Socket()
      socket.setTimeout(800)
      socket
        .once('connect', () => {
          socket.destroy()
        })
        .once('error', () => {
          socket.destroy()
          const backendDir = path.resolve(__dirname, '../..')
          const child = spawn('node', ['server.js'], {
            cwd: backendDir,
            detached: true,
            stdio: 'ignore',
          })
          child.unref()
        })
        .connect(5000, '127.0.0.1')
    },
  }
}

export default defineConfig({
  plugins: [react(), autoStartBackendPlugin()],
  server: { port: 3000, open: true },
})
