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
    <main class="container-fluid offset-2 col-7 bg-white border shadow-lg" style="height: 100vh;">
      <div class="border text-center" style="height: 50vh;">
        <img
          v-if="room.indexnum === -1"
          class="w-50 img-fluid my-3 mx-auto d-block"
          alt="image"
          src="@/assets/AnyamonyaCards/card.jpg"
        />
        <img
        v-else
        class="w-50 img-fluid my-3 mx-auto d-block"
        alt="image"
        :src='require("@/assets/AnyamonyaCards/" + cardType[room.indexnum] + ".jpg")'
        />
        <div v-if="room.isNextEnabled">名前 : {{ room.cardname }}</div>
        <div>A stack of cards : {{ room.stack }}</div>
      </div>

      <div class="my-3">
        <span v-if="me.role === 'host'">
          <button @click="gameStart" :disabled="playing">ゲーム開始</button>
        </span>
        <span v-if="me.role === 'host'">
          <button
                @click="destroyRoom"
                type="button"
              >部屋解散</button>
        </span>

        <button
          @click="fornextimage"
          :disabled="! room.isNextEnabled || nextclicked || ! playing || getUsername(room.currentTurnIdx) !== me.username"
        >めくる</button>
      </div>

      <div
        v-if="room.isNextEnabled || (deck[room.indexnum] !== undefined && deck[room.indexnum].name !== '') || getUsername(room.currentTurnIdx) !== me.username"
      >
        <input
          v-if="! room.isKnownCard"
          @keyup.enter="saveMessage"
          v-model="message"
          type="text"
          placeholder="Type a message..."
        />
        <input
          v-else
          @keyup.enter="typeName"
          v-model="name"
          type="text"
          placeholder="Type a name..."
        />
        <button type="button" @click="saveMessage">送信</button>
      </div>
      <div v-else>
        <input
          @keyup.enter="saveName"
          v-model="name"
          :disabled="room.isNextEnabled || (deck[room.indexnum] !== undefined && deck[room.indexnum].name !== '')"
          type="text"
          placeholder="Type a name..."
        />
        <button
          type="button"
          @click="saveName"
          :disabled="room.isNextEnabled || (deck[room.indexnum] !== undefined && deck[room.indexnum].name !== '')"
        >命名</button>
      </div>
      <div class="overflow-auto mt-3" style="height: 35vh;">
        <div v-for="(message,index) in messages" :key="index">
          <div>
            <span>
              <b>{{message.username}}</b>
              : {{message.message}}
            </span>
            <small>({{displayTime(message)}})</small>
          </div>
        </div>
      </div>
    </main>

    <aside class="col-3">
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
    <widgetbot
	　server= '578796417523384360'
    channel= '578796417523384362'
    width = "100%"
    height = "100%"
    shard= 'https://disweb.deploys.io'
    ></widgetbot>
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
      nextclicked: false, // 次へがクリックされるとtureになる。
      message: '', // チャットのディスプレイ用
      messages: [] // チャットの取得用
    }
  },

  watch: {
    nextclicked (newNextclicked, oldNextclicked) {
      if (newNextclicked) {
        setTimeout(this.nextimage, 0)
      }
    },
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
      'userleft',
      'usertop',
      'userright',
      'deck',
      'cardType',
      'playing',
      'numberOfCardTypes',
      'numberOfEachCard',
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
    },
    nextimage () {
      this.room.isNextEnabled = false

      if (this.restOfallCards === 0) {
        console.log('finish')
        db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .collection('chat')
          .add({
            message: '山札がなくなりました',
            createdAtJapan: new Date(),
            createdAt: this.timestamp(),
            username: 'システム'
          })
        exit
      } else {
        this.$store.dispatch('decreaserestOfallCards')

        // this.room.indexnum = Math.floor(Math.random() * this.numberOfCardTypes)
        for (;;) {
          this.room.indexnum = Math.floor(Math.random() * this.numberOfCardTypes)
          console.log(this.deck[this.room.indexnum] + '=' + this.deck[this.room.indexnum].rest)
          if (this.deck[this.room.indexnum].rest !== 0) {
            break
          }
        }
        this.deck[this.room.indexnum].rest--
        this.room.stack++

        if (this.deck[this.room.indexnum].name === '') {
          this.saveActionMessage()
        } else {
          this.room.cardname = this.deck[this.room.indexnum].name
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
          this.deck[this.room.indexnum].isCalled = false
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
            indexnum: this.room.indexnum,
            cardname: this.room.cardname,
            isNextEnabled: false
          })
        this.image = require('@/assets/AnyamonyaCards/' +
        this.cardType[this.room.indexnum] +
        '.jpg')
        this.name = ''
        this.nextclicked = false
      }
    },
    saveName () {
      if (!this.room.isNextEnabled && this.name.length > 0) {
        this.deck[this.room.indexnum].name = this.name
        this.deck[this.room.indexnum].namedBy = this.me.username
        this.room.cardname = this.name

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

        this.name = ''
      }
    },
    typeName () {
      if (this.name.length > 0) {
        db.collection('anyamonya_rooms')
          .doc(this.room.id)
          .collection('chat')
          .add({
            message: this.name,
            createdAtJapan: new Date(),
            createdAt: this.timestamp(),
            username: this.me.username
          })
          .then(function (docRef) {
            console.log('Document written with ID: ', docRef.id)
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })

        if (
          this.name === this.deck[this.room.indexnum].name &&
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
        this.name = ''
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
          .then(function (docRef) {
            console.log('Document written with ID: ', docRef.id)
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
        this.message = ''
      }
    },
    saveActionMessage () {
      db.collection('anyamonya_rooms')
        .doc(this.room.id)
        .collection('chat')
        .add({
          message: 'このカードの名前は？',
          createdAtJapan: new Date(),
          createdAt: this.timestamp(),
          username: 'システム'
        })
        .then(function (docRef) {
          console.log('Document written with ID: ', docRef.id)
        })
        .catch(function (error) {
          console.error('Error adding document: ', error)
        })
      this.message = ''
    },
    fetchMessage () {
      db.collection('anyamonya_rooms')
        .doc(this.room.id)
        .collection('chat')
        .orderBy('createdAt')
        .onSnapshot(querySnapshot => {
          let allMessages = []
          querySnapshot.forEach(doc => {
            allMessages.push(doc.data())
            console.log(`${doc.id} => ${doc.data()}`)
          })
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
    createDeck () {
      var i
      for (i = 0; i < this.numberOfCardTypes; i++) {
        var random = Math.floor(Math.random() * 13)
        if (this.cardType.indexOf(random) === -1) {
          this.cardType[i] = random
        } else {
          i--
        }
      }
      for (i = 0; i < this.numberOfCardTypes; i++) {
        this.deck[i] = {
          name: '',
          namedBy: '',
          rest: this.numberOfEachCard
        }
      }
      this.room.deck = this.deck
      this.room.users = this.users

      // db.collection('anyamonya_rooms').add(this.room)
      //   .then(docRef => {
      //     this.room.id = docRef.id

      //     console.log('createRoom: roomID', this.room.id)
      // }).then(() => {
      // })
    },
    gameStart () {
      // this.room.currentTurnIdx = Math.floor(Math.random() * this.room.users.length)
      // this.room.playing = true
      db.collection('anyamonya_rooms')
        .doc(this.room.id)
        .update({
          currentTurnIdx: Math.floor(Math.random() * this.room.users.length),
          playing: true
        })
    },
    doquitroom () {
      if (this.roombroke == true) {
        console.log('doQuitRoom was executed')
        // alert('部屋が解散されました。')
        // alert('See you late. The room has been removed by host.')

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
      console.log('the room has been removed')
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
</style>
