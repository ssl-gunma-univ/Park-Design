export default {
  myIndexInRoom (state) {
    // find index of this player in this users array
    if (state.room.users) {
      return state.room.users.findIndex(user => {
        return user.username === state.me.username
      })
    } else { return undefined }
  },

  nplayers (state) {
    if (state.room.users) {
      return state.room.users.length
    }
  },

  currentTurnIdx (state) {
    return state.room.currentTurnIdx
  },

  lastNum (state) {
    return state.room.lastCalledNumber
  },

  playing (state) {
    return state.room.playing
  },

  isPrairieDogCalled (state) {
    return state.room.isPrairieDogCalled
  },

  gameOver (state) {
    return state.room.gameOver
  },

  userleft (state, getters) {
    if (getters.myIndexInRoom !== undefined) {
      return state.room.users[(getters.myIndexInRoom + 1) % 4]
    } else {
      return false
    }
  },

  usertop (state, getters) {
    if (getters.myIndexInRoom !== undefined) {
      return state.room.users[(getters.myIndexInRoom + 2) % 4]
    } else {
      return false
    }
  },

  userright (state, getters) {
    if (getters.myIndexInRoom !== undefined) {
      return state.room.users[(getters.myIndexInRoom + 3) % 4]
    } else {
      return false
    }
  },

  cardsLeft (state) {
    return state.room.cards
  },

  previousCardsLeft (state) {
    return state.room.previousCards
  },

  events (state) {
    return state.room.events
  },

  roombroke (state) {
    return state.room.roombroke
  },

  // あんにゃもんにゃ
  deck (state) {
    return state.room.deck
  },

  cardType (state) {
    return state.room.cardType
  },

  named (state) {
    return state.room.named
  },

  restOfallCards (state) {
    return state.room.restOfallCards
  }
}
