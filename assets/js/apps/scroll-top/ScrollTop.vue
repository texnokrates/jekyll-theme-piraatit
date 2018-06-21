<template>
  <transition :name="'back-top-fade'" :duration="300">
    <div class="scroll-top" v-show="showBackToTop" @click="toTop">
        <slot><div class="scroll-top__area icon"><i class="fa fa-4x fa-angle-up"></i></div></slot>
    </div>
  </transition>
</template>

<script>
  import { throttle } from 'throttle-debounce';
  import SmoothScroll from 'smoothscroll-polyfill';

  SmoothScroll.polyfill();

  export default {
    props: {
      hover: {
        type: Boolean
      },
      scrollFunction: {
        type: Function,
        default: () => {
          window.scroll({ top: 0, left: 0, behavior: "smooth" });
        }
      }
    },
    data() {
      return {
        showBackToTop: false,
        timeout: 0,
        scrollInterval: 20
      };
    },
    methods: {
      toTop() {
        this.showBackToTop = false;
        this.scrollFunction();
      },
      onScroll() {
        const currentScroll = document.body.scrollTop || document.documentElement.scrollTop;
        this.showBackToTop = currentScroll >= 0.1 * document.body.clientHeight;
      }
    },
    mounted() {
      this.throttledScrollHandler = throttle(300, this.onScroll);
      document.addEventListener("scroll", this.throttledScrollHandler);
    },
    beforeDestroy() {
      document.removeEventListener("scroll", this.throttledScrollHandler);
    }
  };
</script>

<style lang="scss">
  @import 'settings';

  .scroll-top {
    position: fixed;
    right: 30px;
    bottom: 50px;

    background: $white;
    border: 1px $primary-color solid;
    cursor: pointer;
    opacity: 1;
    transition: 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 1;
  }

  .scroll-top__area {
    padding:20px;
  }

  .back-top-fade-enter,
  .back-top-fade-leave-active {
    transform: translateY(-30px);
    opacity: 0;
  }
</style>
