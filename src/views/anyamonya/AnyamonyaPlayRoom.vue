<template>
<div>

<template v-if="this.roombroke === true">
<div>
  <h1 class="mb-4">An incorrect operation was performed.</h1>
      <a href="/"><h2>Go back to Home Page</h2></a>
</div>
</template>

<template v-else>
  <div
    class="row m-0"
    :style="{'background-image': 'url(' + require('@/assets/Images/green.jpg') + ')', 'height': '100vh', 'overflow': 'auto'}"
  >
    <main class="container-fluid offset-lg-2 col-lg-7 col-sm-8 bg-white border shadow-lg" style="height: 100vh;">
      <div class="border text-center p-2" style="box-shadow:0px 0px 10px -5px #61ee2d;">
        <img
          v-if="room.indexnum === -1"
          class="img-fluid my-2 mx-auto d-block monster"
          alt="image"
          src="@/assets/AnyamonyaCards/card.jpg"
          style="width: 300px;"
        />
        <img
          v-else
          class="img-fluid my-2 mx-auto d-block monster"
          alt="image"
          style="width: 300px;"
          :src='require("@/assets/AnyamonyaCards/" + cardType[room.indexnum] + ".png")'
        />
        <div v-if="room.isNextEnabled"><b style="font-size: 1.5rem;">名前 : {{ room.cardname }}</b></div>
        <div v-else style="font-size: 1.5rem;">名前 : ???</div>
        <div>積まれたカード : {{ room.stack }} 枚</div>
      </div>

      <div class="row my-3">
        <div class="col-4">
          <div
            v-if="room.isNextEnabled || (deck[room.indexnum] !== undefined && deck[room.indexnum].name !== '') || getUsername(room.currentTurnIdx) !== me.username"
          >
            <form class="input-group" @submit.prevent="saveMessage" v-if="! room.isKnownCard">
              <input
                class="form-control"
                v-model="message"
                type="text"
                placeholder="Type a message..."
              />
              <div class="input-group-append">
                <input
                  type="submit"
                  value="送信"
                  class="btn btn-primary"
                >
              </div>
            </form>
            <form class="input-group" @submit.prevent="typeName" v-else>
              <input
                class="form-control"
                v-model="message"
                type="text"
                placeholder="Type a name..."
              />
              <div class="input-group-append">
                <input
                  type="submit"
                  value="送信"
                  class="btn btn-primary"
                >
              </div>
            </form>
          </div>
          <div v-else>
            <form class="input-group" @submit.prevent="saveName">
              <input
                class="form-control"
                v-model="message"
                :disabled="room.isNextEnabled || (deck[room.indexnum] !== undefined && deck[room.indexnum].name !== '')"
                type="text"
                placeholder="Type a name..."
              />
              <div class="input-group-append">
                <input
                  type="submit"
                  value="命名"
                  class="btn btn-primary"
                  :disabled="room.isNextEnabled || (deck[room.indexnum] !== undefined && deck[room.indexnum].name !== '')"
                >
              </div>
            </form>
          </div>
        </div>

        <div class="col-4 d-flex justify-content-center">
          <span v-if="me.role === 'host'">
            <button
              class="btn btn-primary"
              @click="gameStart" 
              :disabled="playing || nplayers <= 1"
            >ゲーム開始</button>
          </span>
          <span v-if="me.role === 'host'">
            <button
              class="btn btn-danger ml-1"
              @click="destroyRoom"
              type="button"
            >部屋解散</button>
          </span>
        </div>

        <div class="col-4 d-flex justify-content-end">
          <button
            class="btn btn-success"
            @click="fornextimage"
            :disabled="! room.isNextEnabled || nextclicked || ! playing || getUsername(room.currentTurnIdx) !== me.username"
          >カードをめくる</button>
        </div>
      </div>

      <div class="overflow-auto border px-2 mb-2" style="flex-grow: 1;">
        <div v-for="(message,index) in messages" :key="index">
          <div>
            <span v-if="message.message === '正解！'" class="text-primary">
              <b>{{message.username}}</b>
              : {{message.message}}
            </span>
            <span v-else-if="message.username === 'システム'" class="text-info">
              <b>{{message.username}}</b>
              : {{message.message}}
            </span>
            <span v-else-if="message.message === 'joined!'" class="text-secondary">
              <b>{{message.username}}</b>
              : {{message.message}}
            </span>
            <span v-else class="text-dark">
              <b>{{message.username}}</b>
              : {{message.message}}
            </span>
            <small>({{displayTime(message)}})</small>
          </div>
        </div>
      </div>
    </main>

    <aside class="col-lg-3 col-sm-4 col-12">
      <div class="mb-2">
        <div
          v-if="me"
          class="p-2 text-center bg-white rounded shadow"
          v-bind:class="{ turn: me.username === getUsername(room.currentTurnIdx), back: !(me.username === getUsername(room.currentTurnIdx)) }"
        >
          <h3>{{ me.username }}</h3>
          <p v-if="me.have !== undefined" class="mt-3">所持：{{ me.have }}</p>
        </div>
      </div>

      <div class="mb-2">
        <div
          v-if="userleft"
          class="p-2 text-center bg-white rounded shadow"
          v-bind:class="{ turn: userleft.username === getUsername(room.currentTurnIdx), back: !(userleft.username === getUsername(room.currentTurnIdx)) }"
        >
          <h3>{{ userleft.username }}</h3>
          <p v-if="userleft.have !== undefined" class="mt-3">所持：{{ userleft.have }}</p>
        </div>
      </div>

      <div class="mb-2">
        <div
          v-if="usertop"
          class="p-2 text-center bg-white rounded shadow"
          v-bind:class="{ turn: usertop.username === getUsername(room.currentTurnIdx), back: !(usertop.username === getUsername(room.currentTurnIdx)) }"
        >
          <h3>{{ usertop.username }}</h3>
          <p v-if="usertop.have !== undefined" class="mt-3">所持：{{ usertop.have }}</p>
        </div>
      </div>

      <div class="mb-2">
        <div
          v-if="userright"
          class="p-2 text-center bg-white rounded shadow"
          v-bind:class="{ turn: userright.username === getUsername(room.currentTurnIdx), back: !(userright.username === getUsername(room.currentTurnIdx)) }"
        >
          <h3>{{ userright.username }}</h3>
          <p v-if="userright.have !== undefined" class="mt-3">所持：{{ userright.have }}</p>
        </div>
      </div>
    </aside>
    <!-- <widgetbot
	　server= '578796417523384360'
    channel= '578796417523384362'
    width = "100%"
    height = "100%"
    shard= 'https://disweb.deploys.io'
    ></widgetbot> -->
  </div>

