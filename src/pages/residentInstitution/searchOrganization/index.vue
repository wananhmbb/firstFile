<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="搜索"></house-header>
      <view class="content">
        <view class="searchBox">
          <u-search
            @search="search"
            @change="search"
            placeholder="搜索机构"
            v-model="keyword"
            shape="round"
            :focus="true"
            :show-action="false"
            :clearabled="false"
            border-color="var(--theme-color-dark-blue)"
            bg-color="var(--bg-color-main)"
          >
          </u-search>
        </view>
        <view class="tenantListBox">
          <view
            class="item"
            v-for="(item, index) in tenantList"
            :key="index"
            @click="goTenantPage(item)"
          >
            <view class="imgBox">
              <image :src="item.logo"></image>
            </view>
            <view class="textBox">
              <view>{{ item.name }}</view>
              <view v-if="item.desc">{{ item.desc }} </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </theme>
</template>

<script>
import { getAllTenant } from "@/api/tabbar-index.js"
export default {
  data() {
    return {
      keyword: "",
      tenantList: []
    }
  },
  watch: {},
  onLoad() {},
  onShow() {},
  methods: {
    //搜索
    search() {
      let obj = {
        tenantName: this.keyword
      }
      getAllTenant(obj)
        .then(res => {
          if (res.code === 200) {
            this.tenantList = res.data
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    //去租户首页
    goTenantPage(item) {
      let tenantId = item.id
      this.$store.commit("getenants", tenantId)
      setTimeout(() => {
        uni.switchTab({ url: "/pages/tabbar/index/index" })
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  min-height: 100vh;
  background: var(--bg-color-main);
  .content {
    .searchBox {
      width: 95%;
      margin: auto;
      margin-top: 3px;
    }
    .tenantListBox {
      background: var(--bg-color-main);
      padding: 0 5%;
      margin-top: 10px;
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid var(--bd-color-main);
        .imgBox {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 15px;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .textBox {
          view:first-child {
            font-size: 36rpx;
            color: var(--text-color-main);
            padding-bottom: 2px;
          }
          view:last-child {
            color: var(--text-color-grey);
          }
        }
      }
    }
  }
}
</style>
