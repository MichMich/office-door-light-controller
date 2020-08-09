<template>
  <div id="app">
    <div  class="min-h-screen flex flex-col text-white p-2">
      <a href="#" class="flex-1 mb-2 flex items-center justify-center rounded-lg shadow-lg border-4 border-red-800 hover:opacity-100 hover:border-red-500 focus:outline-none" :class="state.red ? 'bg-red-500' : 'bg-red-900 opacity-25'" @click.prevent="setState(true, false, false)">DND</a>
      <a href="#" class="flex-1 mb-2 flex items-center justify-center rounded-lg shadow-lg border-4 border-yellow-800 hover:opacity-100 hover:border-yellow-500 focus:outline-none" :class="state.orange ? 'bg-yellow-500' : 'bg-yellow-900 opacity-25'" @click.prevent="setState(false, true, false)">Kids DND</a>
      <a href="#" class="flex-1 mb-2 flex items-center justify-center rounded-lg shadow-lg border-4 border-green-800 hover:opacity-100 hover:border-green-500 focus:outline-none" :class="state.green ? 'bg-green-500' : 'bg-green-900 opacity-25'" @click.prevent="setState(false, false, true)">Free</a>
      <a href="#" class="flex-1 flex items-center justify-center rounded-lg shadow-lg border-4 border-gray-800 hover:opacity-100 hover:border-white focus:outline-none opacity-25" @click.prevent="setState(false, false, false)">Off</a>
    </div>
  </div>
</template>

<script>

const { ipcRenderer } = require('electron')

export default {
  data () {
    return {
      url: 'http://192.168.1.123',
      state: {
        red: false,
        orage: false,
        green: false
      }
    }
  },
  watch: {
    state: {
      deep: true,
      handler: (state) => {
        ipcRenderer.send('state', state)
      }
    }
  },
  mounted () {
    this.getState()
  },
  methods: {
    async getState () {
      fetch(this.url)
        .then(response => response.json())
        .then(data => { this.state = data })

      setTimeout(this.getState, 1000)
    },
    setState (red, orange, green) {
      const state = { red, orange, green }
      fetch(this.url, {
        method: 'POST',
        body: JSON.stringify(state)
      })
        .then(response => response.json())
        .then(data => { this.state = data })
    }
  }
}
</script>

<style lang="scss">
</style>
