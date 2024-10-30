<template>
  <el-table
    class="theme-table"
    :data="list"
    v-bind="table">
    <el-table-column
      prop="title"
      align="center"
      width="160"/>
    <el-table-column
      :show-overflow-tooltip="false"
      label="预览"
      width="120">
      <div
        slot-scope="scope"
        class="theme-preview"
        :class="[ scope.row.name === 'lightTheme' ? 'isNone-border' : '']"
        :style="{
          backgroundImage: `url(${$baseUrl}${scope.row.preview})`
        }">
      </div>
    </el-table-column>
    <el-table-column
      prop="address"
      align="center"
      width="286">
      <template slot-scope="scope">
        <el-button
          class="theme-select-btn"
          v-if="activeName === scope.row.name"
          type="success"
          icon="el-icon-check"
          round>
          已激活
        </el-button>
        <el-button
          v-else
          class="theme-select-btn"
          round
          @click="handleSelectTheme(scope.row.name)">
          使用
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'd2-theme-list',
  data () {
    return {
      table: {
        showHeader: false,
        border: true
      }
    }
  },
  computed: {
    ...mapState('d2admin/theme', [
      'list',
      'activeName'
    ]),
    ...mapState('d2admin/user', ['info'])
  },
  mounted () {},
  methods: {
    ...mapActions('d2admin/theme', [
      'set'
    ]),
    async handleSelectTheme (name) {
      this.set(name)
      const { darkColor, lightColor } = this.info
      if (darkColor || lightColor) {
        if (name === 'darkTheme') {
          await this.$store.dispatch('d2admin/color/set', darkColor, { root: true })
        } else {
          await this.$store.dispatch('d2admin/color/set', lightColor, { root: true })
        }
      } else {
        const colorVal = this.constant.mainColorLists[name]
        await this.$store.dispatch('d2admin/color/set', colorVal, { root: true })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div.theme-table{
  width: 100%;
  .theme-preview {
    height: 56px;
    width: 100px;
    background: #000000;
    border-radius: 4px;
    background-size: 40px 44px;
    background-repeat: no-repeat;
    background-position: center;
    border: 1px solid #333;
  }
  .isNone-border{
    border: none;
    background: #fff;
    background-size: 40px 44px;
    background-repeat: no-repeat;
    background-position: center;
  }
  button.theme-select-btn{
    padding: 12px 23px;
    height: 40px;
    width: auto;
  }
}

</style>
