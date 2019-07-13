<template>
  <main class="container shadow bg-white pb-5">
    <div class="jumbotron">
      <h1>あんにゃもんにゃ</h1>
      <hr>
      <h2>ルール</h2>
      <ul>
        <li>カードをめくる</li>
        <li>知らないキャラクターには名前を付ける</li>
        <li>知ってるキャラクターなら名前をタイピング</li>
      </ul>
      <p class="text-danger">コピペは厳禁</p>
      <div class="clearfix">
        <a class="float-right" href="/anya-monya/rules" target="_blank">詳細</a>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-lg-6 p-5">
        <form class="form-signin card p-5">
          <div class="text-center">
            <h1 class="h3 mb-3 font-weight-normal">Create a Room here</h1>
            <p>Enter Secret word and Username</p>
          </div>

          <div class="form-label-group">
            <input
              v-model="secret_word"
              type="text"
              class="form-control"
              placeholder="Secret word"
              required
            >
            <label>Secret word</label>
          </div>

          <div class="form-label-group">
            <input
              v-model="creator_name"
              type="text"
              class="form-control"
              placeholder="Username"
              required
            >
            <label>Username</label>
          </div>

          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="inputState">カードの種類</label>
              <select id="inputState" class="form-control" v-model="type" required>
                <option>4 種類</option>
                <option>5 種類</option>
                <option>6 種類</option>
                <option>7 種類</option>
                <option>8 種類</option>
                <option>9 種類</option>
              </select>
            </div>
            <div class="form-group col-md-6">
              <label for="inputState">各カード枚数</label>
              <select id="inputState" class="form-control" v-model="number" required>
                <option selected>2 枚</option>
                <option selected>3 枚</option>
                <option selected>4 枚</option>
                <option selected>5 枚</option>
                <option selected>6 枚</option>
                <option selected>7 枚</option>
              </select>
            </div>
          </div>

          <button
            :disabled="!creator_name || !secret_word"
            @click.prevent="createRoom"
            class="btn btn-lg btn-primary btn-block"
            type="submit"
          >Create a Room</button>
          
        </form>
      </div>

      <div class="col-sm-12 col-lg-6 p-5">
        <form class="form-signin card p-5">
          <div class="text-center">
            <h1 class="h3 mb-3 font-weight-normal">Join a Room here</h1>
            <p>Enter Secret word and Username</p>
          </div>

          <div class="form-label-group">
            <input
              v-model="secret_word2"
              type="text"
              class="form-control"
              placeholder="Secret word"
              required
            >
            <label>Secret word</label>
          </div>

          <div class="form-label-group">
            <input
              v-model="joiner_name"
              type="text"
              class="form-control"
              placeholder="Username"
              required
            >
            <label>Username</label>
          </div>

          <button
            :disabled="!joiner_name || !secret_word2"
            @click.prevent="search_word"
            class="btn btn-lg btn-primary btn-block"
            type="submit"
          >Join a Room</button>
        </form>
      </div>
    </div>
    <!-- <iframe src="https://discordapp.com/widget?id=578796417523384360&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0"></iframe> -->
  </main>
</template>

<script>
import { db } from '@/main'
import { mapState } from 'vuex'

export default {
  name: 'anya-monya',
  data () {
    return {
      roomStatus: 'empty' /* possible values: hosted, full, empty */,
      roomPlayers: 0,
      creator_name: '',
      secret_word: '',
      joiner_name: '',
      room_id: '',
      secret_word2: '',
      abc: [],
      type: '5 種類',
      number: '3 枚'
    }
  },
  computed: {
    ...mapState([
      'anyamonya_rooms',
      'room' // always update when state changes
    ]),
    isSmartPhone: function () {
      return isMobile.phone
    }
  },
  watch: {
    room: function (oldRoom, newRoom) {
      if (this.room.id) {
        this.joinRoom()
      }
    }
  },
  methods: {
    createRoom: function () {
      /** Create room in firestore, register the host's name
       * and navigate to the waiting room */

      // initializing room
      const room = {
        users: [{ username: this.creator_name, role: 'host', have: 0 }]
      }

      const secret_word = this.secret_word
      const type = parseInt(this.type)
      const number = parseInt(this.number)

      // add room to firstore and update state.room
      // and state.me

      this.$store.dispatch('createAnyamonyaRoom', { room, secret_word, type, number })
    },

    joinRoom: function (roomId = false) {
      /** Register the user name to the room,
       * and navigate to the waiting room */

      if (!roomId) {
        // the room has just been created in db
        roomId = this.room.id
      } else {
        // user is trying to join an already created room
        const user = {
          username: this.joiner_name,
          role: 'guest',
          have: 0
        }
        this.$store.dispatch('addUserToAnyamonyaRoom', { roomId: roomId, user: user })
      }

      // navigate to playroom
      this.$router.push({
        name: 'anyamonyaplayroom',
        params: { roomId: roomId }
      })
    },

    search_word: function () {
      db.collection('lists')
        .doc('anyamonya_rooms')
        .collection('list')
        .where('secret_word', '==', `${this.secret_word2}`)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get().then((snapshot) => {
          snapshot.docs.forEach(doc => {
            this.joinRoom(doc.data().Room_ID)
          })
        }).catch((err) => console.error(err))
    }
  },

  created () {
    // navigate to mobile page if smartphone is used.
    // if(this.isSmartPhone) {
    //   this.$router.push('prairie-dog-mobile')
    // }
  }
}
</script>

<style>
.form-signin {
  width: 100%;
  max-width: 420px;
  padding: 15px;
  margin: auto;
}

.form-label-group {
  position: relative;
  margin-bottom: 1rem;
}

.form-label-group > input,
.form-label-group > label {
  height: 3.125rem;
  padding: 0.75rem;
}

.form-label-group > label {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  margin-bottom: 0; /* Override default `<label>` margin */
  line-height: 1.5;
  color: #495057;
  pointer-events: none;
  cursor: text; /* Match the input under the label */
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.1s ease-in-out;
}

.form-label-group input::-webkit-input-placeholder {
  color: transparent;
}

.form-label-group input:-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-moz-placeholder {
  color: transparent;
}

.form-label-group input::placeholder {
  color: transparent;
}

.form-label-group input:not(:placeholder-shown) {
  padding-top: 1.25rem;
  padding-bottom: 0.25rem;
}

.form-label-group input:not(:placeholder-shown) ~ label {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 12px;
  color: #777;
}
</style>
