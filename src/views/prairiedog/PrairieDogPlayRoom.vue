<template>
  <div class="container-fluid">
    <div class="row">
      <aside
        class="col-lg-12 col-xl-2 rouded shadow text-white d-none d-xl-block"
        :style="{'background-image': 'url(' + require('@/assets/Images/wood-oil-bk.jpg') + ')', 'height': '100vh', 'overflow': 'auto'}"
      >
        <h3>残りカード</h3>
        <hr class="border border-white">
        <div class="row">
          <div v-for="index in 14" :key="index" class="col-6 col-md-4 col-lg-3 col-xl-12">
            <div
              v-if="previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0"
              class="row"
            >
              <div class="col-9">
                <img
                  v-if="previousCardsLeft[index - 1].type === undefined"
                  src="@/assets/PrairieDogCards/card.jpg"
                >
                <img
                  v-else-if="previousCardsLeft[index - 1].type === '?'"
                  class="w-100 img-thumbnail shadow"
                  src="@/assets/PrairieDogCards/？.jpg"
                >
                <img
                  v-else
                  class="w-100 img-thumbnail shadow"
                  v-bind:src="require('@/assets/PrairieDogCards/' + previousCardsLeft[index - 1].type + '.jpg')"
                >
              </div>
              <h4
                class="my-auto col-3 d-flex justify-content-end"
              >×{{ previousCardsLeft[index - 1].cardsLeft }}</h4>
            </div>
          </div>
        </div>
      </aside>

      <main class="col-lg-9 col-xl-7 px-2">
        <div class="gameboard p-4 rounded shadow border">
          <div class="row mb-2">
            <div v-if="nplayers == 1" class="col-12 m-1 pt-5 pb-5 text-center back rounded shadow">
              <h3>waiting for other players</h3>
              <!-- <p>Your room ID is {{ room.id }}</p> -->
              <p>Secret word is {{ secret_word }}</p>
            </div>

            <div class="col-md-6 col-lg-4">
              <div
                v-if="userleft"
                class="mb-2 text-center rounded shadow"
                v-bind:class="{ turn: userleft.username === getUsername(currentTurnIdx), back: !(userleft.username === getUsername(currentTurnIdx)), 'py-5': ! playing && ! gameOver }"
              >
                <h3 id="name_p1">{{ userleft.username }}</h3>
                <p v-if="playing || gameOver">
                  <img
                    v-if="userleft.currentCard === undefined"
                    src="@/assets/PrairieDogCards/card.jpg"
                  >
                  <img
                    v-else-if="userleft.currentCard === '?'"
                    class="w-75 img-thumbnail shadow"
                    src="@/assets/PrairieDogCards/？.jpg"
                  >
                  <img
                    v-else
                    class="w-75 img-thumbnail shadow"
                    v-bind:src="require('@/assets/PrairieDogCards/' + userleft.currentCard + '.jpg')"
                  >
                </p>
                <p v-if="userleft.damage !== undefined" class="mt-3">ダメージ：{{ userleft.damage }}</p>
              </div>
            </div>

            <div class="col-md-6 col-lg-4">
              <div
                v-if="usertop"
                class="mb-2 text-center rounded shadow"
                v-bind:class="{ turn: usertop.username === getUsername(currentTurnIdx), back: !(usertop.username === getUsername(currentTurnIdx)), 'py-5': ! playing && ! gameOver }"
              >
                <h3 id="name_p2">{{ usertop.username }}</h3>
                <p v-if="playing || gameOver">
                  <img
                    v-if="usertop.currentCard === undefined"
                    src="@/assets/PrairieDogCards/card.jpg"
                  >
                  <img
                    v-else-if="usertop.currentCard === '?'"
                    class="w-75 img-thumbnail shadow"
                    src="@/assets/PrairieDogCards/？.jpg"
                  >
                  <img
                    v-else
                    class="w-75 img-thumbnail shadow"
                    v-bind:src="require('@/assets/PrairieDogCards/' + usertop.currentCard + '.jpg')"
                  >
                </p>
                <p v-if="usertop.damage !== undefined" class="mt-3">ダメージ：{{ usertop.damage }}</p>
              </div>
            </div>

            <div class="col-md-6 col-lg-4">
              <div
                v-if="userright"
                class="mb-2 text-center rounded shadow"
                v-bind:class="{ turn: userright.username === getUsername(currentTurnIdx), back: !(userright.username === getUsername(currentTurnIdx)), 'py-5': ! playing && ! gameOver }"
              >
                <h3 id="name_p3">{{ userright.username }}</h3>
                <p v-if="playing || gameOver">
                  <img
                    v-if="userright.currentCard === undefined"
                    src="@/assets/PrairieDogCards/card.jpg"
                  >
                  <img
                    v-else-if="userright.currentCard === '?'"
                    class="w-75 img-thumbnail shadow"
                    src="@/assets/PrairieDogCards/？.jpg"
                  >
                  <img
                    v-else
                    class="w-75 img-thumbnail shadow"
                    v-bind:src="require('@/assets/PrairieDogCards/' + userright.currentCard + '.jpg')"
                  >
                </p>
                <p v-if="userright.damage !== undefined" class="mt-3">ダメージ：{{ userright.damage }}</p>
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
              <b-button
                v-b-modal.modal-scrollable
                class="w-100 py-5"
                style="font-size: 20px;"
                variant="secondary"
              >残りカード表示</b-button>

              <b-modal
                id="modal-scrollable"
                scrollable
                title="残りカード"
                ok-only
                ok-title="Close"
                ok-variant="secondary"
              >
                <div class="row">
                  <div
                    v-for="index in 14"
                    :key="index"
                    v-bind:class="{ 'col-6': previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0 }"
                  >
                    <div
                      v-if="previousCardsLeft != undefined && previousCardsLeft[index - 1] != undefined && previousCardsLeft[index - 1].cardsLeft != 0"
                      class="row"
                    >
                      <div class="col-9">
                        <img
                          v-if="previousCardsLeft[index - 1].type === '?'"
                          class="w-100 img-thumbnail shadow"
                          src="@/assets/PrairieDogCards/？.jpg"
                        >
                        <img
                          v-else
                          class="w-100 img-thumbnail shadow"
                          v-bind:src="require('@/assets/PrairieDogCards/' + previousCardsLeft[index - 1].type + '.jpg')"
                        >
                      </div>
                      <h4
                        class="my-auto col-3 d-flex justify-content-end"
                      >×{{ previousCardsLeft[index - 1].cardsLeft }}</h4>
                    </div>
                  </div>
                </div>
              </b-modal>
            </div>

            <div
              class="offset-xl-4 col-lg-4 text-center rounded shadow"
              v-bind:class="{ turn: me.username === getUsername(currentTurnIdx), back: ! (me.username === getUsername(currentTurnIdx)), 'py-5': ! playing && ! gameOver}"
            >
              <h3>{{ me.username }}</h3>
              <p v-if="!isPrairieDogCalled && playing">
                <img class="w-75 img-thumbnail shadow" src="@/assets/PrairieDogCards/card.jpg">
              </p>
              <p v-if="isPrairieDogCalled">
                <img
                  v-if="getMyCard() === undefined"
                  src="@/assets/PrairieDogCards/card.jpg"
                >
                <img
                  v-else-if="getMyCard() === '?'"
                  class="w-75 img-thumbnail shadow"
                  src="@/assets/PrairieDogCards/？.jpg"
                >
                <img
                  v-else
                  class="w-75 img-thumbnail shadow"
                  v-bind:src="require('@/assets/PrairieDogCards/' + getMyCard() + '.jpg')"
                >
              </p>
              <p class="mt-3">ダメージ：{{ getMyDamage() }}</p>
            </div>

            <div v-if="me.role == 'host'" class="col-lg-4 text-center mback rounded shadow">
              <h3 class="text-white">GAME MENU</h3>
              <button
                @click="gameStart"
                :disabled="nplayers == 1 || playing || loading"
                type="button"
                class="btn btn-primary mb-2 w-75"
                style="height: 4rem"
              >
                <span v-if="loading === false">GAME START</span>
                <span v-else>
                  <b-spinner small type="grow"></b-spinner>Loading...
                </span>
              </button>
              <br>
              <button
                @click="nextRound"
                type="button"
                class="btn btn-success mb-2 w-75"
                style="height: 4rem"
                :disabled="! isPrairieDogCalled || gameOver"
              >NEXT ROUND</button>
              <br>
              <button
                @click="destroyRoom"
                type="button"
                class="btn btn-danger w-75 mt-3"
                style="height: 3rem"
              >部屋解散</button>
            </div>
          </div>
        </div>
      </main>

      <aside class="col-lg-3 d-flex px-1" style="height: 100vh; ">
        <div class="card w-100">
          <div class="card-header">
            <b style="font-size: 20px;">Logs</b>
          </div>

          <div class="card-body" style="height: 30rem; overflow: auto; position: relative;">
            <span class="d-flex-fill" style="position: absolute; bottom: 0; width:90%;">
              <div v-for="(message,index) in messages" :key="index" class="mb-2">
                <div class="clearfix">

                <span v-if="message.username === 'SYSTEM_ADMINISTRATOR'" class="text-info">
                    <b>SYSTEM</b>
                    : {{ message.message }}
                </span>
                <span v-else-if="message.username === 'SYSTEM_TOTAL'" class="text-primary">
                  <b>TOTAL</b>
                  : {{ message.message }}
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
              <input
                @keyup.enter="saveMessage"
                v-model="message"
                type="text"
                class="write_msg px-2"
                placeholder="Type a message..."
              >
              <button class="msg_send_btn" type="button" @click="saveMessage">
                <i class="far fa-paper-plane" style="padding-right: 2px;" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="card-footer bg-dark text-white">
            <form class="input-group" @submit.prevent="call">
              <input
                v-model="attempt"
                type="number"
                class="form-control"
                :disabled="myIndexInRoom != currentTurnIdx || isPrairieDogCalled"
              >
              <div class="input-group-append">
                <input
                  type="submit"
                  value="数字宣言"
                  class="btn btn-primary"
                  :disabled="attempt.length == 0"
                >
              </div>
            </form>

            <div class="d-flex flex-row-reverse">
              <button
                type="button"
                class="btn btn-warning mt-3"
                @click="callPrairieDog"
                :disabled="myIndexInRoom != currentTurnIdx || lastNum == undefined || isPrairieDogCalled"
              >プレーリードッグ！</button>
            </div>
          </div>
        </div>
      </aside>
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
        const jsFrame = new JSFrame()
        jsFrame.showToast({
          html: 'The number is upper than last called number.',
          duration: 2000
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
