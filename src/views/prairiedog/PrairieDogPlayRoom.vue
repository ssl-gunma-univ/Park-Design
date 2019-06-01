<template>
  <div class="container-fluid">
    <div class="row">
      <aside class="col-lg-12 col-xl-2 border rouded shadow text-white" :style="{'background-image': 'url(' + require('@/assets/Images/wood-oil-bk.jpg') + ')'}">
        <h2>残りカード</h2>
        <hr>
        <div class="row">
          <div v-for="index in 14" :key="index" class="col-lg-6 col-xl-12">
            <div v-if="previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0" class="clearfix">
              <p class="float-left">[{{ previousCardsLeft[index - 1].type }}]</p>
              <p class="float-right">×{{ previousCardsLeft[index - 1].cardsLeft }}</p>
            </div>
          </div>
        </div>
      </aside>
      <main class="col-lg-9 col-xl-7">
        <div class="gameboard p-5 rounded shadow border">
          <div class="row mb-3">
            <div v-if="nplayers == 1" class="col-12 m-1 pt-5 pb-5 text-center back rounded shadow">
              <h3>waiting for other players</h3>
            </div>

            <div class="col-lg-4">
              <div v-if="userleft" class="m-1 text-center rounded shadow"
                v-bind:class="{ turn: userleft.username === getUsername(currentTurnIdx), back: !(userleft.username === getUsername(currentTurnIdx)), 'py-5': ! playing }">
                <h3 id="name_p1">{{ userleft.username }}</h3>
                <p id="player1sCard">{{ userleft.currentCard }}</p>
                <p class="mt-3">ダメージ：{{ userleft.damage }}</p>
              </div>
            </div>

            <div class="col-lg-4">
              <div v-if="usertop" class="m-1 text-center rounded shadow"
                v-bind:class="{ turn: usertop.username === getUsername(currentTurnIdx), back: !(usertop.username === getUsername(currentTurnIdx)), 'py-5': ! playing }">
                <h3 id="name_p2">{{ usertop.username }}</h3>
                <p id="player2sCard">{{ usertop.currentCard }}</p>
                <p class="mt-3">ダメージ：{{ usertop.damage }}</p>
              </div>
            </div>

            <div class="col-lg-4">
              <div v-if="userright" class="m-1 text-center rounded shadow"
                v-bind:class="{ turn: userright.username === getUsername(currentTurnIdx), back: !(userright.username === getUsername(currentTurnIdx)), 'py-5': ! playing }">
                <h3 id="name_p3">{{ userright.username }}</h3>
                <p id="player3sCard">{{ userright.currentCard }}</p>
                <p class="mt-3">ダメージ：{{ userright.damage }}</p>
              </div>
            </div>
          </div>

          <div class="row">

            <div class="col-lg-3">
            </div>

            <div class="col-lg-6 mb-3">
              <div class="border text-center centerboard text-dark shadow">
                <div class="card-body" style="height: 10rem;">
                  <h3 class="card-title">最後の数字宣言</h3>
                  <hr>
                  <h5 v-if="lastNum == undefined" class="card-text">まだ宣言されていません</h5>
                  <h1 v-else class="card-text">{{ lastNum }}</h1>
                </div>
              </div>
            </div>

            <div class="col-lg-3">
            </div>
          </div>

          <div class="row">
            <div class="col-lg-4">
            </div>

            <div class="col-lg-4 text-center rounded shadow"
              v-bind:class="{ turn: me.username === getUsername(currentTurnIdx), back: ! (me.username === getUsername(currentTurnIdx)), 'py-5': ! playing }">
              <h3>{{ me.username }}</h3>
              <p v-if="!isPrairieDogCalled && playing">My card</p>
              <p v-if="isPrairieDogCalled">{{ getMyCard() }}</p>
              <p class="mt-3">ダメージ：{{ getMyDamage() }}</p>
            </div>

            <div v-if="me.role == 'host'"
              class="col-lg-4 text-center mback rounded shadow">
              <h3 class="text-white">GAME MENU</h3>
              <button @click="gameStart" :disabled="nplayers == 1 || playing" id="start" type="button" class="btn btn-primary mb-2 w-50">GAME START</button><br>
              <button @click="nextRound"  :disabled="! isPrairieDogCalled || gameOver" id="next" type="button" class="btn btn-success mb-2 w-50" >NEXT ROUND</button><br>
              <button @click="destroyRoom" id="remove" type="button" class="btn btn-danger w-50">部屋解散</button>
            </div>
          </div>
        </div>
      </main>

      <aside class="col-lg-3">
        <div class="card">
          <div class="card-header">
            <b style="font-size: 21px;">Game Logs</b>
          </div>
          <div class="card-body" style="height: 30rem; overflow: auto; position: relative;">
            <span style="position: absolute; bottom: 0;">
              <p v-for="(event, index) in events" :key="index">
                <a v-if="event.author != undefined"><b>{{ event.author }}</b> : {{ event.action }}</a>
                <span v-else class="text-info"><b>SYSTEM</b> : {{ event.action }}</span>
              </p>
            </span>
          </div>
          <div class="card-footer bg-dark text-white">
            <form class="form-inline">
              <div class="form-group">
                <input v-model="attempt" type="number" class="form-control mr-2" :disabled="myIndexInRoom != currentTurnIdx || isPrairieDogCalled">
                <input type="button" value="数字宣言" class="btn btn-primary" @click="call" :disabled="attempt.length == 0">
              </div>
            </form>
            <div class="d-flex flex-row-reverse">
              <button type="button" class="btn btn-warning mt-3" @click="callPrairieDog"
                :disabled="myIndexInRoom != currentTurnIdx || lastNum == undefined || isPrairieDogCalled">プレーリードッグ！</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      attempt: ''
    }
  },
  computed: {
    ...mapState([
      'me',
      'room',
      'cardsType'
    ]),
    ...mapGetters([
      'myIndexInRoom',
      'userleft',
      'usertop',
      'userright',
      'nplayers',
      'currentTurnIdx',
      'lastNum',
      'playing',
      'isPrairieDogCalled',
      'gameOver',
      'cardsLeft',
      'previousCardsLeft',
      'events'
    ])
  },
  methods: {
    getUsername (index) {
      if (index !== undefined) {
        return this.room.users[index].username
      }
    },

    getMyCard () {
      if (this.room.users[this.myIndexInRoom].currentCard !== undefined) {
        return this.room.users[this.myIndexInRoom].currentCard
      }
    },

    getMyDamage () {
      if (this.room.users[this.myIndexInRoom].damage !== undefined) {
        return this.room.users[this.myIndexInRoom].damage
      }
    },

    call () {
      if (parseInt(this.attempt) <= parseInt(this.lastNum)) {
        const jsFrame = new JSFrame();
        jsFrame.showToast({
            html: 'The number is upper than last called number.', duration: 2000
        });
        return
      }

      this.$store.dispatch('call', { attempt: parseInt(this.attempt), username: this.room.users[this.myIndexInRoom].username })

      // reset the textbox after called
      this.attempt = ''
    },

    callPrairieDog () {
      this.attempt = ''
      this.$store.dispatch('callPrairieDog', this.room.users[this.myIndexInRoom].username)
    },

    async gameStart () {
      // initial distribution of cards to users
      // this.$store.dispatch('resetCards').then(() => {
      //   this.$store.dispatch('drawCards', this.cardsLeft).then(() => {
      //     this.$store.dispatch('preprocessing')
      //   })
      // })
      await this.$store.dispatch('resetCards')
      this.$store.dispatch('preprocessing', this.cardsLeft)
    },

    destroyRoom () {
      this.$store.dispatch('destroyRoom')
    },

    nextRound () {
      this.$store.dispatch('nextRound')
    },

    resetCards () {
      /* method called only by user with role `host` */
      this.$store.dispatch('resetCards')
    }
  },

  created () {
    this.$store.dispatch('watchRoom', this.$route.params.roomId)
  }

}
</script>

