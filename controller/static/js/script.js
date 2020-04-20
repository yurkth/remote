Vue.component('secmark', {
  template: `
<div class="secmark" :style="style"></div>`,
  props: {
    step: Number,
    boardr: Number,
    markr: Number,
    color: String
  },
  data: function () {
    const r = this.step % 5 == 0 ? this.markr * 2 : this.markr
    const offset = this.boardr - r / 2
    const theta = this.step * 6 * (Math.PI / 180)
    return {
      style: {
        width: `${r}px`,
        height: `${r}px`,
        top: `${offset + this.boardr * Math.sin(theta)}px`,
        left: `${offset + this.boardr * Math.cos(theta)}px`,
        background: this.color
      }
    }
  }
})

Vue.component('bar', {
  template: `
<div class="bar" :style="style"></div>
  `,
  props: {
    mode: String,
    width: Number,
    length: Number,
    color: String
  },
  data: function () {
    const radius = this.width / 2
    let sec
    switch (this.mode) {
      case 'hour':
        sec = 43200
        break
      case 'min':
        sec = 3600
        break
      case 'sec':
        sec = 60
        break
    }
    return {
      style: {
        top: `calc(50% - ${radius}px)`,
        left: `calc(50% - ${radius}px)`,
        width: `${this.length}px`,
        height: `${this.width}px`,
        borderRadius: `${radius}px`,
        animation: `rotate-${this.mode} ${sec}s linear infinite`,
        transformOrigin: `${radius}px`,
        background: this.color
      }
    }
  }
})

Vue.component('clock', {
  template: `
<div class="clock" :style="style">
  <bar :mode="'hour'" :length="size * 0.3" :width="size / 30" :color="'#4a4a4a'"></bar>
  <bar :mode="'min'" :length="size * 0.45" :width="size / 45" :color="'#4a4a4a'"></bar>
  <bar :mode="'sec'" :length="size * 0.45" :width="size / 100" :color="'#4a4a4a'"></bar>
  <secmark v-for="n of 60" :step="n" :boardr="size / 2" :markr="size / 60" :color="'#4a4a4a'"></secmark>
</div>`,
  props: {
    size: Number
  },
  data: function () {
    return {
      style: {
        width: `${this.size}px`,
        height: `${this.size}px`,
        margin: `${this.size / 60 + 1}px auto`
      }
    }
  }
})

Vue.component('buttons', {
  template: `
<div class="button-box has-text-centered">
  <button class="button is-large is-rounded" v-for="op in operate" :key="op.id" @click="sendKeys(op.endpoint)">
    <span class="icon">
      <i :class="op.icon"></i>
    </span>
  </button>
</div>`,
  props: {
    operate: Array
  },
  methods: {
    sendKeys: function (endpoint) {
      fetch(`api/${endpoint}`)
    }
  }
})

let app = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],
  data: {
    overlay: -1,
    date: '‍',  // U+200D
    nowPlaying: { title: 'unknown title', artist: 'unknown artist', album: 'unknown album', artwork: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII=' },
    operates: { // ボタン
      play: [
        {
          icon: 'mdi mdi-fast-forward mdi-36px mdi-flip-h',
          endpoint: 'key/prevtrack'
        },
        {
          icon: 'mdi mdi-play-pause mdi-36px',
          endpoint: 'key/playpause'
        },
        {
          icon: 'mdi mdi-fast-forward mdi-36px',
          endpoint: 'key/nexttrack'
        }
      ],
      volume: [
        {
          icon: 'mdi mdi-volume-mute mdi-36px',
          endpoint: 'key/volumemute'
        },
        {
          icon: 'mdi mdi-volume-minus mdi-36px',
          endpoint: 'key/volumedown'
        },
        {
          icon: 'mdi mdi-volume-plus mdi-36px',
          endpoint: 'key/volumeup'
        }
      ],
      screen: [
        {
          icon: 'mdi mdi-gamepad-variant mdi-36px',
          endpoint: 'hotkey/ctrl+alt+z'
        },
        {
          icon: 'mdi mdi-monitor-off mdi-36px',
          endpoint: 'hotkey/ctrl+shift+x'
        },
        {
          icon: 'mdi mdi-monitor mdi-36px',
          endpoint: 'hotkey/ctrl+shift+s'
        }
      ],
      empty: [ // 未使用のボタン
        {
          icon: '',
          endpoint: ''
        },
        {
          icon: '',
          endpoint: ''
        },
        {
          icon: '',
          endpoint: ''
        }
      ]
    }
  },
  head: { // 時計の時間合わせ
    style() {
      const time = new Date()
      const hour = time.getHours()
      const min = time.getMinutes()
      const sec = time.getSeconds()
      const msec = time.getMilliseconds()

      const hourDeg = msec / 120000 + sec / 120 + min / 2 + hour * 30 - 90
      const minDeg = msec / 10000 + sec / 10 + min * 6 - 90
      const secDeg = msec * 3 / 500 + sec * 6 - 90

      return [
        {
          type: 'text/css', inner: `
@keyframes rotate-hour {
  from {
    transform: rotate(${hourDeg}deg);
  }
  to {
    transform: rotate(${hourDeg + 360}deg);
  }
}
@keyframes rotate-min {
  from {
    transform: rotate(${minDeg}deg);
  }
  to {
    transform: rotate(${minDeg + 360}deg);
  }
}
@keyframes rotate-sec {
  from {
    transform: rotate(${secDeg}deg);
  }
  to {
    transform: rotate(${secDeg + 360}deg)
  }
}`, undo: false
        }
      ]
    }
  }
})

setInterval(() => { // 再生中の楽曲と現在時刻の取得
  fetch('api/music')
    .then(response => response.json())
    .then(data => {
      if (!('message' in data)) {
        app.$data.nowPlaying = data
      }
    })
  app.$data.date = moment().format('ddd, MMMM Do YYYY')
}, 1000)
