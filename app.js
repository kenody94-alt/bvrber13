<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <title>Запись — Мини-приложение</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #fafafa;
    }

    /* Верхняя панель */
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      background: #222;
      color: #fff;
      position: relative;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-text .title {
      font-size: 16px;
      font-weight: bold;
    }
    .brand-text .subtitle {
      font-size: 12px;
      opacity: 0.7;
    }

   function initUI(){
  // кнопки меню с закрытием popup
  el('btn-home').addEventListener('click', ()=>{ navigateTo('tpl-home'); closeMenu() })
  el('btn-book').addEventListener('click', ()=>{ navigateTo('tpl-book'); closeMenu() })
  el('btn-my').addEventListener('click', ()=>{ navigateTo('tpl-my'); closeMenu() })
  el('btn-profile').addEventListener('click', ()=>{ navigateTo('tpl-profile'); closeMenu() })

  navigateTo('tpl-home')

  const infoEl = el('tg-info')
  if(infoEl){
    if(TG){
      infoEl.textContent = 'Telegram: подключено'
      try{
        const button = TG.MainButton
        button.setText('Записаться')
        button.show()
        button.onClick(()=>navigateTo('tpl-book'))
      }catch(e){ console.warn('TG MainButton not available', e) }
    }else{
      infoEl.textContent = 'Telegram: не подключено — запускайте внутри Telegram'
    }
  }
}

function closeMenu(){
  const navPopup = el('nav-popup')
  if(navPopup) navPopup.style.display = 'none'
}
