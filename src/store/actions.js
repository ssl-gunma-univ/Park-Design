import { db } from '@/main'
import firebase from 'firebase'

export default {
    createRoom({commit, dispatch, state}, room){
        // writing room information to db
        /* card objects have type and cardsLeft properties */

        // make list of card objects
        const cards = state.cardsType.map( (type, typeIdx) => {
            return {
                type: type,
                cardsLeft: state.initialCardNumbers[typeIdx]
            }
        })
        room.cards = cards
        room.previousCards = cards
        db.collection("rooms").add(room)
            .then(docRef => {
                /* saving the id of the room on firestore */
                room.id = docRef.id

                // commit room to state
                //commit('roomJoined', room)
                console.log('createRoom: roomID', room.id)
                dispatch('watchRoom', room.id)

                // also commit player on this client who is also the host
                // that is why he is indexed by 0
                commit('userLogedIn', room.users[0])
            })
            .catch( (err) => { console.error(err) } )
    },

    fetchRooms({commit}){
        db.collection("rooms").onSnapshot(querySnapshot => {
            let allRooms = []
            querySnapshot.forEach(doc => {
                let room = doc.data()
                room.id = doc.id // for local use
                //TODO: move this to a getter
                room.nplayers = room.users.length

                if (room.nplayers == 0)
                    room.status = 'empty'
                else if (room.nplayers < 4)
                    room.status = 'hosted'
                else
                    room.status = 'full'

                allRooms.push(room)
            })
            // commit all rooms to initial state
            commit('setAllRooms', allRooms)
        })
    },

    addUserToRoom({ commit, state, dispatch }, payload){
        db.collection("rooms").doc(payload.roomId).update({
            // see firestore doc for details
            users: firebase.firestore.FieldValue.arrayUnion(payload.user),
            events: firebase.firestore.FieldValue.arrayUnion({
                action: 'user_joined',
                author: payload.user.username
            })
        })
        commit('userLogedIn', payload.user)
    },

    watchRoom({ commit, state }, roomId){
        //TODO: maybe better to have events stored in subcollection
        // that could be watched seperately
        db.collection("rooms").doc(roomId)
        .onSnapshot(doc => {
            let room = doc.data()
            room.id = roomId
            commit('roomJoined', room);
        });
    },

    resetCards({ commit, state }){
        /* Set the cards to their initial state in db */
        const cards = state.cardsType.map( (type, typeIdx) => {
            return {
                type: type,
                cardsLeft: state.initialCardNumbers[typeIdx],
            }
        })

        db.collection("rooms").doc(state.room.id).update(
            {
                cards: cards,
                previousCards: cards,
                events: firebase.firestore.FieldValue.arrayUnion({
                    action: 'new_game',
                })
            }
        )
        .then( () => console.log('cards successfuly reset') )
        .catch( (err) => console.error(err) )
    },

    drawCards({ commit, state }, cards){
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
            while ( ! cardDrawn ){
                const cardTypeIdx = Math.floor(Math.random() * cards.length)
                if ( cards[cardTypeIdx].cardsLeft ){
                    cardDrawn = cards[cardTypeIdx].type
                    cards[cardTypeIdx].cardsLeft -= 1
                }
                else
                    // no cards of this type, remove from consideration
                    cards.splice(cardTypeIdx, 1)
            }
            return cardDrawn
        }

        for (let user of users){
            // assign each user a card
            user.currentCard = randomDraw()
        }
        //update db
        db.collection("rooms").doc(state.room.id).update({
            users: users,
            cards: cards,
            events: firebase.firestore.FieldValue.arrayUnion({
                action: 'new_round',
            })
        })
        //NOTE: state is updated when db is updated
        .then(() => console.log('users have drawn cards'))
    },

    preprocessing({ commit, state }) {
        // decide who is first turn
        state.room.playing = true
        state.room.gameOver = false
        state.room.currentTurnIdx = Math.floor(Math.random() * state.room.users.length)
        db.collection("rooms").doc(state.room.id).update({
            currentTurnIdx: state.room.currentTurnIdx,
            playing: true,
            events: firebase.firestore.FieldValue.arrayUnion({
                action: 'preprocessing',
            })
        })
        //NOTE: state is updated when db is updated
        .then(() => {
            console.log('preprocessing')
        })
    },

    call({ commit, state }, attempt) {
        // set last called number from textbox in PrairieDogPlauRoom.vue
        state.room.lastCalledNumber = attempt

        // set current turn index to next turn
        if (state.room.currentTurnIdx < state.room.users.length - 1) {
            state.room.currentTurnIdx++
        } else {
            state.room.currentTurnIdx = 0
        }

        // set lastCalledNumber and currentTurnIdx to firestore
        db.collection("rooms").doc(state.room.id).update({
            currentTurnIdx: state.room.currentTurnIdx,
            lastCalledNumber: state.room.lastCalledNumber,
            events: firebase.firestore.FieldValue.arrayUnion({
                action: 'called_number',
            })
        })
    },

    callPrairieDog({ commit, state }) {
        state.room.gameOver = true
        db.collection("rooms").doc(state.room.id).update({
            gameOver: true,
            events: firebase.firestore.FieldValue.arrayUnion({
                action: 'called_prairie_dog',
            })
        })
    },

    nextRound({ commit, state }) {
        state.room.previousCards = state.room.cards.slice()
    },

    destroyRoom({ commit, state }) {
        db.collection("rooms").doc(state.room.id).delete().then(() => {
            console.log("status deleted");
            history.back(-1)
        })
        .catch((error) => {
            console.log("failed");
        })
    }

}
