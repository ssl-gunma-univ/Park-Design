<template>
  <main class="container shadow bg-white">
    <div class="jumbotron">
      <h1>Welcome to <img class="img-fluid" style="width: 399px; height: 57px" src="@/assets/logos/1.png"/></h1>
      <hr>
      <h3>How to play games</h3>
      <p>
        There are some minor table games. Click a game you want to play. And create a room or join a room.<br>
      </p>
    </div>

    <div class="row">
      <div class="col-md-6 col-lg-4 mb-3 px-0">
          <div class="card mx-auto" style="width: 90%;">
            <img src="https://pbs.twimg.com/media/C84aGQhUAAANlqj.jpg:large" class="card-img-top" alt="prairie">
            <div class="card-body">
              <h5 class="card-title font-weight-bold">プレーリードッグ</h5>
              <p class="card-text">
                <strong>Prairie Dog</strong> is a simple bluffing game in a western setting. Every player gets a card
                 showing a number of "hidden" Indians or a special value. You don't know the value of your card, but you can see all the others.
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
            <img src="https://akiyosblog.com/wp-content/uploads/2016/01/DSC_9844.jpg" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title font-weight-bold">あんにゃもんにゃ</h5>
              <p class="card-text">
                <strong>あんにゃもんにゃ</strong>は、謎生物が描かれたカードが中央の場に次々とめくられるたびに、
                その人のセンスで特徴を捉えた名前を付け、全員で共有し、以降もし同じものがめくられたらその名前をいちタイプして、溜まったカードを獲得し、集めた枚数を競うゲームです。
              </p>
              <div class="clearfix">
                <a href="#" class="btn btn-primary float-right disabled">Play</a>
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
