
/*
  Мини SPA для Telegram WebApp — Business design.
  Хранит данные в localStorage и интегрируется с Telegram.WebApp
*/

const TG = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

function el(id){return document.getElementById(id)}
function qs(sel){return document.querySelector(sel)}

const state = {
  bookings: JSON.parse(localStorage.getItem('bookings') || '[]'),
  profile: JSON.parse(localStorage.getItem('profile') || '{}')
}

// --- Router & rendering ---
function setActiveBtn(id){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'))
  const btn = el(id)
  if(btn) btn.classList.add('active')
}

function render(templateId){
  const tpl = document.getElementById(templateId)
  const main = el('main')
  main.innerHTML = ''
  main.appendChild(tpl.content.cloneNode(true))
  attachHandlers(templateId)
}

function attachHandlers(templateId){
  if(templateId === 'tpl-home'){
    el('hero-book').addEventListener('click', ()=>navigateTo('tpl-book'))
    el('hero-info').addEventListener('click', ()=>alert('Мини-приложение для записи клиентов\nБизнес-дизайн — готово к интеграции.'))
  }
  if(templateId === 'tpl-book'){
    const form = el('form-book')
    form.addEventListener('submit', e=>{
      e.preventDefault()
      createBooking()
    })
    el('cancel-book').addEventListener('click', ()=>navigateTo('tpl-home'))
  }
  if(templateId === 'tpl-my'){
    renderBookings()
  }
  if(templateId === 'tpl-profile'){
    const f = el('form-profile')
    el('fullname').value = state.profile.fullname || ''
    el('phone').value = state.profile.phone || ''
    el('email').value = state.profile.email || ''
    f.addEventListener('submit', e=>{e.preventDefault(); saveProfile() })
  }
}

function navigateTo(templateId){
  const map = {
    'tpl-home':'btn-home',
    'tpl-book':'btn-book',
    'tpl-my':'btn-my',
    'tpl-profile':'btn-profile'
  }
  render(templateId)
  setActiveBtn(map[templateId])
}

// --- Bookings management ---
function createBooking(){
  const service = el('service').value
  const date = el('date').value
  const time = el('time').value
  const comment = el('comment').value
  if(!service || !date || !time){ alert('Заполните услугу, дату и время.'); return }
  const id = 'b_' + Date.now()
  const booking = { id, service, date, time, comment, created: new Date().toISOString() }
  state.bookings.push(booking)
  localStorage.setItem('bookings', JSON.stringify(state.bookings))
  // Отправляем данные боту через Telegram Web App (если доступно)
  if(TG){
    try{
      const payload = { action:'new_booking', booking }
      TG.sendData(JSON.stringify(payload))
    }catch(e){ console.warn('TG.sendData failed', e) }
  }
  alert('Запись создана')
  navigateTo('tpl-my')
}

function renderBookings(){
  const list = el('bookings-list')
  list.innerHTML = ''
  if(state.bookings.length === 0){ list.innerHTML = '<div class="muted">У вас пока нет записей</div>'; return }
  state.bookings.slice().reverse().forEach(b=>{
    const div = document.createElement('div')
    div.className = 'book-item'
    div.innerHTML = `
      <div class="book-meta">
        <div class="book-date">${b.date} · ${b.time}</div>
        <div class="book-service">${b.service}</div>
        <div class="book-comment">${b.comment || ''}</div>
      </div>
      <div class="book-action">
        <button class="secondary" data-id="${b.id}" data-act="edit">Изменить</button>
        <button class="secondary" data-id="${b.id}" data-act="delete">Отменить</button>
      </div>
    `
    list.appendChild(div)
  })
  list.querySelectorAll('button').forEach(btn=>btn.addEventListener('click', e=>{
    const id = btn.dataset.id, act = btn.dataset.act
    if(act==='delete'){ deleteBooking(id) }
    if(act==='edit'){ editBooking(id) }
  }))
}

function deleteBooking(id){
  if(!confirm('Удалить запись?')) return
  state.bookings = state.bookings.filter(b=>b.id !== id)
  localStorage.setItem('bookings', JSON.stringify(state.bookings))
  renderBookings()
}

function editBooking(id){
  const b = state.bookings.find(x=>x.id===id)
  if(!b) return alert('Запись не найдена')
  navigateTo('tpl-book')
  el('service').value = b.service
  el('date').value = b.date
  el('time').value = b.time
  el('comment').value = b.comment || ''
  // при сохранении — перезаписать существующую запись: простая логика: удалить старую, создать новую
  const form = el('form-book')
  form.removeEventListener('submit', createBooking)
  form.addEventListener('submit', function handler(e){
    e.preventDefault()
    // delete old
    state.bookings = state.bookings.filter(x=>x.id !== id)
    localStorage.setItem('bookings', JSON.stringify(state.bookings))
    // create new
    createBooking()
    form.removeEventListener('submit', handler)
  })
}

// --- Profile ---
function saveProfile(){
  const fullname = el('fullname').value.trim()
  const phone = el('phone').value.trim()
  const email = el('email').value.trim()
  if(!fullname || !phone){ alert('Укажите, пожалуйста, имя и телефон.'); return }
  state.profile = { fullname, phone, email }
  localStorage.setItem('profile', JSON.stringify(state.profile))
  alert('Профиль сохранён')
}

// --- Init ---
function initUI(){
  // nav buttons
  el('btn-home').addEventListener('click', ()=>navigateTo('tpl-home'))
  el('btn-book').addEventListener('click', ()=>navigateTo('tpl-book'))
  el('btn-my').addEventListener('click', ()=>navigateTo('tpl-my'))
  el('btn-profile').addEventListener('click', ()=>navigateTo('tpl-profile'))

  // initial view
  navigateTo('tpl-home')
  // footer telegram info
  const infoEl = el('tg-info')
  if(TG){
    infoEl.textContent = 'Telegram: подключено'
    try{
      // Настроим главную кнопку WebApp, если доступна
      const button = TG.MainButton
      button.setText('Записаться')
      button.show()
      button.onClick(()=>navigateTo('tpl-book'))
    }catch(e){ console.warn('TG MainButton not available', e) }
  }else{
    infoEl.textContent = 'Telegram: не подключено — запускайте внутри Telegram'
  }
}

document.addEventListener('DOMContentLoaded', initUI)
