<template>
  <d2-container>
      <div style="border: 1px solid #ccc">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 200px; overflow-y: auto"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
          @onChange="onChange"
        />
      </div>
      <div >
        <div class="mixinbox" v-html="setHtml"></div>
      </div>
  </d2-container>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import errorPng from '@/assets/images/404.png'
import { toolbarConfig, mode } from './config'

export default {
  components: { Editor, Toolbar },
  data() {
    return {
      setHtml: '',
      editorConfig: false,
      toolbarConfig,
      mode,
      html: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      editor: null,
      errorPng: errorPng
    }
  },
  watch: {
    html: {
      handler() {
        let newHtml = this.editor.getHtml()
        this.setHtml = newHtml.replace(/<p>/g, '').replace(/<\/p>/g ,'</br>')
        console.log(this.setHtml)
      }
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor)
    },
    onChange(editor) {
    },
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.mixinbox {
  height: 65px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  display: -webkit-box;
  /*! autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  ::v-deep p {
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    display: -webkit-box;
    /*! autoprefixer: ignore next */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}
</style>
