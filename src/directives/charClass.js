const charClass = {
  bind(el, { value }) {
    console.log(value)
    if (value && value.includes('-')) {
      el.classList.add('green');
    } else if (value === null || value === '0' || value === 0) {
      el.classList.add('nine');
    } else {
      el.classList.add('red');
    }
    // el.innerText = value;
  },
  update(el, { value }) {
    if (value && value.includes('-') ) {
      el.classList.remove('red', 'nine');
      el.classList.add('green');
    } else if (value === null|| value === '0' || value === 0) {
      el.classList.remove('green', 'red');
      el.classList.add('nine');
    } else {
      el.classList.remove('green', 'nine');
      el.classList.add('red');
    }
  }
}


export default charClass

