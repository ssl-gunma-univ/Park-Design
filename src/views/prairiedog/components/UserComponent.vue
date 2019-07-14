<template>
  <div class="col-md-6 col-lg-4">
      <div
        v-if="user"
        class="mb-2 text-center rounded shadow"
        :class="{ turn: user.username === currentTurnUserName, back: !(user.username === currentTurnUserName), 'py-5': ! playing && ! gameOver }"
      >
        <h3 id="name_p1">{{ user.username }}</h3>
        <p v-if="playing || gameOver">
          <img
            v-if="user.currentCard === undefined"
            src="@/assets/PrairieDogCards/card.png"
          >
          <img
            v-else-if="user.currentCard === '?'"
            class="w-75 img-thumbnail shadow"
            src="@/assets/PrairieDogCards/？.png"
          >
          <img
            v-else
            class="w-75 img-thumbnail shadow"
            v-bind:src="require('@/assets/PrairieDogCards/' + user.currentCard + '.png')"
          >
        </p>
        <p v-if="user.damage !== undefined" class="mt-3">ダメージ：{{ user.damage }}</p>
      </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'user-component',

  props: {
    user: {},
    currentTurnUserName: '' ,
    role: ''
  },

  computed: {
    ...mapState(['room']),

    ...mapGetters(['playing', 'gameOver']),

  }

}

</script>

<style>

</style>
