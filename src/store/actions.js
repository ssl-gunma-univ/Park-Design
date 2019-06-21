import { db } from '@/main'
import firebase from 'firebase'

export default {
  createRoom ({ commit, dispatch, state }, payload) {
    // writing room information to db
    /* card objects have type and cardsLeft properties */
    const room = payload.room
    const secret_word =payload.secret_word
    // make list of card objects
    const cards = state.cardsType.map((type, typeIdx) => {
      return {
        type: type,
        cardsLeft: state.initialCardNumbers[typeIdx]
      }
    })

    room.cards = cards
    room.previousCards = cards

    db.collection('rooms').add(room)
      .then(docRef => {
        /* saving the id of the room on firestore */
        room.id = docRef.id
        console.log("secretwrod",secret_word)
        // commit room to state
        // commit('roomJoined', room)
        console.log('createRoom: roomID', room.id)
        dispatch('watchRoom', room.id)

        db.collection("lists")
        .doc("rooms")
        .collection("list")
          .add({
          Room_ID: room.id,
          secret_word: secret_word,
          createdAtJapan: new Date(),
          createdAt: new Date().getTime() / 1000.0
          })
          .then(function(docRef) {
            console.log("Room list written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding room list: ", error);
          });


        // dispatch('addsecret_word',secret_word)
        // dispatch('addList',room.id,secret_word)

        // also commit player on this client who is also the host
        // that is why he is indexed by 0
        commit('userLogedIn', room.users[0])
      })
  },

  createAnyamonyaRoom({ commit, dispatch, state }, payload) {
    // writing room information to db
    /* deckにはゲームに使用されるカードの種類と，それぞれの枚数が格納される
       cardTypeはランダムに選ばれる． */
    const room = payload.room
    const secret_word = payload.secret_word

    let deck = []

    let cardType = []

    // create a deck
    var i
    for (i = 0; i < state.numberOfCardTypes; i++) {
      var random = Math.floor(Math.random() * 13)
      if (cardType.indexOf(random) === -1) {
        cardType[i] = random
      } else {
        i--
      }
    }
    for (i = 0; i < state.numberOfCardTypes; i++) {
      deck[i] = {
        name: '',
        namedBy: '',
        rest: state.numberOfEachCard,
        isCalled: false // 名前が当てられたらtrueに．次のカードをめくるとfalseに戻る
      }
    }

    room.cardType = cardType // list of file names of card's image(jpeg).
    room.deck = deck // a deck of cards. it is created by createDeck method. there are 5 same cards.
    room.stack = 0 // a stack of cards
    room.indexnum = -1 // どのカードがめくられたかのインデックス．
    room.isKnownCard = false // 名づけ済みのカードが現れるとtrueに
    room.playing = false // ゲーム開始でtrueに
    room.isNextEnabled = true // ホストの次へのボタンが押せるかどうか．trueなら押せる
    room.currentTurnIdx = 0 // 誰がめくる番かを保存．名前を付けた後あるいは名前を当てた後に次のターンに変わる
    room.cardname = ''

    db.collection('anyamonya_rooms').add(room)
      .then(docRef => {
        /* saving the id of the room on firestore */
        room.id = docRef.id
        console.log("secretwrod", secret_word)
        // commit room to state
        // commit('roomJoined', room)
        console.log('createRoom: roomID', room.id)
        dispatch('watchAnyamonyaRoom', room.id)

        db.collection("lists")
          .doc("anyamonya_rooms")
          .collection("list")
          .add({
            Room_ID: room.id,
            secret_word: secret_word,
            createdAtJapan: new Date(),
            createdAt: new Date().getTime() / 1000.0
          })
          .then(function (docRef) {
            console.log("Room list written with ID: ", docRef.id);
          })
          .catch(function (error) {
            console.error("Error adding room list: ", error);
          });


        // dispatch('addsecret_word',secret_word)
        // dispatch('addList',room.id,secret_word)

        // also commit player on this client who is also the host
        // that is why he is indexed by 0
        commit('userLogedIn', room.users[0])
      })
  },
  

  // addList ({commit, dispatch, state }, {roomId,secret_word}){
  //   db.collection("lists")
  //       .doc("rooms")
  //       .collection("list")
  //       .add({
  //         Room_ID: roomId,
  //         secret_word: secret_word,
  //         createdAtJapan: new Date(),
  //         createdAt: new Date().getTime() / 1000.0
  //       })
  //       .then(function(docRef) {
  //         console.log("Room list written with ID: ", docRef.id);
  //       })
  //       .catch(function(error) {
  //         console.error("Error adding room list: ", error);
  //       });
  // },

  addUserToRoom ({ commit, state, dispatch }, payload) {
    db.collection('rooms').doc(payload.roomId).update({
      // see firestore doc for details
      users: firebase.firestore.FieldValue.arrayUnion(payload.user)
    }).then(() => {
      db.collection('rooms')
        .doc(state.room.id)
        .collection('chat')
        .add({
          message: 'joined!',
          createdAtJapan: new Date(),
          createdAt: new Date().getTime() / 1000.0,
          username: payload.user.username
        })
    })
    commit('userLogedIn', payload.user)
  },

  addUserToAnyamonyaRoom({ commit, state, dispatch }, payload) {
    db.collection('anyamonya_rooms').doc(payload.roomId).update({
      // see firestore doc for details
      users: firebase.firestore.FieldValue.arrayUnion(payload.user)
    }).then(() => {
      db.collection('anyamonya_rooms')
        .doc(state.room.id)
        .collection('chat')
        .add({
          message: 'joined!',
          createdAtJapan: new Date(),
          createdAt: new Date().getTime() / 1000.0,
          username: payload.user.username
        })
    })
    commit('userLogedIn', payload.user)
  },

  watchRoom ({ commit, state }, roomId) {
    // TODO: maybe better to have events stored in subcollection
    // that could be watched seperately

    db.collection('rooms').doc(roomId)
      .onSnapshot(doc => {
        let room = doc.data()
        room.id = roomId
        commit('roomJoined', room)
      })
  },

  watchAnyamonyaRoom({ commit, state }, roomId) {
    // TODO: maybe better to have events stored in subcollection
    // that could be watched seperately

    db.collection('anyamonya_rooms').doc(roomId)
      .onSnapshot(doc => {
        let room = doc.data()
        room.id = roomId
        commit('roomJoined', room)
      })
  },

  resetCards ({ commit, state }) {
    /* Set the cards to their initial state in db */
    const cards = state.cardsType.map((type, typeIdx) => {
      return {
        type: type,
        cardsLeft: state.initialCardNumbers[typeIdx]
      }
    })

    let users = state.room.users.slice()
    for (let user of users) {
      user.damage = 0
    }

    db.collection('rooms').doc(state.room.id).update({
      users: users,
      cards: cards,
      previousCards: cards
    })
      .then(() => {
        console.log('cards successfuly reset')
        db.collection('rooms')
          .doc(state.room.id)
          .collection('chat')
          .add({
            message: 'GAME START!',
            createdAtJapan: new Date(),
            createdAt: new Date().getTime() / 1000.0,
            username: 'SYSTEM_ADMINISTRATOR'
          })
      })
      .catch((err) => console.error(err))
  },

  drawCards ({ commit, state }, cards) {
    /* Only called from `host`.
    *
    * Assign a currentCard property to each user.
    * Also update the remaining cards.
    * */

    let users = state.room.users.slice()
    // make copy to avoid accidentaly updating views
    console.log('cards to draw from', cards)

    var randomDraw = () => {
      let cardDrawn = false
      while (!cardDrawn) {
        const cardTypeIdx = Math.floor(Math.random() * cards.length)
        if (cards[cardTypeIdx].cardsLeft) {
          cardDrawn = cards[cardTypeIdx].type
          cards[cardTypeIdx].cardsLeft -= 1
        } else {
          // no cards of this type, remove from consideration
          cards.splice(cardTypeIdx, 1)
        }
      }
      return cardDrawn
    }

    // assign each user a card
    for (let user of users) {
      user.currentCard = randomDraw()
    }

    let remaining = 0
    for (let card of cards) {
      remaining += card.cardsLeft
    }
    console.log('remaining number of cards : ' + remaining)

    // update db
    state.room.cards = cards
    db.collection('rooms').doc(state.room.id).update({
      users: users,
      cards: cards,
      remaining: remaining
    })
      // NOTE: state is updated when db is updated
      .then(() => {
        console.log('users have drawn cards')
        db.collection('rooms')
          .doc(state.room.id)
          .collection('chat')
          .add({
            message: 'NEW ROUND',
            createdAtJapan: new Date(),
            createdAt: new Date().getTime() / 1000.0,
            username: 'SYSTEM_ADMINISTRATOR'
          })
      })
  },

  preprocessing ({ commit, dispatch, state }, cards) {
    // decide who is first turn
    db.collection('rooms').doc(state.room.id).update({
      currentTurnIdx: Math.floor(Math.random() * state.room.users.length),
      lastCalledNumber: null,
      playing: true,
      isPrairieDogCalled: false,
      gameOver: false,
      roombroke: false
    })
      // NOTE: state is updated when db is updated
      .then(() => {
        console.log('preprosessing then')
        dispatch('drawCards', cards)
      })
  },

  call ({ commit, state }, { attempt, username }) {
    // set last called number from textbox in PrairieDogPlauRoom.vue
    state.room.lastCalledNumber = attempt

    // set current turn index to next turn
    let currentTurnIdx = state.room.currentTurnIdx
    if (currentTurnIdx < state.room.users.length - 1) {
      currentTurnIdx++
    } else {
      currentTurnIdx = 0
    }

    // set lastCalledNumber and currentTurnIdx to firestore
    db.collection('rooms').doc(state.room.id).update({
      currentTurnIdx: currentTurnIdx,
      lastCalledNumber: state.room.lastCalledNumber
    })
      .then(() => {
        db.collection('rooms')
          .doc(state.room.id)
          .collection('chat')
          .add({
            message: 'called ' + state.room.lastCalledNumber,
            createdAtJapan: new Date(),
            createdAt: new Date().getTime() / 1000.0,
            username: username
          })
      })
  },

  callPrairieDog ({ commit, state }, username) {
    var multiplier = 0
    var max = -1000000
    var total = 0

    for (var i = 0; i < state.room.users.length; i++) {
      if (state.room.users[i].currentCard === '?') {
        var randomDraw = () => {
          let cardDrawn = false
          while (!cardDrawn) {
            const cardTypeIdx = Math.floor(Math.random() * state.room.cards.length)
            if (state.room.cards[cardTypeIdx].cardsLeft) {
              cardDrawn = state.room.cards[cardTypeIdx].type
              state.room.cards[cardTypeIdx].cardsLeft -= 1
            } else {
              // no cards of this type, remove from consideration
              state.room.cards.splice(cardTypeIdx, 1)
            }
          }
          return cardDrawn
        }

        let currentCard = randomDraw()

        state.room.users[i].currentCard = currentCard

        // update db
        state.room.remaining--
        db.collection('rooms').doc(state.room.id).update({
          users: state.room.users,
          cards: state.room.cards,
          remaining: state.room.remaining
        })
          .then(() => {
            db.collection('rooms')
              .doc(state.room.id)
              .collection('chat')
              .add({
                message: '[?] → [' + currentCard + ']',
                createdAtJapan: new Date(),
                createdAt: new Date().getTime() / 1000.0,
                username: 'SYSTEM_ADMINISTRATOR'
              })
          })
      }
    }

    for (var i = 0; i < state.room.users.length; i++) {
      var card = state.room.users[i].currentCard

      /* カードの種類別に集計 */
      if (state.cardsType.indexOf(card) < 11) {
        total += parseInt(card)
      } else if (card === '×2') {
        multiplier === 0 ? multiplier += 2 : multiplier *= 2
      } else if (card === 'MAX → 0') {
        for (var j = 0; j < state.room.users.length; j++) {
          var card = parseInt(state.room.users[j].currentCard)
          if (card > max) {
            max = card
          }
        }
      }
    }

    /* 'MAX → 0'があった場合にTOTALからMAXを引く */
    if (max === -1000000) {
      max = 0
    }
    total -= max

    /* '×2'の分乗算する */
    if (multiplier != 0) {
      total *= multiplier
    }

    /* damage */
    let turnIdx = state.room.currentTurnIdx
    if (state.room.lastCalledNumber > total) {
      db.collection('rooms')
        .doc(state.room.id)
        .collection('chat')
        .add({
          message: 'Prairie Dog!',
          createdAtJapan: new Date(),
          createdAt: new Date().getTime() / 1000.0,
          username: username
        }).then(() => {
          db.collection('rooms')
            .doc(state.room.id)
            .collection('chat')
            .add({
              message: 'プレーリードッグ成功！（合計：' + total + '）',
              createdAtJapan: new Date(),
              createdAt: new Date().getTime() / 1000.0 + 0.001,
              username: 'SYSTEM_SUCCESS'
            })
        })

      if (turnIdx === 0) {
        turnIdx = state.room.users.length
      }
      turnIdx--
    } else {
      db.collection('rooms')
        .doc(state.room.id)
        .collection('chat')
        .add({
          message: 'Prairie Dog!',
          createdAtJapan: new Date(),
          createdAt: new Date().getTime() / 1000.0,
          username: username
        }).then(() => {
          db.collection('rooms')
            .doc(state.room.id)
            .collection('chat')
            .add({
              message: 'プレーリードッグ失敗！（合計：' + total +'）',
              createdAtJapan: new Date(),
              createdAt: new Date().getTime() / 1000.0 + 0.001,
              username: 'SYSTEM_FAILURE'
            })
        })
    }
    state.room.users[turnIdx].damage++

    if (state.room.remaining > state.room.users.length) {
      db.collection('rooms').doc(state.room.id).update({
        users: state.room.users,
        isPrairieDogCalled: true
      })
    } else {
      var firstPlace = []
      var secondPlace = []
      var thirdPlace = []
      var fourthPlace = []
      var damages = state.room.users.map(user => user.damage)
      damages.sort((a, b) => { return a - b })
      damages = damages.filter((x, i, self) => self.indexOf(x) === i)

      for (var i = 0; i < state.room.users.length; i++) {
        if (state.room.users[i].damage === damages[0]) {
          firstPlace.push(state.room.users[i].username)
        }
      }
      for (var i = 0; i < state.room.users.length; i++) {
        if (damages.length >= 2 && state.room.users[i].damage === damages[1]) {
          secondPlace.push(state.room.users[i].username)
        }
      }
      for (var i = 0; i < state.room.users.length; i++) {
        if (damages.length >= 3 && state.room.users[i].damage === damages[2]) {
          thirdPlace.push(state.room.users[i].username)
        }
      }
      for (var i = 0; i < state.room.users.length; i++) {
        if (damages.length >= 4 && state.room.users[i].damage === damages[3]) {
          fourthPlace.push(state.room.users[i].username)
        }
      }

      db.collection('rooms').doc(state.room.id).update({
        users: state.room.users,
        roombroke: false,
        playing: false,
        isPrairieDogCalled: true,
        gameOver: true,
        previousCards: state.room.cards.slice()
      }).then(() => {
        db.collection('rooms')
          .doc(state.room.id)
          .collection('chat')
          .add({
            message: 'GAME OVER!',
            createdAtJapan: new Date(),
            createdAt: new Date().getTime() / 1000.0 + 0.003,
            username: 'SYSTEM_ADMINISTRATOR'
          })
      }).then(() => {
        firstPlace.forEach(user => {
          db.collection('rooms')
            .doc(state.room.id)
            .collection('chat')
            .add({
              message: '1st : ' + user,
              createdAtJapan: new Date(),
              createdAt: new Date().getTime() / 1000.0 + 0.004,
              username: 'SYSTEM_RANKINGS'
            })
        })
      }).then(() => {
        secondPlace.forEach(user => {
          db.collection('rooms')
            .doc(state.room.id)
            .collection('chat')
            .add({
              message: '2nd : ' + user,
              createdAtJapan: new Date(),
              createdAt: new Date().getTime() / 1000.0 + 0.005,
              username: 'SYSTEM_RANKINGS'
            })
        })
      }).then(() => {
        thirdPlace.forEach(user => {
          db.collection('rooms')
            .doc(state.room.id)
            .collection('chat')
            .add({
              message: '3rd : ' + user,
              createdAtJapan: new Date(),
              createdAt: new Date().getTime() / 1000.0 + 0.006,
              username: 'SYSTEM_RANKINGS'
            })
        })
      }).then(() => {
        fourthPlace.forEach(user => {
          db.collection('rooms')
            .doc(state.room.id)
            .collection('chat')
            .add({
              message: '4th : ' + user,
              createdAtJapan: new Date(),
              createdAt: new Date().getTime() / 1000.0 + 0.007,
              username: 'SYSTEM_RANKINGS'
            })
        })
      })
    }
  },

  nextRound ({ commit, dispatch, state }) {
    db.collection('rooms').doc(state.room.id).update({
      previousCards: state.room.cards.slice()
    })
      .then(() => {
        state.isPrairieDogCalled = false
        dispatch('preprocessing', state.room.cards)
      })
  },

  destroyRoom ({ commit, state }) {
    db.collection('rooms').doc(state.room.id).delete().then(() => {
      // history.back(-1)
    })
      .catch((err) => {
        console.error(err)
      })
  },

  brokeRoom ({ commit, state }) {
    console.log("action.js addseecret_word")
    db.collection('rooms').doc(state.room.id).update({
      roombroke: true
    }).then(() => {
      // history.back(-1)
    })
      .catch((err) => {
        console.error(err)
      })
  },

  // addsecret_word ({ commit, state },secret_word) {
  //   console.log("action.js addseecret_word")
  //   db.collection('rooms').doc(state.room.id).update({
  //     secret_word: secret_word
  //   }).then(() => {
      
  //   })
  //     .catch((err) => {
  //       console.error(err)
  //     })
  // }
}
