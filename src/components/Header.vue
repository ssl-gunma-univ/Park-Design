<template>
  <div class="mb-4">
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/"><img style="width: 33px; height: 28px" src="@/assets/logos/1_square_gray.png"/></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" href="/">Home</a>
            </li>
            <b-nav-item-dropdown text="Games" right>
              <b-dropdown-item href="/prairie-dog">プレーリードッグ</b-dropdown-item>
              <b-dropdown-item href="#">あんにゃもんにゃ</b-dropdown-item>
              <b-dropdown-item href="#">インディアンポーカー</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item href="#">Something else here</b-dropdown-item>
            </b-nav-item-dropdown>
            <li class="nav-item">
              <a class="nav-link" href="/about">About</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
