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

const TIMER_DURATION_RED = 30 * 60 * 1000
const TIMER_DURATION_ORANGE = 120 * 60 * 1000

export default {
  data () {
    return {
      url: 'http://192.168.1.123',
      timer: null,
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
      handler: function (state, oldState) {
        ipcRenderer.send('state', state)
        if (this.changed(state, oldState)) {
          this.show()
        }
      }
    }
  },
  created () {
    ipcRenderer.on('hide', this.setTimer)
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
        .then(data => {
          this.state = data
          setTimeout(this.hide, 500)
        })
    },
    changed (state, oldState) {
      if (state.red === oldState.red && state.orange === oldState.orange && state.green === oldState.green) return null

      return {
        red: state.red !== oldState.red,
        orange: state.orange !== oldState.orange,
        green: state.green !== oldState.green
      }
    },
    setTimer () {
      if (this.state.red) {
        this.timer = setTimeout(this.show, TIMER_DURATION_RED)
      } else if (this.state.orange) {
        this.timer = setTimeout(this.show, TIMER_DURATION_ORANGE)
      } else {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    show () {
      ipcRenderer.send('show')
    },
    hide () {
      ipcRenderer.send('hide')
    }
  }
}
</script>

<style lang="scss">
</style>
