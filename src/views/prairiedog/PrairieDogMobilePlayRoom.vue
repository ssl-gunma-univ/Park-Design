<template>
<div class="container-fluid p-0">
  <div class="gameboard w-100 mb-5">
    <div class="border text-center centerboard text-dark">
      <div class="clearfix p-2">
        <h5 class="float-left m-0"><b>最後の数字宣言：</b></h5>
        <span v-if="lastNum == undefined" class="float-right m-0">---</span>
        <h5 v-else class="float-right m-0">{{ lastNum }}</h5>
      </div>
    </div>
    <div v-if="nplayers == 1" class="text-center back rounded">
      <table class="w-100" style="height: 100%;">
        <tbody>
          <tr>
            <td>
              <span class="align-middle">
                <h4>Waiting for other players</h4>
                <span>Secret word is {{ secret_word }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="userleft" class="text-center p-0"
      v-bind:class="{ turn: userleft.username === getUsername(currentTurnIdx), back: !(userleft.username === getUsername(currentTurnIdx))}">
      <div class="row w-100 m-0">
        <div class="col-8 p-0">
          <table class="w-100" style="height: 100%;">
            <tbody>
              <tr>
                <td>
                  <span class="align-middle">
                    <h4>{{ userleft.username }}</h4>
                    <span style="font-size: 13px;"
                      v-if="userleft.damage !== undefined">ダメージ：{{ userleft.damage }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-4 p-0">
          <span v-if="playing || gameOver">
            <img v-if="userleft.currentCard === undefined" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/card.jpg">
            <img v-else-if="userleft.currentCard === '?'" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/？.jpg">
            <img v-else class="w-100 img-thumbnail"
              v-bind:src="require('@/assets/PrairieDogCards/' + userleft.currentCard + '.jpg')">
          </span>
          <span v-else>
            <img v-if="userleft.currentCard === undefined" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/card.jpg">
          </span>
        </div>
      </div>
    </div>

    <div v-if="usertop" class="text-center p-0"
      v-bind:class="{ turn: usertop.username === getUsername(currentTurnIdx), back: !(usertop.username === getUsername(currentTurnIdx))}">
      <div class="row w-100 m-0">
        <div class="col-8 p-0">
          <table class="w-100" style="height: 100%;">
            <tbody>
              <tr>
                <td>
                  <span class="align-middle">
                    <h4>{{ usertop.username }}</h4>
                    <span style="font-size: 13px;" v-if="usertop.damage !== undefined">ダメージ：{{ usertop.damage }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-4 p-0">
          <span v-if="playing || gameOver">
            <img v-if="usertop.currentCard === undefined" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/card.jpg">
            <img v-else-if="usertop.currentCard === '?'" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/？.jpg">
            <img v-else class="w-100 img-thumbnail"
              v-bind:src="require('@/assets/PrairieDogCards/' + usertop.currentCard + '.jpg')">
          </span>
          <span v-else>
            <img v-if="usertop.currentCard === undefined" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/card.jpg">
          </span>
        </div>
      </div>
    </div>

    <div v-if="userright" class="text-center p-0"
      v-bind:class="{ turn: userright.username === getUsername(currentTurnIdx), back: !(userright.username === getUsername(currentTurnIdx))}">
      <div class="row w-100 m-0">
        <div class="col-8 p-0">
          <table class="w-100" style="height: 100%;">
            <tbody>
              <tr>
                <td>
                  <span class="align-middle">
                    <h4>{{ userright.username }}</h4>
                    <span style="font-size: 13px;"
                      v-if="userright.damage !== undefined">ダメージ：{{ userright.damage }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-4 p-0">
          <span v-if="playing || gameOver">
            <img v-if="userright.currentCard === undefined" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/card.jpg">
            <img v-else-if="userright.currentCard === '?'" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/？.jpg">
            <img v-else class="w-100 img-thumbnail"
              v-bind:src="require('@/assets/PrairieDogCards/' + userright.currentCard + '.jpg')">
          </span>
          <span v-else>
            <img v-if="userright.currentCard === undefined" class="w-100 img-thumbnail"
              src="@/assets/PrairieDogCards/card.jpg">
          </span>
        </div>
      </div>
    </div>

    <div class="text-center p-0 rounded"
      v-bind:class="{ turn: me.username === getUsername(currentTurnIdx), back: ! (me.username === getUsername(currentTurnIdx))}">
      <div class="row w-100 m-0">
        <div class="col-8 p-0">
          <table class="w-100" style="height: 100%;">
            <tbody>
              <tr>
                <td>
                  <span class="align-middle">
                    <h4>{{ me.username }}</h4>
                    <span style="font-size: 13px;">ダメージ：{{ getMyDamage() }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-4 p-0">
          <span v-if="! isPrairieDogCalled && playing">
            <img class="w-100 img-thumbnail" src="@/assets/PrairieDogCards/card.jpg">
          </span>
          <span v-if="! playing && ! gameOver">
            <img class="w-100 img-thumbnail" src="@/assets/PrairieDogCards/card.jpg">
          </span>
          <span v-if="isPrairieDogCalled">
            <img v-if="getMyCard() === undefined" src="@/assets/PrairieDogCards/card.jpg">
            <img v-else-if="getMyCard() === '?'" class="w-100 img-thumbnail" src="@/assets/PrairieDogCards/？.jpg">
            <img v-else class="w-100 img-thumbnail"
              v-bind:src="require('@/assets/PrairieDogCards/' + getMyCard() + '.jpg')">
          </span>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center px-3 pt-3">
      <button type="button" class="btn btn-warning" @click="callPrairieDog"
        :disabled="myIndexInRoom != currentTurnIdx || lastNum == undefined || isPrairieDogCalled">プレーリードッグ！</button>
    </div>

    <form class="input-group p-3" @submit.prevent="call">
      <input v-model="attempt" type="number" class="form-control"
        :disabled="myIndexInRoom != currentTurnIdx || isPrairieDogCalled">
      <div class="input-group-append">
        <input type="submit" value="数字宣言" class="btn btn-primary" :disabled="attempt.length == 0">
      </div>
    </form>




    <div v-if="me.role == 'host'" class="text-center mback pb-4">
      <h4 class="text-white">GAME MENU</h4>
      <button @click="gameStart" :disabled="nplayers == 1 || playing || loading" type="button"
        class="btn btn-primary mb-2 w-75" style="height: 3rem">
        <span v-if="loading === false">GAME START</span>
        <span v-else>
          <b-spinner small type="grow"></b-spinner>Loading...
        </span>
      </button>
      <br>
      <button @click="nextRound" type="button" class="btn btn-success mb-2 w-75" style="height: 3rem"
        :disabled="! isPrairieDogCalled || gameOver">NEXT ROUND</button>
      <br>
      <button @click="destroyRoom" type="button" class="btn btn-danger w-75 mt-3" style="height: 3rem">部屋解散</button>
    </div>
  </div>

  <div class="fixed-bottom bg-dark">
    <div class="row">
      <div class="col-4 border border-secondary p-0">
        <b-button v-b-modal.rules variant="dark" class="w-100 pr-0">
          <i class="fas fa-book" style="font-size: 25px;"></i>
          <div style="font-size: 5px;">ルール</div>
        </b-button>

        <b-modal id="rules" scrollable title="ルール" ok-only ok-title="Close" ok-variant="secondary">

          <div role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block href="#" v-b-toggle.accordion-0 variant="info">概要</b-button>
              </b-card-header>
              <b-collapse id="accordion-0" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text style="text-indent: 1em;">
                    「プレーリードッグ」は，ハッタリと推理が勝負のカギを握る，心理戦ボードゲームです．
                  </b-card-text>
                  <b-card-text style="text-indent: 1em;">
                    『場に出ている数字の合計値を予想する』ゲームですが，その一番の特徴は『自分の数字だけ見えない』ということです．
                  </b-card-text>
                  <b-card-text style="text-indent: 1em;">
                    つまり「相手の見えている数字」と「自分の見えない数字」があり，その合計の数を推理します．
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block href="#" v-b-toggle.accordion-2 variant="info">手順</b-button>
              </b-card-header>
              <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <ol class="pl-3 mb-0">
                    <li>数字や記号の書かれたカードが山札からプレイヤーに配られる</li>
                    <li>このとき，各々は自分のカードを見ることができない</li>
                    <li>ランダムに選ばれたプレイヤーからゲームがスタートする</li>
                    <li>最初のプレイヤーは，自分以外の場のカードを見て，見えない自分のカードを考慮し，場のカードの合計値より少ないであろう数字を宣言する</li>
                    <li>次のプレイヤーは，前のプレイヤーより大きい数字を宣言するか，前のプレイヤーの宣言した数字がすでに場のカードの合計値を超えたと思ったら，「プレーリードッグ」宣言をする</li>
                    <li>数字を宣言した場合はゲームが続行し，次のプレイヤーのターンとなる</li>
                    <li>
                      「プレーリードッグ」宣言をした場合，全員が各々のカードを見ることができ，前のプレイヤーの宣言した数字が場のカードの合計値より大きかったらそのプレイヤーにダメージを与え，小さかったら「プレーリードッグ」宣言をしたプレイヤーにダメージが与えられる
                    </li>
                    <li>ゲームは山札の枚数がプレイヤーの人数未満になったときに終了し，その時点で受けたダメージの少ないプレイヤーから順に強いということになる</li>
                  </ol>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block href="#" v-b-toggle.accordion-1 variant="info">カードの種類</b-button>
              </b-card-header>
              <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text style="text-indent: 1em;">カードは14種類存在し，それぞれ枚数が決まっています．山札は合計で36枚になります．</b-card-text>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">-10</p>
                    <p class="mt-3">1枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">-5</p>
                    <p class="mt-3">2枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">0</p>
                    <p class="mt-3">4枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">1</p>
                    <p class="mt-3">4枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">2</p>
                    <p class="mt-3">4枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">3</p>
                    <p class="mt-3">4枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">4</p>
                    <p class="mt-3">4枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">5</p>
                    <p class="mt-3">4枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">10</p>
                    <p class="mt-3">3枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">15</p>
                    <p class="mt-3">2枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">20</p>
                    <p class="mt-3">1枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">×2</p>
                    <p class="mt-3">1枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">MAX → 0</p>
                    <p class="mt-3">1枚</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <p class="mt-3">?</p>
                    <p class="mt-3">1枚</p>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block href="#" v-b-toggle.accordion-3 variant="info">特殊カード</b-button>
              </b-card-header>
              <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text style="text-indent: 1em;">
                    これらのカードのうち，特殊な働きをするカードが3種類あります．「×2」「MAX → 0」「?」です．それぞれの効果は以下の通りです．
                  </b-card-text>
                  <table class="table table-striped border">
                    <thead>
                      <tr>
                        <th scope="col">×2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>場のカードの合計値を2倍する</td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="table table-striped border">
                    <thead>
                      <tr>
                        <th scope="col">MAX → 0</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>場のカードのうち，最も大きい値を持つカード1枚を0とする</td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="table table-striped border">
                    <thead>
                      <tr>
                        <th scope="col">?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>「プレーリードッグ」宣言後，山札から1枚引き，そのカードと置き換わる<br>山札が0枚の場合は0となる</td>
                      </tr>
                    </tbody>
                  </table>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block href="#" v-b-toggle.accordion-4 variant="info">元ネタ</b-button>
              </b-card-header>
              <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text style="text-indent: 1em;">プレーリードッグの元となったゲームはSpartaco Albertarelliさん考案のCoyoteというゲームです．</b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-modal>
      </div>
      <div class="col-4 border border-secondary p-0">
        <b-button v-b-modal.cards variant="dark" class="w-100">
          <i class="fas fa-th" style="font-size: 25px;"></i>
          <div style="font-size: 5px;">残りカード</div>
        </b-button>

        <b-modal id="cards" scrollable title="残りカード" ok-only ok-title="Close" ok-variant="secondary">
          <div class="row">
            <div v-for="index in 14" :key="index"
              v-bind:class="{ 'col-6': previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0 }">
              <div
                v-if="previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0"
                class="row">
                <div class="col-9">
                  <img v-if="previousCardsLeft[index - 1].type === '?'" class="w-100 img-thumbnail shadow"
                    src="@/assets/PrairieDogCards/？.jpg">
                  <img v-else class="w-100 img-thumbnail shadow"
                    v-bind:src="require('@/assets/PrairieDogCards/' + previousCardsLeft[index - 1].type + '.jpg')">
                </div>
                <h4 class="my-auto col-3 d-flex justify-content-end">×{{ previousCardsLeft[index - 1].cardsLeft }}</h4>
              </div>
            </div>
          </div>
        </b-modal>
      </div>
      <div class="col-4 border border-secondary p-0">
        <b-button v-b-modal.logs variant="dark" class="w-100 pl-0">
          <i class="fas fa-comments" style="font-size: 25px;"></i>
          <div style="font-size: 5px;">チャット・ログ</div>
        </b-button>

        <b-modal id="logs" scrollable title="ログ" ok-only centered ok-title="Close" ok-variant="secondary">
          <div style="height: 59vh; overflow: auto; position: relative;">
            <span class="d-flex-fill" style="position: absolute; bottom: 0; width: 100%;">
              <div v-for="(message,index) in messages" :key="index" class="mb-2">
                <div class="clearfix">

                  <span v-if="message.username === 'SYSTEM_ADMINISTRATOR'" class="text-info">
                    <b>SYSTEM</b>
                    : {{ message.message }}
                  </span>
                  <span v-else-if="message.username === 'SYSTEM_SUCCESS'" class="text-primary">
                    <b>{{ message.message }}</b>
                  </span>
                  <span v-else-if="message.username === 'SYSTEM_FAILURE'" class="text-danger">
                    <b>{{ message.message }}</b>
                  </span>
                  <span v-else-if="message.username === 'SYSTEM_RANKINGS'" class="text-muted">
                    <b>{{ message.message }}</b>
                  </span>
                  <span v-else>
                    <b>{{message.username}}</b>
                    : {{message.message}}
                  </span>

                  <small class="text-muted float-right">({{displayTime(message)}})</small>

                </div>
              </div>
            </span>
          </div>

          <div class="type_msg">
            <div class="input_msg_write">
              <input @keyup.enter="saveMessage" v-model="message" type="text" class="write_msg px-2"
                placeholder="Type a message...">
              <button class="msg_send_btn" type="button" @click="saveMessage">
                <i class="far fa-paper-plane" style="padding-right: 2px;" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { db } from '@/main'

export default {
  data () {
    return {
      attempt: '',
      loading: false,
      // comments: [],
      message: '',
      messages: [],
      roomid: '',
      secret_word: ''
      // roombroke: false
    }
  },

  watch: {
    // この関数は question が変わるごとに実行されます。
    roombroke: function (newQuestion, oldQuestion) {
      // this.answer = 'Waiting for you to stop typing...'
      this.doquitroom()
      if (this.roombroke != true) {
        this.fetchMessage()
      }
    }
  },

  /*   firestore() {

    return {
      // firestoreのcommentsコレクションを参照
      comments: db.collection("rooms").doc(`${this.roomid}`).collection("chat").orderBy("createdAt")
    };
     */
  /* firestore: {
      // firestoreのcommentsコレクションを参照
            comments: db.collection("rooms").doc("Yd3ezooQdDjkgfFBGmq4").collection("chat").orderBy("createdAt")
  }, */

  computed: {
    ...mapState(['me', 'room', 'cardsType']),
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
      'events',
      /*  */
      'roombroke'
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
      if (this.room.users[this.myIndexInRoom] !== undefined && this.room.users[this.myIndexInRoom].damage !== undefined) {
        return this.room.users[this.myIndexInRoom].damage
      }
    },

    call () {
      if (parseInt(this.attempt) <= parseInt(this.lastNum)) {
        const jsFrame = new JSFrame();
        jsFrame.showToast({
          width: 260, //幅
          height: 100, //高さ
          duration: 2000, //表示時間(millis)
          align: "center", // 表示位置 'top'/'center'/'bottom'(default)
          style: {
            borderRadius: "2px",
            backgroundColor: "rgba(255,0,0,0.9)"
          },
          html:
            '<span style="color:white;">数字宣言は前のプレイヤーよりも大きい数字で行ってください！</span>',
          closeButton: true, //閉じるボタンを表示
          closeButtonColor: "white" //閉じるボタンの色
        })
        return
      }

      this.$store.dispatch('call', {
        attempt: parseInt(this.attempt),
        username: this.room.users[this.myIndexInRoom].username
      })

      // reset the textbox after called
      this.attempt = ''
    },

    callPrairieDog () {
      this.attempt = ''
      this.$store.dispatch(
        'callPrairieDog',
        this.room.users[this.myIndexInRoom].username
      )
    },

    gameStart () {
      this.$store.dispatch('resetCards')
      this.loading = true
      setTimeout(() => {
        this.$store.dispatch('preprocessing', this.cardsLeft)
      }, 1000)
      setTimeout(() => {
        this.loading = false
      }, 1100)
    },

    destroyRoom () {
      console.log('the room has been removed')
      // this.room.roombroke = true;
      this.$store.dispatch('brokeRoom')
      // this.roombroke = this.room.roombroke;
      // this.doquitroom();
      this.$store.dispatch('destroyRoom')
    },

    nextRound () {
      this.$store.dispatch('nextRound')
    },

    resetCards () {
      /* method called only by user with role `host` */
      this.$store.dispatch('resetCards')
    },

    saveMessage () {
      // save to firestore
      if (this.message.length != 0 && !this.roombroke) {
        /* this.$firestoreRefs.chat.add({
          message: this.message,
          createdAt: new Date(),
          username: this.me.username
        }); */

        db.collection('rooms')
          .doc(`${this.roomid}`)
          .collection('chat')
          .add({
            message: this.message,
            createdAtJapan: new Date(),
            createdAt: this.timestamp(),
            username: this.me.username
          })
          .then(function (docRef) {
            // console.log("Document written with ID: ", docRef.id);
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
        this.message = ''
      }

      // db.collection("chat")
      //   .doc("this.docid[0]")
      //   .delete().then(() => {console.log("Successed!")});
      // this.$firestoreRefs.cities.doc(this.docid).delete();
      // this.$firestoreRefs.selectedCity.delete();
    },

    fetchMessage () {
      db.collection('rooms')
        .doc(`${this.roomid}`)
        .collection('chat')
        .orderBy('createdAt')
        /* .get()
        .then(querySnapshot => {      //realtime */
        .onSnapshot(querySnapshot => {
          /* realtime */
          let allMessages = []
          // let allDocid = [];
          querySnapshot.forEach(doc => {
            allMessages.push(doc.data())
            // allDocid.push(doc.id);
            console.log(`${doc.id} => ${doc.data()}`)
            // this.allDocid = `${doc.id}`
          })
          // querySnapshot.forEach(doc => {
          //   allDocid.push(doc.id);

          // });

          // this.docid = allDocid;
          this.messages = allMessages
          // console.log(this.docid[3]);
        })
    },

    getroomid () {
      this.roomid = this.$route.params.roomId
      // this.roomid = this.room.id;
    },

    displayTime: function (message) {
      let timestamp = message.createdAt * 1000
      var date = new Date(timestamp)
      var diff = new Date().getTime() - date.getTime()
      var d = new Date(diff)

      if (d.getUTCFullYear() - 1970) {
        // return d.getUTCFullYear() - 1970 + "年前";
        return '1秒前'
      } else if (d.getUTCMonth()) {
        return d.getUTCMonth() + 'ヶ月前'
      } else if (d.getUTCDate() - 1) {
        return d.getUTCDate() - 1 + '日前'
      } else if (d.getUTCHours()) {
        return d.getUTCHours() + '時間前'
      } else if (d.getUTCMinutes()) {
        return d.getUTCMinutes() + '分前'
      } else {
        return d.getUTCSeconds() + '秒前'
      }
    },

    timestamp: function () {
      let date = new Date()
      let timestamp = date.getTime()
      return Math.floor(timestamp / 1000)
    },

    doquitroom () {
      if (this.roombroke == true) {
        console.log('doQuitRoom was executed')
        // alert('部屋が解散されました。')
        // alert('See you late. The room has been removed by host.')

        const jsFrame2 = new JSFrame();

        jsFrame2.showToast({
          width: 260, //幅
          height: 100, //高さ
          duration: 5000, //表示時間(millis)
          align: "center", // 表示位置 'top'/'center'/'bottom'(default)
          style: {
            borderRadius: "2px",
            // backgroundColor: "rgba(0,124,255,0.8)"
            backgroundColor: "rgba(255,0,0,0.8)"
          },
          html:
            '<span style="color:white;">See you late. The room has been removed by host.</span>',
          closeButton: true, //閉じるボタンを表示
          closeButtonColor: "white" //閉じるボタンの色
        });
        history.back(-1)
        // location.reload();
      }
    },

    search_room: function() {
      
      db.collection('lists')
      .doc('rooms')
      .collection('list')
      .where("Room_ID", "==", `${this.room.id}` )
      .orderBy('createdAt','desc')
      .limit(1)
      .get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          // room_id.push(doc.data().Room_ID)
          console.log(doc.data().secret_word)
          this.secret_word=doc.data().secret_word
        })
      })
      
    }
  },

  created () {
    // TODO: check if roomId is in localstorage here
    // console.log("created");
    this.$store.dispatch('watchRoom', this.$route.params.roomId)
    this.getroomid()
    if (this.roombroke != true) {
      this.fetchMessage()
    }
    if (this.nplayers ==1){
      this.search_room()
    }
  },

  mounted () {
    console.log('mounted')
    // if (this.roombroke != true) {
    // this.fetchMessage();
    // }
    document.onscroll = e => {
      this.position =
        document.documentElement.scrollTop || document.body.scrollTop
    }
  }

  // updated() {
  // this.roombroke = this.room.roombroke;
  //   // console.log("updated");
  //   // this.doquitroom();
  // },

  // beforeUpdate() {}
}
</script>

<style>
.gameboard {
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#d2dfed+0,a6c0e3+0,afc7e8+14,afc7e8+14,c8d7eb+35,bad0ef+66,99b5db+88,799bc8+100 */
  background: #d2dfed; /* Old browsers */
  background: -moz-linear-gradient(
    top,
    #d2dfed 0%,
    #a6c0e3 0%,
    #afc7e8 14%,
    #afc7e8 14%,
    #c8d7eb 35%,
    #bad0ef 66%,
    #99b5db 88%,
    #799bc8 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    #d2dfed 0%,
    #a6c0e3 0%,
    #afc7e8 14%,
    #afc7e8 14%,
    #c8d7eb 35%,
    #bad0ef 66%,
    #99b5db 88%,
    #799bc8 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #d2dfed 0%,
    #a6c0e3 0%,
    #afc7e8 14%,
    #afc7e8 14%,
    #c8d7eb 35%,
    #bad0ef 66%,
    #99b5db 88%,
    #799bc8 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#d2dfed', endColorstr='#799bc8',GradientType=0 ); /* IE6-9 */
}

.centerboard {
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#b0d4e3+0,88bacf+100;Grey+3D+%233 */
  background: rgb(176, 212, 227); /* Old browsers */
  background: -moz-linear-gradient(
    top,
    rgba(176, 212, 227, 1) 0%,
    rgba(136, 186, 207, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    rgba(176, 212, 227, 1) 0%,
    rgba(136, 186, 207, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(176, 212, 227, 1) 0%,
    rgba(136, 186, 207, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b0d4e3', endColorstr='#88bacf',GradientType=0 ); /* IE6-9 */
}

.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}

.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  /* right: 0; */
  right: 2%;
  top: 8px;
  /* width: 33px; */
  width: 33px;
}
</style>