<style>
.gameboard {
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#d2dfed+0,a6c0e3+0,afc7e8+14,afc7e8+14,c8d7eb+35,bad0ef+66,99b5db+88,799bc8+100 */
  background: #d2dfed; /* Old browsers */
  background: -moz-linear-gradient(top,  #d2dfed 0%, #a6c0e3 0%, #afc7e8 14%, #afc7e8 14%, #c8d7eb 35%, #bad0ef 66%, #99b5db 88%, #799bc8 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top,  #d2dfed 0%,#a6c0e3 0%,#afc7e8 14%,#afc7e8 14%,#c8d7eb 35%,#bad0ef 66%,#99b5db 88%,#799bc8 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom,  #d2dfed 0%,#a6c0e3 0%,#afc7e8 14%,#afc7e8 14%,#c8d7eb 35%,#bad0ef 66%,#99b5db 88%,#799bc8 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#d2dfed', endColorstr='#799bc8',GradientType=0 ); /* IE6-9 */
}

.centerboard {
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#b0d4e3+0,88bacf+100;Grey+3D+%233 */
  background: rgb(176,212,227); /* Old browsers */
  background: -moz-linear-gradient(top,  rgba(176,212,227,1) 0%, rgba(136,186,207,1) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top,  rgba(176,212,227,1) 0%,rgba(136,186,207,1) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom,  rgba(176,212,227,1) 0%,rgba(136,186,207,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b0d4e3', endColorstr='#88bacf',GradientType=0 ); /* IE6-9 */
}
</style>
