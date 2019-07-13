<template>
  <main class="container shadow bg-white">
    <div class="jumbotron">
      <h1>プレーリードッグのルール</h1>
      <hr>
      <h2>概要</h2>
      <p style="text-indent: 1em;">
        「プレーリードッグ」は，ハッタリと推理が勝負のカギを握る，心理戦ボードゲームです．
        『場に出ている数字の合計値を予想する』ゲームですが，その一番の特徴は『自分の数字だけ見えない』ということです．
        つまり「相手の見えている数字」と「自分の見えない数字」があり，その合計の数を推理します．
      </p>
    </div>
    <h3 class="topic">手順</h3>
    <ol>
      <li>数字や記号の書かれたカードが山札からプレイヤーに配られる</li>
      <li>このとき，各々は自分のカードを見ることができない</li>
      <li>ランダムに選ばれたプレイヤーからゲームがスタートする</li>
      <li>最初のプレイヤーは，自分以外の場のカードを見て，見えない自分のカードを考慮し，場のカードの合計値より少ないであろう数字を宣言する</li>
      <li>次のプレイヤーは，前のプレイヤーより大きい数字を宣言するか，前のプレイヤーの宣言した数字がすでに場のカードの合計値を超えたと思ったら，「プレーリードッグ」宣言をする</li>
      <li>数字を宣言した場合はゲームが続行し，次のプレイヤーのターンとなる</li>
      <li>「プレーリードッグ」宣言をした場合，全員が各々のカードを見ることができ，前のプレイヤーの宣言した数字が場のカードの合計値より大きかったらそのプレイヤーにダメージを与え，小さかったら「プレーリードッグ」宣言をしたプレイヤーにダメージが与えられる</li>
      <li>ゲームは山札の枚数がプレイヤーの人数未満になったときに終了し，その時点で受けたダメージの少ないプレイヤーから順に強いということになる</li>
    </ol>
    <h3 class="topic">カードの種類</h3>
    <p style="text-indent: 1em;">カードは14種類存在し，それぞれ枚数が決まっています．山札は合計で36枚になります．</p>
    <div class="row border-top border-bottom ml-5 mr-5 mb-4">
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">-10</p>
          <p class="mt-3">1枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">-5</p>
          <p class="mt-3">2枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">0</p>
          <p class="mt-3">4枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">1</p>
          <p class="mt-3">4枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">2</p>
          <p class="mt-3">4枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">3</p>
          <p class="mt-3">4枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">4</p>
          <p class="mt-3">4枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">5</p>
          <p class="mt-3">4枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">10</p>
          <p class="mt-3">3枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">15</p>
          <p class="mt-3">2枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">20</p>
          <p class="mt-3">1枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">×2</p>
          <p class="mt-3">1枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">MAX → 0</p>
          <p class="mt-3">1枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
        <div class="d-flex justify-content-between align-items-center w-100">
          <p class="mt-3">?</p>
          <p class="mt-3">1枚</p>
        </div>
      </div>
      <div class="col-lg-4 border-right border-left">
      </div>
    </div>
    <p style="text-indent: 1em;">これらのカードのうち，特殊な働きをするカードが3種類あります．「×2」「MAX → 0」「?」です．それぞれの効果は以下の通りです．</p>
    <div class="row border-top border-bottom ml-5 mr-5">
      <div class="col-3 border-right pt-2 pb-2">×2</div>
      <div class="col-9 pt-2 pb-2">場のカードの合計値を2倍する</div>
    </div>
    <div class="row border-bottom ml-5 mr-5">
      <div class="col-3 border-right pt-2 pb-2">MAX → 0</div>
      <div class="col-9 pt-2 pb-2">場のカードのうち，最も大きい値を持つカード1枚を0とする</div>
    </div>
    <div class="row border-bottom ml-5 mr-5">
      <div class="col-3 border-right pt-2 pb-2">?</div>
      <div class="col-9 pt-2 pb-2">「プレーリードッグ」宣言後，山札から1枚引き，そのカードと置き換わる<br>山札が0枚の場合は0となる</div>
    </div>
    <h3 class="mt-3 topic">元ネタ</h3>
    <p class="pb-5 px-3" style="text-indent: 1em;">
      プレーリードッグの元となったゲームはSpartaco Albertarelliさん考案のCoyoteというゲームである．
      「Coyote」と「プレーリードッグ」のルールの相違は，ライフが0になったものからいなくなる脱落制ではなく，ダメージが蓄積されるダメージ制を採っている点である．
    </p>
  </main>
</template>

<script>
export default {
}
</script>

<style>
.topic {
  color: #404040;
  border-left: solid 6px #1fa67a;
  border-bottom: solid 2px #dadada;
  background: whitesmoke;
  margin-bottom: 1rem;
  line-height: 1;
  padding: 0.3em;
}
</style>
