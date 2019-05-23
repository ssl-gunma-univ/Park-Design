<template>
  <main class="text-center black">
    <div role="main" class="inner cover">
      <h1 class="cover-heading">About</h1>
      <p class="lead">You can play some table games. There is nothing else to write here.</p>
      <p class="lead">
        <a href="#" class="btn btn-lg btn-secondary">Learn more</a>
      </p>

    <footer class="mastfoot mt-auto">
      <div class="inner">
        <p>
          Contact us : ptittablegamepark@xxxxxxx.com<br>
          This site is used <a href="https://getbootstrap.com/">Bootstrap</a>.<br>
          A powerful Photoshop-like CSS gradient editor from <a href="https://www.colorzilla.com/">ColorZilla</a>.
        </p>
      </div>
    </footer>
  </div>
</main>
</template>

<script>
export default {
}
</script>

<style>
/* Links */
a,
a:focus,
a:hover {
  color: #fff;
}

/* Custom default button */
.btn-secondary,
.btn-secondary:hover,
.btn-secondary:focus {
  color: #333;
  text-shadow: none; /* Prevent inheritance from `body` */
  background-color: #fff;
  border: .05rem solid #fff;
}

/*
 * Base structure
 */
.black {
  padding-top: 23rem;
  padding-bottom: 23rem;
  height: 100%;
  background-color: #333;
  display: -ms-flexbox;
  color: #fff;
  text-shadow: 0 .05rem .1rem rgba(0, 0, 0, .5);
  box-shadow: inset 0 0 5rem rgba(0, 0, 0, .5);
}

.cover {
  padding: 0 1.5rem;
}
.cover .btn-lg {
  padding: .75rem 1.25rem;
  font-weight: 700;
}
</style>
