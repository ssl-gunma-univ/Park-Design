<template>
  <div class="container-fluid">
    <div class="row">
      <aside class="col-lg-12 col-xl-2 border rouded shadow">
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
            <div v-if="nplayers == 1" class="col-12 m-1 pt-5 pb-5 text-center back rounded shadow" id="playerDiv1">
              <h3>waiting for other players</h3>
            </div>

            <div class="col-lg-4">
              <div v-if="userleft"
                class="m-1 text-center back rounded shadow" id="playerDiv1">
                <h3 id="name_p1">{{ userleft.username }}</h3>
                <p id="player1sCard">{{ userleft.currentCard }}</p>
                <div id="damage_p1" class="mt-3">
                  {{ userleft.score }}
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div v-if="usertop"
                class="m-1 text-center back rounded shadow" id="playerDiv2">
                <h3 id="name_p2">{{ usertop.username }}</h3>
                <p id="player2sCard">{{ usertop.currentCard }}</p>
                <div id="damage_p2" class="mt-3">
                  {{ usertop.score }}
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div v-if="userright"
                class="m-1 text-center back rounded shadow" id="playerDiv3">
                <h3 id="name_p3">{{ userright.username }}</h3>
                <p id="player3sCard">{{ userright.currentCard }}</p>
                <div id="damage_p3" class="mt-3">
                  {{ userright.score }}
                </div>
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

            <div class="col-lg-4 text-center back rounded shadow" id="playerDiv0">
              <h3>{{ me.username }}</h3>
              <p v-if="!isPrairieDogCalled">My card</p>
              <p v-else>{{ getMyCard() }}</p>
              <input v-model="attempt" type="number" :disabled="myIndexInRoom != currentTurnIdx">
              <input type="button" value="数字宣言" @click="call" :disabled="attempt.length == 0"><br>
              <button type="button" class="btn btn-warning mt-3" @click="callPrairieDog" :disabled="myIndexInRoom != currentTurnIdx || lastNum == undefined || isPrairieDogCalled">プレーリードッグ！</button>
              <div class="mt-3">
                {{ me.score }}
              </div>
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
        <hr>
        <div class="jumbotron">
          <h1>プレーリードッグ</h1>
          <hr>
          <h2>ルール</h2>
          <ul>
            <li>前の人よりも「大きい数字」を宣言</li>
            <li>前の人の宣言が合計値を超えたと思ったら「プレーリードッグ！」と宣言</li>
          </ul>
          <div class="clearfix">
            <a class="float-right" href="/prairie-dog/rules" target="_blank">詳細</a>
          </div>
        </div>
      </main>

      <aside class="col-lg-3">
        <div class="card text-white text-center bg-dark mb-3">
          <div class="card-body" style="height: 8rem;">
            <h3 v-if="playing" class="card-title">{{ getUsername(currentTurnIdx) }}</h3>
            <h4 v-if="playing" class="card-text">のターン</h4>
            <h3 v-if="gameOver" class="card-title">ゲームセット</h3>
            <h4 v-if="gameOver" class="card-text">勝者：{{  }}</h4>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <b style="font-size: 21px;">Game Logs</b>
          </div>
          <div class="card-body" style="height: 30rem; overflow:auto; position: relative;">
            <span style="position: absolute; bottom: 0;">
              <p v-for="(event, index) in events" :key="index">
                <a v-if="event.author != undefined"><b>{{ event.author }}</b> : {{ event.action }}</a>
                <span v-else class="text-info"><b>SYSTEM</b> : {{ event.action }}</span>
              </p>
            </span>
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

    call () {
      if (parseInt(this.attempt) <= parseInt(this.lastNum)) {
        console.log('the number is upper than last called number')
        return
      }

      console.log('called')

      this.$store.dispatch('call', { attempt: parseInt(this.attempt), username: this.room.users[this.myIndexInRoom].username })

      // reset the textbox after called
      this.attempt = ''
    },

    callPrairieDog () {
      console.log('Prairie Dog!')
      this.attempt = ''
      this.$store.dispatch('callPrairieDog', this.room.users[this.myIndexInRoom].username)
    },

    gameStart () {
      console.log('gameStart')

      // initial distribution of cards to users
      this.$store.dispatch('drawCards', this.cardsLeft)

      // decide who is first turn
      this.$store.dispatch('preprocessing')

      // It is the `host` turn to play
      // this.$store.dispatch('nextUserPlay')
    },

    destroyRoom () {
      console.log('destroyRoom')

      this.$store.dispatch('destroyRoom')
    },

    nextRound () {
      console.log('nextRound')
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
