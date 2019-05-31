<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <div class="container">
      <b-navbar-brand href="/"><img style="width: 33px; height: 28px" src="@/assets/logos/1_square_gray.png"/></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/">Home</b-nav-item>
          <b-nav-item-dropdown text="Games" right>
            <b-dropdown-item href="/prairie-dog">プレーリードッグ</b-dropdown-item>
            <b-dropdown-item href="#">あんにゃもんにゃ</b-dropdown-item>
            <b-dropdown-item href="#">インディアンポーカー</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item href="#">Rules</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item href="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown>
            <!-- Using 'button-content' slot -->
            <template slot="button-content"><em>User</em></template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>
