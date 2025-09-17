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

    /* Кнопка меню */
    .menu-btn {
      font-size: 28px;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      outline: none;
    }

    /* Всплывающее меню */
    .nav-popup {
      display: none;
      position: absolute;
      top: 55px;
      right: 15px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0
