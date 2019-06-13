<template>
  <div id="app">
    <app-header v-if="! isPlayroom && this.$route.name !== 'prairiedogplayroom'"></app-header>
    <router-view/>
    <app-footer v-if="! isPlayroom && this.$route.name !== 'about'"></app-footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      isPlayroom: false,
      temp: false
    }
  },
  components: {
    'app-header': Header,
    'app-footer': Footer
  },
  watch: {
    '$route': function (to, from) {
      if(to.name === 'prairiedogplayroom') {
        this.isPlayroom = true
      } else {
        this.isPlayroom = false
      }
    }
  },
  created () {
    if(location.pathname.match(/^\/playroom/)) {
      this.temp = true
    }
    if(this.$route.name === 'prairiedogplayroom') {
      this.temp = true
    } else {
      this.temp = false
    }
  }
}
</script>

<style lang="scss">
/* from layout.css */
html {
  font-size: 16px;
}

body {
  font-family: "Hiragino Kaku Gothic ProN", "メイリオ", sans-serif;
}

main {
  padding-top: 1rem;
}

aside {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

img {
  width: 100%;
}

*:focus {
  outline: none !important;
}

*:focus {
 box-shadow:none !important;
}

.back {
  padding: 1rem;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#e0f3fa+0,d8f0fc+50,b8e2f6+51,b6dffd+100;Shape+2+Style */
  background: rgb(224,243,250); /* Old browsers */
  background: -moz-linear-gradient(top,  rgba(224,243,250,1) 0%, rgba(216,240,252,1) 50%, rgba(184,226,246,1) 51%, rgba(182,223,253,1) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top,  rgba(224,243,250,1) 0%,rgba(216,240,252,1) 50%,rgba(184,226,246,1) 51%,rgba(182,223,253,1) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom,  rgba(224,243,250,1) 0%,rgba(216,240,252,1) 50%,rgba(184,226,246,1) 51%,rgba(182,223,253,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e0f3fa', endColorstr='#b6dffd',GradientType=0 ); /* IE6-9 */
}

.turn {
  padding: 1rem;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#f3c5bd+0,e86c57+50,ea2803+51,ff6600+75,c72200+100;Red+Gloss */
  background: rgb(243,197,189); /* Old browsers */
  background: -moz-linear-gradient(top,  rgba(243,197,189,1) 0%, rgba(232,108,87,1) 50%, rgba(234,40,3,1) 51%, rgba(255,102,0,1) 75%, rgba(199,34,0,1) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top,  rgba(243,197,189,1) 0%,rgba(232,108,87,1) 50%,rgba(234,40,3,1) 51%,rgba(255,102,0,1) 75%,rgba(199,34,0,1) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom,  rgba(243,197,189,1) 0%,rgba(232,108,87,1) 50%,rgba(234,40,3,1) 51%,rgba(255,102,0,1) 75%,rgba(199,34,0,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f3c5bd', endColorstr='#c72200',GradientType=0 ); /* IE6-9 */
}

.mback {
  padding: 1rem;
  background-color: rgb(90, 101, 114);
}

</style>
