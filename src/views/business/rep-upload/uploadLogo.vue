<template>
  <el-upload
  :style="`width:${measurement[0]};height:${measurement[1]}`"
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="httpRequest"
  >
    <img
      :style="`width:${measurement[0]};height:${measurement[1]}`"
      v-if="img"
      alt=""
      :src="img"
      class="avatar"
    />
    <em
      v-else
      class="el-icon-plus avatar-uploader-icon"
      :style="`width:${measurement[0]};height${measurement[1]};line-height:${measurement[1]}`"
    ></em>
  </el-upload>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      default: ''
    },
    measurement: {
      type: Array,
      default: () => ['200px', '70px']
    }
  },

  methods: {
    httpRequest (file) {
      this.$emit('httpRequest', file)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过 ${5}MB!`)
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: auto;
}
.avatar-uploader ::v-deep .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  // width: 200px;
  // height: 70px;
  // line-height: 70px;
  text-align: center;
}
.avatar {
  // width: 178px;
  // height: 178px;
  display: block;
}
</style>
