<template>
  <div class="d2-multiple-page-control-group" flex>
    <div class="d2-multiple-page-control-content" flex-box="1">
      <div class="d2-multiple-page-control-content-inner">
        <d2-contextmenu
          :visible.sync="contextmenuFlag"
          :x="contentmenuX"
          :y="contentmenuY"
        >
          <d2-contextmenu-list
            :menulist="
              tagName === '/index' ? contextmenuListIndex : contextmenuList
            "
            @rowClick="contextmenuClick"
          />
        </d2-contextmenu>
        <el-tabs
          class="d2-multiple-page-control d2-multiple-page-sort"
          v-model="current"
          type="card"
          :closable="true"
          @tab-click="handleClick"
          @edit="handleTabsEdit"
          @contextmenu.native="handleContextmenu"
        >
          <el-tab-pane
            v-for="page in opened"
            :key="page.fullPath"
            :label="page.meta.title || '未命名'"
            :name="page.fullPath"
          />
        </el-tabs>
      </div>
    </div>
    <div class="d2-multiple-page-control-btn" flex-box="0">
    <div>
       <span class="close" @click="showAllTips"><d2-icon name="times-circle"/></span>
      <el-dropdown
        @command="command => handleControlItemClick(command)"
      >
        <span class="expansion">

       <i class="el-icon-caret-bottom"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="left">
            <d2-icon name="arrow-left" class="d2-mr-10" />
            关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="right">
            <d2-icon name="arrow-right" class="d2-mr-10" />
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="other">
            <d2-icon name="times" class="d2-mr-10" />
            关闭其它
          </el-dropdown-item>
          <el-dropdown-item command="all">
            <d2-icon name="times-circle" class="d2-mr-10" />
            全部关闭
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Sortable from 'sortablejs'

export default {
  components: {
    D2Contextmenu: () => import('../contextmenu'),
    D2ContextmenuList: () => import('../contextmenu/components/contentmenuList')
  },
  data () {
    return {
      contextmenuFlag: false,
      contentmenuX: 0,
      contentmenuY: 0,
      contextmenuListIndex: [
        { icon: 'times-circle', title: '关闭全部', value: 'all' }
      ],
      contextmenuList: [
        { icon: 'arrow-left', title: '关闭左侧', value: 'left' },
        { icon: 'arrow-right', title: '关闭右侧', value: 'right' },
        { icon: 'times', title: '关闭其它', value: 'other' },
        { icon: 'times-circle', title: '关闭全部', value: 'all' }
      ],
      tagName: '/index'
    }
  },
  computed: {
    ...mapState('d2admin/page', ['opened']),
    current: {
      get () {
        return this.$store.state.d2admin.page.current
      },
      set (v) {
        this.currentSet(v)
      }
    }
  },
  methods: {
    ...mapActions('d2admin/page', [
      'close',
      'closeLeft',
      'closeRight',
      'closeOther',
      'closeAll',
      'openedSort'
    ]),
    ...mapMutations('d2admin/page', [
      'currentSet'
    ]),
    showAllTips () {
      this.$confirm('此操作将关闭所有窗口, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.closeAll()
      }).catch(() => {})
    // closeAll
    },
    /**
     * @description 右键菜单功能点击
     */
    handleContextmenu (event) {
      let target = event.target
      // 解决 https://github.com/d2-projects/d2-admin/issues/54
      let flag = false
      if (target.className.indexOf('el-tabs__item') > -1) flag = true
      else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.contentmenuX = event.clientX
        this.contentmenuY = event.clientY
        this.tagName = target.getAttribute('aria-controls').slice(5)
        this.contextmenuFlag = true
      }
    },
    /**
     * @description 右键菜单的row-click事件
     */
    contextmenuClick (command) {
      this.handleControlItemClick(command, this.tagName)
    },
    /**
     * @description 接收点击关闭控制上选项的事件
     */
    handleControlItemClick (command, tagName = null) {
      if (tagName) {
        this.contextmenuFlag = false
      }
      const params = {
        pageSelect: tagName
      }
      switch (command) {
        case 'left':
          this.closeLeft(params)
          break
        case 'right':
          this.closeRight(params)
          break
        case 'other':
          this.closeOther(params)
          break
        case 'all':
          this.closeAll()
          break
        default:
          this.$message.error('无效的操作')
          break
      }
    },
    /**
     * @description 接收点击 tab 标签的事件
     */
    handleClick (tab, event) {
      // 找到点击的页面在 tag 列表里是哪个
      const page = this.opened.find(page => page.fullPath === tab.name)
      const { name, params, query } = page
      if (page) {
        this.$router.push({ name, params, query })
      }
    },
    /**
     * @description 点击 tab 上的删除按钮触发这里 首页的删除按钮已经隐藏 因此这里不用判断是 index
     */
    handleTabsEdit (tagName, action) {
      if (action === 'remove') {
        let needApproveClose = false
        // 判断当前页面关闭是否要二次提示
        let findItem = this.opened.find(item => item.fullPath === tagName)
        let {
          meta: { closeCheck = false }
        } = findItem
        if (closeCheck) {
          needApproveClose = true
        }
        if (needApproveClose) {
          this.$confirm('请确认是否关闭该页面？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.close({
                tagName
              })
            })
            .catch(() => {})
        } else {
          this.close({
            tagName
          })
        }
      }
    }
  },
  mounted () {
    const el = document.querySelectorAll(
      '.d2-multiple-page-sort .el-tabs__nav'
    )[0]
    Sortable.create(el, {
      onEnd: evt => {
        const { oldIndex, newIndex } = evt
        this.openedSort({ oldIndex, newIndex })
      }
    })
  }
}
</script>
<style lang="scss">
.d2-multiple-page-control-btn{
  .close{
    display: inline-block;
    padding: 3px 15px 7px 15px;
    border-radius: 2px 0px 0px 2px;
    border: 1px solid ;
    @include borderColor(bg);
    .fa-times-circle{
     @include color(tbc1);
     font-size: 14px;
     &:hover{
       @include color(main);
     }
    }
  }
  .expansion{
    display: inline-block;
    padding: 4.5px 6px 7px 6px;
        border-radius: 0px 2px 2px 0px;

    border: 1px solid ;
    border-left: 0px;
    @include borderColor(bg);
    .el-icon-caret-bottom{
     @include color(tbc1);
     font-size: 14px;
      &:hover{
       @include color(main);
     }
    }
  }
}
div.d2-multiple-page-control-content {
  div.el-tabs {
    div.el-tabs__nav-wrap {
      div.el-tabs__item {
         padding-right: 12px;
         &:hover{
          padding-right: 12px;
          padding-left: 12px;
          border-left: 1px solid;
         }
        &:nth-child(1) {
          border-left: none;
        }
        &:last-child {
          border-right: none;
        }

      }
    }
     &>.el-tabs__header .el-tabs__item .el-icon-close{
       width: 14px;

     }

  }
}

.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-container
  .d2-theme-container-main
  .d2-theme-container-main-header
  .d2-multiple-page-control-group
  .d2-multiple-page-control-btn
  .el-dropdown
  .el-button-group
  .el-button:hover {
  @include color(main);
}
</style>
