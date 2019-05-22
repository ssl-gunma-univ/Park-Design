<template>
  <div class="container-fluid">
    <div class="row">
      <aside class="col-lg-12 col-xl-2">
        <h2>残りカード</h2>
        <div class="row">
          <div v-for="index in 14" :key="index" class="col-lg-6 col-xl-12">
            <div class="clearfix">
              <p class="float-left">[{{ cardsType[index - 1] }}]</p>
              <p class="float-right">×{{ previousCardsLeft[index - 1].cardsLeft }}</p>
            </div>
          </div>
        </div>
      </aside>
      <main class="col-lg-7">
        <div class="bg-secondary p-5 rounded shadow border">
          <div class="row mb-3">
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
            <div class="col-lg-3 mb-3">
            </div>

            <div class="col-lg-6 mb-3">
              <div class="card text-white text-center bg-dark">
                <div class="card-body" style="height: 10rem;">
                  <h3 class="card-title">最後の数字宣言</h3>
                  <h5 v-if="lastNum == undefined" class="card-text">まだ宣言されていません</h5>
                  <h1 id="gameMaster" class="card-text">{{ lastNum }}</h1>
                </div>
              </div>
            </div>

            <div class="col-lg-3 mb-3">
            </div>
          </div>
          <div class="row">

            <div class="col-lg-4 mb-3">
            </div>

            <div class="col-lg-4 text-center back rounded shadow" id="playerDiv0">
              <h3 id="name_p0">{{ me.username }}</h3>
              <p v-if="gameOver" id="myCard">{{ getMyCard() }}</p>
              <input v-model="attempt" type="number" id="textBox" :disabled="myIndexInRoom != currentTurnIdx">
              <input type="button" id="callButton" value="数字宣言" @click="call" :disabled="attempt.length == 0"><br>
              <button id="prairie" type="button" class="btn btn-warning mt-3" @click="callPrairieDog" :disabled="myIndexInRoom != currentTurnIdx">プレーリードッグ！</button>
              <div id="damage_p0" class="mt-3">
                {{ me.score }}
              </div>
            </div>
            <div v-if="me.role == 'host'"
              class="col-lg-4 text-center mback rounded shadow">
              <h3 class="text-white">GAME MENU</h3>
              <button @click="gameStart" :disabled="nplayers < 4 || playing" id="start" type="button" class="btn btn-primary mb-2 w-50">GAME START</button><br>
              <button @click="nextRound"  :disabled="! gameOver" id="next" type="button" class="btn btn-success mb-2 w-50" >NEXT ROUND</button><br>
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
        <div class="row">
          <div id="rest-10" class="col"></div>
          <div id="rest-5" class="col"></div>
          <div id="rest0" class="col"></div>
          <div id="rest1" class="col"></div>
          <div id="rest2" class="col"></div>
          <div id="rest3" class="col"></div>
          <div id="rest4" class="col"></div>
          <div id="rest5" class="col"></div>
          <div id="rest10" class="col"></div>
          <div id="rest15" class="col"></div>
          <div id="rest20" class="col"></div>
          <div id="restx2" class="col"></div>
          <div id="restmax" class="col"></div>
          <div id="rest?" class="col"></div>
        </div>
      </main>
      
      <aside class="col-lg-3">
        <div class="card text-white text-center bg-dark">
          <div class="card-body" style="height: 10rem;">
            <h3 class="card-title">{{ getUsername(currentTurnIdx) }}</h3>
            <h3 v-if="playing" class="card-text">のターン</h3>
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
      attempt: '',
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
      'gameOver',
      'cardsLeft',
      'previousCardsLeft'
    ]),
  },
  methods: {
    getUsername (index) {
      if(index !== undefined)
        return this.room.users[index].username
    },

    getMyCard () {
      if(this.room.users[this.myIndexInRoom].currentCard !== undefined)
        return this.room.users[this.myIndexInRoom].currentCard
    },

    call () {
      if(parseInt(this.attempt) <= parseInt(this.lastNum)) {
        console.log('the number is upper than last called number')
        return
      }
      
      console.log('called')

      attempt = ''

      this.$store.dispatch('call', parseInt(this.attempt))
    },

    callPrairieDog () {
      console.log('Prairie Dog!')
      console.log(this.room.users[this.myIndexInRoom].currentCard)
      this.me.currentCard = this.room.users[this.myIndexInRoom].currentCard
      
      this.$store.dispatch('callPrairieDog')
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

    resetCards (){
        /* method called only by user with role `host` */
        this.$store.dispatch('resetCards')
    }
  },

  created () {
    this.$store.dispatch('watchRoom', this.$route.params.roomId)
  }

}
</script>
