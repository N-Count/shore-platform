const limitLength = {
  inserted: function (el, binding) {
    let maxLength = binding.value || 20
    let input = el.querySelector('input')
    input.maxLength = maxLength
  }
}

export default limitLength

