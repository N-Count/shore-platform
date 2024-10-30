<template>
  <div class="pagination-footer-area">
    <div
      v-if="showPagination || showBtnArea"
      class="pagination"
      :class="[
        fixed ? 'jy-flex-center-row' : 'jy-default-pagination-footer',
        placement === 'left' ? 'jy-flex-left-row' : ''
      ]"
      :style="{
        'text-align': placement,
        bottom: marginNum > 0 ? `${marginNum}px` : ''
      }"
    >
      <div class="pagination-footer-btn" :class="[showBtnArea ? 'footer-area-top' : '']">
        <div class="footeBtn">
          <slot name="footerBtn"></slot>
        </div>
      </div>
      <ElPagination
        v-bind="$attrs"
        v-if="showPagination"
        :pageSizes="pageSizes"
        :layout="layout"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        :currentPage="currentPage"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
      ></ElPagination>
    </div>
  </div>
</template>

<script>
// 组件引入
// 接口引入
// 常量引入
// 常规JS引入
// 混入引入
// VueX引入
export default {
  name: 'jyPagination',
  components: {},
  props: {
    pageSizes: {
      type: Array,
      default: () => [5, 10, 20, 50]
    },
    layout: {
      type: String,
      default: 'sizes, prev, pager, next, jumper'
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 0
    },
    pageNum: {
      type: Number,
      default: 0
    },
    fixed: {
      type: Boolean,
      default: true
    },
    // 位置
    placement: {
      type: String,
      default: 'center',
      validator(val) {
        return ['left', 'center', 'right'].includes(val)
      }
    },
    // 少于指定条数不显示
    showByTotal: {
      type: Number,
      default: 0
    },
    // 距离底部边距
    marginNum: {
      type: Number,
      default: 0
    },
    // 只显示button区域
    showBtnArea: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {
    total(val) {
      this.util.hasScrollbar(this)
    }
  },
  computed: {
    showPagination() {
      console.log(!!(this.showByTotal > 0 && this.total > this.showByTotal))
      return !!(this.showByTotal > 0 && this.total > this.showByTotal)
    }
  },
  methods: {
    // 表格每页条数发生变化触发
    handlePageSizeChange(pageSize) {
      this.$emit('page-change', {
        pageSize,
        currentPage: 1
      })
      this.util.hasScrollbar(this)
    },
    // 表格页码发生变化触发
    handlePageCurrentChange(currentPage) {
      // this.$emit('update:currentPage', currentPage)
      this.$emit('page-change', {
        pageSize: this.pageSize,
        currentPage
      })
      this.util.hasScrollbar(this)
    }
  },
  created() {},
  mounted() {
    this.util.hasScrollbar(this)
  }
}
</script>

<style lang="scss" scoped>
.pagination-footer-area {
  display: flex;
  .pagination {
    box-sizing: border-box;
    background: #fff;
    padding: 0 24px;
    // padding: 8px 16px;
    // width: 100%;
  }

  ::v-deep {
    div.jy-flex-center-row {
      box-shadow: none !important;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .el-input--mini .el-input__inner,
    .el-input--mini .el-input__icon {
      height: 24px;
      line-height: 24px;
    }

    .el-pager li {
      color: rgba(0, 0, 0, 0.9);
      font-weight: normal;
      &:not(:last-of-type){
        margin-right: 8px!important;
      }
    }

    .el-pager li,
    .el-pagination button,
    .el-pagination span:not {
      min-width: 24px !important;
      height: 24px;
      line-height: 24px;
    }
  }

  ::v-deep .jy-flex-left-row {
    overflow: hidden;

    .el-pagination {
      justify-content: flex-start;

      .el-pagination__total {
        margin-left: 16px;
      }
    }
  }

  .pagination-footer-btn {
    display: flex;

    .footeBtn {
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
      Button {
        height: 32px;
        padding: 0 16px;
      }
    }
  }

  .footer-area-top {
    margin: 10px 0;
  }

  ::v-deep {
    .el-pagination {
      background-color: #fff !important;
      padding: 8px 0;
    }

    .el-input__inner:focus,
    .el-input__inner:hover {
      border-color: #d60010 !important;
    }

    div.el-pagination .el-pager li.active {
      background-color: #d60010 !important;
    }
    div.el-select-dropdown .el-select-dropdown__item.selected,
    div.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
      color: #d60010 !important;
    }
    .el-pagination__editor.el-input .el-input__inner {
      height: 20px;
    }
    .el-pagination__jump {
      padding: 0 8px;
      display: inline-block;
      color: rgba(0, 0, 0, 0.6) !important;
      background: #f7f7fa;
    }
  }
}
</style>
<style>
div.el-select-dropdown .el-select-dropdown__item.selected,
div.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  color: #d60010 !important;
}
div.el-select-dropdown .hover,
div.el-select-dropdown.is-multiple .hover {
  color: #d60010 !important;
  background: rgba(214, 0, 16, 0.05) !important;
}
</style>
