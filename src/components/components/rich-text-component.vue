<template>
  <view>
    <scroll-view
      v-if="scrollView"
      :show-scrollbar="showScrollbar"
      scroll-y="true"
      class="large rich-text-component"
      @scrolltolower="scrolltolower"
      @scroll="onScroll"
      lower-threshold="150"
      :style="{ height: height }"
      :scroll-top="scrollTop"
    >
      <mp-html
        :content="htmlData"
        :tag-style="tagStyle"
        :show-img-menu="false"
        :loading-img="loadingImage"
      />
    </scroll-view>
    <view v-else>
      <mp-html
        :content="htmlData"
        :tag-style="tagStyle"
        :show-img-menu="false"
        :loading-img="loadingImage"
      />
    </view>
  </view>
</template>
<script>
import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html"
import {loadingImageBasicPath} from '@/utils/basic-image-path/loading'
export default {
  props: {
    htmlData: {
      type: String,
      default: ""
    },
    scrollView: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: "100%"
    },
    tagStyle: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    mpHtml
  },
  data() {
    return {
      showScrollbar: false,
      scrolled: false,
      scrollTop: 0,
      loadingImage :loadingImageBasicPath.mpHtmlPath,
      containerStyle: "white-space: pre-wrap;" // 容器样式
    }
  },
  mounted() {
    setTimeout(() => {
      this.scrollTop = 1
    }, 200)
    setTimeout(() => {
      if (this.scrolled === false) {
        this.$emit("iswatch", true)
      }
    }, 500)
  },
  methods: {
    onScroll() {
      this.scrolled = true
    },
    scrolltolower() {
      this.$emit("iswatch", true)
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ rich-text {
  color: var(--text-color-main);
}
/deep/ text {
  color: var(--text-color-main);
}
.large {
  pointer-events: auto;
}
.rich-text-component {
  /deep/ image {
    vertical-align: top;
  }
}
</style>
