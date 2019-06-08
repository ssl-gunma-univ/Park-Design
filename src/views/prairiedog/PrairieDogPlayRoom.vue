<template>
  <div class="container-fluid">
    <div class="row">
      <aside class="col-lg-12 col-xl-2 rouded shadow text-white d-none d-xl-block" :style="{'background-image': 'url(' + require('@/assets/Images/wood-oil-bk.jpg') + ')', 'height': '100vh', 'overflow': 'auto'}">
        <h3>残りカード</h3>
        <hr class="border border-white">
        <div class="row">
          <div v-for="index in 14" :key="index" class="col-6 col-md-4 col-lg-3 col-xl-12">
            <div v-if="previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0" class="row">
              <div class="col-9">
                <img v-if="previousCardsLeft[index - 1].type === '?'" class="w-100 img-thumbnail shadow" src="@/assets/PrairieDogCards/？.jpg"/>
                <img v-else class="w-100 img-thumbnail shadow" v-bind:src="require('@/assets/PrairieDogCards/' + previousCardsLeft[index - 1].type + '.jpg')"/>
              </div>
              <h4 class="my-auto col-3 d-flex justify-content-end">×{{ previousCardsLeft[index - 1].cardsLeft }}</h4>
            </div>
          </div>
        </div>
      </aside>

      <main class="col-lg-9 col-xl-7 px-1">

        <div class="gameboard p-4 rounded shadow border">
          <div class="row mb-2">
            <div v-if="nplayers == 1" class="col-12 m-1 pt-5 pb-5 text-center back rounded shadow">
              <h3>waiting for other players</h3>
              <p>Your room ID is {{ room.id }}</p>
            </div>

            <div class="col-md-6 col-lg-4">
              <div v-if="userleft" class="mb-2 text-center rounded shadow"
                v-bind:class="{ turn: userleft.username === getUsername(currentTurnIdx), back: !(userleft.username === getUsername(currentTurnIdx)), 'py-5': ! playing && ! gameOver }">
                <h3 id="name_p1">{{ userleft.username }}</h3>
                <p v-if="playing || gameOver">
                  <img v-if="userleft.currentCard === '?'" class="w-75 img-thumbnail shadow" src="@/assets/PrairieDogCards/？.jpg"/>
                  <img v-else class="w-75 img-thumbnail shadow" v-bind:src="require('@/assets/PrairieDogCards/' + userleft.currentCard + '.jpg')"/>
                </p>
                <p class="mt-3">ダメージ：{{ userleft.damage }}</p>
              </div>
            </div>

            <div class="col-md-6 col-lg-4">
              <div v-if="usertop" class="mb-2 text-center rounded shadow"
                v-bind:class="{ turn: usertop.username === getUsername(currentTurnIdx), back: !(usertop.username === getUsername(currentTurnIdx)), 'py-5': ! playing && ! gameOver }">
                <h3 id="name_p2">{{ usertop.username }}</h3>
                <p v-if="playing || gameOver">
                  <img v-if="usertop.currentCard === '?'" class="w-75 img-thumbnail shadow" src="@/assets/PrairieDogCards/？.jpg"/>
                  <img v-else class="w-75 img-thumbnail shadow" v-bind:src="require('@/assets/PrairieDogCards/' + usertop.currentCard + '.jpg')"/>
                </p>
                <p class="mt-3">ダメージ：{{ usertop.damage }}</p>
              </div>
            </div>

            <div class="col-md-6 col-lg-4">
              <div v-if="userright" class="mb-2 text-center rounded shadow"
                v-bind:class="{ turn: userright.username === getUsername(currentTurnIdx), back: !(userright.username === getUsername(currentTurnIdx)), 'py-5': ! playing && ! gameOver }">
                <h3 id="name_p3">{{ userright.username }}</h3>
                <p v-if="playing || gameOver">
                  <img v-if="userright.currentCard === '?'" class="w-75 img-thumbnail shadow" src="@/assets/PrairieDogCards/？.jpg"/>
                  <img v-else class="w-75 img-thumbnail shadow" v-bind:src="require('@/assets/PrairieDogCards/' + userright.currentCard + '.jpg')"/>
                </p>
                <p class="mt-3">ダメージ：{{ userright.damage }}</p>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="offset-xl-2 col-xl-8 mb-3">
              <div class="border text-center centerboard text-dark shadow">
                <div class="card-body" style="height: 10rem;">
                  <h3 class="card-title">最後の数字宣言</h3>
                  <hr>
                  <h5 v-if="lastNum == undefined" class="card-text">まだ宣言されていません</h5>
                  <h1 v-else class="card-text">{{ lastNum }}</h1>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="d-xl-none w-1oo py-3 col-lg-4">
              <b-button v-b-modal.modal-scrollable class="w-100 py-5" style="font-size: 20px;" variant="secondary">残りカード表示</b-button>

              <b-modal id="modal-scrollable" scrollable title="残りカード" ok-only ok-title="Close" ok-variant="secondary">
                <div class="row">
                  <div v-for="index in 14" :key="index"
                    v-bind:class="{ 'col-6': previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0 }">
                    <div v-if="previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0" class="row">
                      <div class="col-9">
                        <img v-if="previousCardsLeft[index - 1].type === '?'" class="w-100 img-thumbnail shadow" src="@/assets/PrairieDogCards/？.jpg"/>
                        <img v-else class="w-100 img-thumbnail shadow" v-bind:src="require('@/assets/PrairieDogCards/' + previousCardsLeft[index - 1].type + '.jpg')"/>
                      </div>
                      <h4 class="my-auto col-3 d-flex justify-content-end">×{{ previousCardsLeft[index - 1].cardsLeft }}</h4>
                    </div>
                  </div>
                </div>
              </b-modal>
            </div>

            <div class="offset-xl-4 col-lg-4 text-center rounded shadow"
              v-bind:class="{ turn: me.username === getUsername(currentTurnIdx), back: ! (me.username === getUsername(currentTurnIdx)), 'py-5': ! playing && ! gameOver}">
              <h3>{{ me.username }}</h3>
              <p v-if="!isPrairieDogCalled && playing"><img class="w-75 img-thumbnail shadow" src="@/assets/PrairieDogCards/card.jpg"/></p>
              <p v-if="isPrairieDogCalled">
                <img v-if="getMyCard() === '?'" class="w-75 img-thumbnail shadow" src="@/assets/PrairieDogCards/？.jpg"/>
                <img v-else class="w-75 img-thumbnail shadow" v-bind:src="require('@/assets/PrairieDogCards/' + getMyCard() + '.jpg')"/>
              </p>
              <p class="mt-3">ダメージ：{{ getMyDamage() }}</p>
            </div>

            <div v-if="me.role == 'host'"
              class="col-lg-4 text-center mback rounded shadow">
              <h3 class="text-white">GAME MENU</h3>
              <button @click="gameStart" :disabled="nplayers == 1 || playing || loading" type="button" class="btn btn-primary mb-2 w-75" style="height: 4rem">
                <span v-if="loading === false">GAME START</span>
                <span v-else>
                  <b-spinner small type="grow"></b-spinner>
                  Loading...
                </span>
              </button><br>
              <button @click="nextRound" type="button" class="btn btn-success mb-2 w-75" style="height: 4rem"
                :disabled="! isPrairieDogCalled || gameOver">
                NEXT ROUND
              </button><br>
              <button @click="destroyRoom" type="button" class="btn btn-danger w-75 mt-3" style="height: 3rem">
                部屋解散
              </button>
            </div>
          </div>
        </div>
      </main>

      <aside class="col-lg-3 d-flex px-1" style="height: 100vh;">
        <div class="card w-100">
          <div class="card-header">
            <b style="font-size: 20px;">Game Logs</b>
          </div>
          <div class="card-body" style="height: 30rem; overflow: auto; position: relative;">
            <span class="d-flex-fill" style="position: absolute; bottom: 0;">
              <p v-for="(event, index) in events" :key="index" class="mb-2">
                <span v-if="event.author == undefined" class="text-info"><b>SYSTEM</b> : {{ event.action }}</span>
                <span v-else-if="event.author === 'SYSTEM_TOTAL'" class="text-primary"><b>TOTAL</b> : {{ event.action }}</span>
                <span v-else-if="event.author === 'SYSTEM_RANKINGS'" class="text-muted"><b>{{ event.action }}</b></span>
                <span v-else><b>{{ event.author }}</b> : {{ event.action }}</span>
              </p>
            </span>
          </div>
          <div class="card-footer bg-dark text-white">
            <form class="input-group" @submit.prevent="call">
              <input v-model="attempt" type="number" class="form-control" :disabled="myIndexInRoom != currentTurnIdx || isPrairieDogCalled">
              <div class="input-group-append">
                <input type="submit" value="数字宣言" class="btn btn-primary" :disabled="attempt.length == 0">
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
      attempt: '',
      loading: false
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

    gameStart () {
      this.$store.dispatch('resetCards')
      this.loading = true
      setTimeout(() => { this.$store.dispatch('preprocessing', this.cardsLeft) }, 1000)
      setTimeout(() => { this.loading = false }, 1100)
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
    //TODO: check if roomId is in localstorage here
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
