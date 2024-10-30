// editor工具栏
export const toolbarConfig = {
  excludeKeys: ["insertImage",'insertVideo', 'uploadVideo', 'group-video', "fullScreen", "emotion", "insertTable", "editLink", "insertLink", 'codeBlock']
}
// editor模式
export const mode = 'default' // or 'simple'
// 表单校验
export const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 50, message: '长度不超过50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'change' }
  ],
  compId: [
    { required: true, message: '请输入基金公司', trigger: 'blur' }
  ]
}