</template>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { db } from '@/main'

export default {
  data () {
    return {
      image: require('@/assets/AnyamonyaCards/card.jpg'),
      name: '', // カードの名前入力フォーム用
      nextclicked: false, // 次へがクリックされるとtrueになる。
      message: '', // チャットのディスプレイ用
      messages: [] // チャットの取得用
    }
  },

  watch: {
    roombroke (newQuestion, oldQuestion) {
      this.doquitroom()
      if (this.roombroke != true) {
        this.fetchMessage()
      }
    }
  },

  computed: {
    ...mapState(['me', 'room']),
    ...mapGetters([
      'myIndexInRoom',
      'nplayers',
      'userleft',
      'usertop',
      'userright',
      'deck',
      'cardType',
      'playing',
      'roombroke',
      'restOfallCards'
    ])
  },

  methods: {
    getUsername (index) {
      if (index !== undefined) {
        return this.room.users[index].username
      }
    },
    fornextimage () {
      this.nextclicked = true

      db.collection('anyamonya_rooms')
        .doc(this.room.id)
        .collection('chat')
        .add({
          message: '3秒後に次のカードが表示されます…',
          createdAtJapan: new Date(),
          createdAt: this.timestamp(),
          username: 'システム'
        })

      const jsFrame2 = new JSFrame()
      jsFrame2.showToast({
        width: 260, // 幅
        height: 100, // 高さ
        duration: 2000, // 表示時間(millis)
        align: 'top', // 表示位置 'top'/'center'/'bottom'(default)
        style: {
          borderRadius: '2px',
          backgroundColor: 'rgba(0,124,255,0.8)'
          // backgroundColor: "rgba(255,0,0,0.8)"
        },
        html:
          '<span style="color:white;">3秒後に次のカードが表示されます…</span>',
        closeButton: true, // 閉じるボタンを表示
        closeButtonColor: 'white' // 閉じるボタンの色
      })

      setTimeout(this.nextimage, 3000)
    },
    nextimage () {
      this.room.isNextEnabled = false
      this.nextclicked = false

      if (this.restOfallCards === 0) {
        db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .collection('chat')
          .add({
            message: '山札がなくなりました',
            createdAtJapan: new Date(),
            createdAt: this.timestamp(),
            username: 'システム'
          })
          db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .update({
            indexnum: -1,
            isNextEnabled: false
          })
      } else {
        this.$store.dispatch('decreaserestOfallCards')

        let subIndexnum

        for (;;) {
          subIndexnum = Math.floor(Math.random() * this.room.deck.length)
          if (this.deck[subIndexnum].rest !== 0) {
            break
          }
        }
        this.deck[subIndexnum].rest--
        this.room.stack++

        if (this.deck[subIndexnum].name === '') {
          this.saveActionMessage()
        } else {
          this.room.cardname = this.deck[subIndexnum].name
          db.collection('anyamonya_rooms')
            .doc(this.room.id)
            .collection('chat')
            .add({
              message: 'このカードの名前をタイプ！',
              createdAtJapan: new Date(),
              createdAt: this.timestamp(),
              username: 'システム'
            })
          this.room.isKnownCard = true
          this.deck[subIndexnum].isCalled = false
          db.collection('anyamonya_rooms')
            .doc(this.room.id)
            .update({
              isKnownCard: true
            })
        }

        db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .update({
            deck: this.deck,
            stack: this.room.stack,
            indexnum: subIndexnum,
            cardname: this.room.cardname,
            isNextEnabled: false
          })
        this.message = ''
      }
    },
    saveName () {
      if (!this.room.isNextEnabled && this.message.length > 0) {
        this.deck[this.room.indexnum].name = this.message
        this.deck[this.room.indexnum].namedBy = this.me.username
        this.room.cardname = this.message
        this.nextclicked = false

        // set current turn index to next turn
        let currentTurnIdx = this.room.currentTurnIdx
        if (currentTurnIdx < this.room.users.length - 1) {
          currentTurnIdx++
        } else {
          currentTurnIdx = 0
        }

        db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .update({
            deck: this.deck,
            currentTurnIdx: currentTurnIdx,
            cardname: this.room.cardname,
            isNextEnabled: true
          })

        db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .collection('chat')
          .add({
            message: this.me.username + 'が命名しました',
            createdAtJapan: new Date(),
            createdAt: this.timestamp(),
            username: 'システム'
          })

        this.message = ''
      }
    },
    typeName () {
      if (this.message.length > 0) {
        db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .collection('chat')
          .add({
            message: this.message,
            createdAtJapan: new Date(),
            createdAt: this.timestamp(),
            username: this.me.username
          })

        if (
          this.message === this.deck[this.room.indexnum].name &&
          !this.deck[this.room.indexnum].isCalled
        ) {
          this.deck[this.room.indexnum].isCalled = true
          this.room.isNextEnabled = true
          this.room.isKnownCard = false

          var userlist = this.room.users.map(user => user.username)
          // this.room.users[userlist.indexOf(this.me.username)].have += this.room.stack
          this.room.users[this.myIndexInRoom].have += this.room.stack
          this.me.have += this.room.stack
          this.room.stack = 0

          // set current turn index to next turn
          let currentTurnIdx = this.room.currentTurnIdx
          if (currentTurnIdx < this.room.users.length - 1) {
            currentTurnIdx++
          } else {
            currentTurnIdx = 0
          }

          db.collection('anyamonya_rooms')
            .doc(this.room.id)
            .update({
              isNextEnabled: true,
              deck: this.deck,
              users: this.room.users,
              stack: 0,
              currentTurnIdx: currentTurnIdx,
              isKnownCard: false
            })
          db.collection('anyamonya_rooms')
            .doc(this.room.id)
            .collection('chat')
            .add({
              message: '正解！',
              createdAtJapan: new Date(),
              createdAt: this.timestamp() + 1,
              username: 'システム'
            })
        }
        this.message = ''
      }
    },
    timestamp () {
      let date = new Date()
      let timestamp = date.getTime()
      return Math.floor(timestamp / 1000)
    },
    saveMessage () {
      if (this.message.length != 0) {
        db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .collection('chat')
          .add({
            message: this.message,
            createdAtJapan: new Date(),
            createdAt: this.timestamp(),
            username: this.me.username
          })
        this.message = ''
      }
    },
    saveActionMessage () {
      db.collection('anyamonya_rooms')
        .doc(this.room.id)
        .collection('chat')
        .add({
          message: `このカードに命名してください(${this.me.username})`,
          createdAtJapan: new Date(),
          createdAt: this.timestamp(),
          username: 'システム'
        })
      this.message = ''
    },
    fetchMessage () {
      db.collection('anyamonya_rooms')
        .doc(this.room.id)
        .collection('chat')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          let allMessages = []
          querySnapshot.forEach(doc => {
            allMessages.push(doc.data())
          })
          if (allMessages[allMessages.length - 1].message === '正解！') {
            this.newMessage = true
            this.nextclicked = false
          }
          this.messages = allMessages
        })
    },
    displayTime (message) {
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
    gameStart () {
      db.collection('anyamonya_rooms')
        .doc(this.room.id)
        .update({
          currentTurnIdx: Math.floor(Math.random() * this.room.users.length),
          playing: true
        })
    },
    doquitroom () {
      if (this.roombroke == true) {
        const jsFrame2 = new JSFrame()

        jsFrame2.showToast({
          width: 260, // 幅
          height: 100, // 高さ
          duration: 5000, // 表示時間(millis)
          align: 'center', // 表示位置 'top'/'center'/'bottom'(default)
          style: {
            borderRadius: '2px',
            // backgroundColor: "rgba(0,124,255,0.8)"
            backgroundColor: 'rgba(255,0,0,0.8)'
          },
          html:
            '<span style="color:white;">See you late. The room has been removed by host.</span>',
          closeButton: true, // 閉じるボタンを表示
          closeButtonColor: 'white' // 閉じるボタンの色
        })
        history.back(-1)
        // location.reload();
      }
    },
    destroyRoom () {
      this.$store.dispatch('brokeAnyamonyaRoom')
      this.$store.dispatch('destroyAnyamonyaRoom')
    }
    // showdiscord () {
    //   const button = new Crate({
    //     server: '578796417523384360',
    //     channel: '578796417523384362',
    //     shard: 'https://disweb.deploys.io'
    //   })

    //   button.notify('Hello world!')
    // }
  },
  created () {
    this.$store.dispatch('watchAnyamonyaRoom', this.$route.params.roomId)
    this.room.id = this.$route.params.roomId
    if (this.roombroke != true) {
      this.fetchMessage()
      // this.showdiscord()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html, body, main { display: flex; flex-direction: column; }
.monster {
padding:10px;
 margin:5px;
 color:#000000;
 font-size:15pt;
 border:10px double #a4a5ac;
 border-radius:10px;
 -webkit-border-radius:10px;
 -moz-border-radius:10px;
}
</style>
