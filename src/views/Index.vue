<template>
  <main class="container shadow bg-white">
    <div class="jumbotron">
      <h1>Welcome to <img class="img-fluid" style="width: 399px; height: 57px" src="@/assets/logos/1.png"/></h1>
      <hr>
      <h3>遊び方</h3>
      <p>
        下のゲーム一覧から，お好きなテーブルゲームをクリックしてください．合言葉(Secret word)を決めたら，一緒にプレイする友達に伝え，部屋を作成・参加しましょう．このサイトにあるゲームは，すべてマルチプレイです．外部ツールを使って，友達と通話しながらプレイすることをお勧めします．<br>
      </p>
    </div>

    <div class="row">
      <div class="col-md-6 col-lg-4 mb-3 px-0">
          <div class="card mx-auto" style="width: 90%;">
            <img src="@/assets/Images/logo_prairie.png" class="card-img-top" alt="prairie">
            <div class="card-body">
              <h5 class="card-title font-weight-bold">プレーリードッグ</h5>
              <p class="card-text">
                <strong>プレーリードッグ</strong>
                  は，ハッタリと推理が勝負のカギを握る，心理戦ボードゲームです．
                  『場に出ている数字の合計値を予想する』ゲームですが，その一番の特徴は『自分の数字だけ見えない』ということです．
                  つまり「相手の見えている数字」と「自分の見えない数字」があり，その合計の数を推理します．
                  <b>(2~4人用)</b>
              </p>
              <div class="clearfix">
                <router-link v-if="isSmartPhone" to="/prairie-dog-mobile" class="btn btn-primary float-right">Play</router-link>
                <router-link v-else to="/prairie-dog" class="btn btn-primary float-right">Play</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-3 px-0">
          <div class="card mx-auto" style="width: 90%;">
            <img src="@/assets/Images/logo_anyamonya.png" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title font-weight-bold">あんにゃもんにゃ</h5>
              <p class="card-text">
                <strong>あんにゃもんにゃ</strong>は，謎生物が描かれたカードが中央の場に次々とめくられるたびに，
                その人のセンスで特徴を捉えた名前を付け，全員で共有し，以降もし同じものがめくられたらその名前をいちタイプして，溜まったカードを獲得し，集めた枚数を競うゲームです．
                <b>(2~4人用)</b>
              </p>
              <div class="clearfix">
                <router-link v-if="isSmartPhone" to="/anya-monya" class="btn btn-primary float-right">Play</router-link>
                <router-link v-else to="/anya-monya" class="btn btn-primary float-right">Play</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-3 px-0">
          <div class="card mx-auto" style="width: 90%;">
            <img src="https://images.unsplash.com/photo-1551537661-210e318af89e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title font-weight-bold">Game Title(Provisional)</h5>
              <p class="card-text">
                Coming soon.
              </p>
              <div class="clearfix">
                <a href="#" class="btn btn-primary float-right disabled">Play</a>
              </div>
            </div>
          </div>
        </div>
    </div>
  </main>
</template>

<script>
import { db } from '@/main'

export default {
  computed: {
    isSmartPhone: function () {
      return isMobile.phone
    }
  }
}
</script>
