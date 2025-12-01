const tplDetails = document.createElement('template');
tplDetails.innerHTML = `
  <style>
    :host {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      font-family: sans-serif;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.4);
      opacity: 0;
      pointer-events: none;
      transition: opacity .25s ease;
    }
    .panel {
      background: #fff;
      width: 90%;
      max-width: 800px;
      max-height: 90%;
      overflow: auto;
      border-radius: 12px;
      transform: translateY(30px) scale(0.98);
      opacity: 0;
      transition: transform .3s cubic-bezier(.18, .89, .32, 1.28), opacity .25s ease;
    }
    :host([open]) {
      display: flex;
    }
    :host([open]) .panel {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    :host([open]) .backdrop {
      opacity: 1;
      pointer-events: auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
    }
    #close {
      padding: 6px 10px;
      border: none;
      border-radius: 6px;
      background: #eee;
      cursor: pointer;
    }
    #close:hover {
      background: #ddd;
    }
    img.big {
      width: 100%;
      height: 320px;
      object-fit: cover;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
    #params, #description {
      padding: 12px 16px;
      line-height: 1.45;
    }
    #description {
      border-top: 1px solid #eee;
      white-space: pre-line;
    }
  </style>

  <div class="backdrop"></div>

  <div class="panel">
    <div class="header">
      <h3 id="title"></h3>
      <button id="close">Закрыть</button>
    </div>

    <img id="img" class="big" src="">

    <div id="params"></div>
    <div id="description"></div>
  </div>
`;

class ItemDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(tplDetails.content.cloneNode(true));
    this.$ = sel => this.shadowRoot.querySelector(sel);
  }

  connectedCallback() {
    this.$('#close').addEventListener('click', () => this._close());
    this.$('.backdrop').addEventListener('click', () => this._close());
  }

  showItem(id, allItems) {
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    this.$('#title').textContent = item.name || 'Без названия';
    this.$('#img').src = item.image || '';
    this.$('#description').textContent = item.description || 'Описание отсутствует';

    const amenities = item.amenities && item.amenities.length
      ? item.amenities.join(', ')
      : '—';

    this.$('#params').innerHTML = `
      <div><b>Тип:</b> ${item.type || '—'}</div>
      <div><b>Город:</b> ${item.city || '—'}</div>
      <div><b>Страна:</b> ${item.country || '—'}</div>
      <div><b>Звёзды:</b> ${item.stars || '—'}</div>
      <div><b>Рейтинг:</b> ${item.rating || '—'}</div>
      <div><b>Цена:</b> ${item.price || '—'} ₽</div>
      <div><b>Вместимость:</b> ${item.capacity || '—'} чел.</div>
      <div><b>Площадь номера:</b> ${item.roomSize || '—'} м²</div>
      <div><b>Удобства:</b> ${amenities}</div>
    `;

    this.setAttribute('open', '');
  }

  _close() {
    this.removeAttribute('open');
  }
}

customElements.define('item-details', ItemDetails);
