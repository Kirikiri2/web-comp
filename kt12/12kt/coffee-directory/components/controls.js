const tplControls = document.createElement('template');
tplControls.innerHTML = `
  <style>
    :host {
      display: block;
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(30, 58, 138, 0.08);
    }

    .controls-panel {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
    }

    select, input {
      padding: 10px 14px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.95rem;
      color: #1e293b;
      background: white;
      min-width: 180px;
      transition: all 0.2s ease;
    }

    select:focus, input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }

    .view-buttons {
      display: flex;
      gap: 8px;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 10px;
    }

    .view-btn {
      padding: 8px 16px;
      border: none;
      background: none;
      border-radius: 8px;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s ease;
    }

    .view-btn.active {
      background: white;
      color: #1e40af;
      box-shadow: 0 2px 6px rgba(30, 58, 138, 0.1);
    }

    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 250px;
    }


    .search {
      width: 80%;
      padding-left: 40px;
    }

    @media (max-width: 768px) {
      .controls-panel {
        flex-direction: column;
        align-items: stretch;
      }
      
      select, input {
        width: 100%;
      }
    }
  </style>

  <div class="controls-panel">
    <!-- Поиск -->
    <div class="search-wrapper control-group">
      <label for="search">Поиск отелей</label>
      <input class="search" id="search" placeholder="Название, город или удобства...">
    </div>

    <!-- Сортировка -->
    <div class="control-group">
      <label for="sort">Сортировка</label>
      <select class="sort" id="sort">
        <option value="price:asc">Цена: по возрастанию</option>
        <option value="price:desc">Цена: по убыванию</option>
        <option value="rating:desc">Рейтинг: высокий → низкий</option>
        <option value="rating:asc">Рейтинг: низкий → высокий</option>
        <option value="stars:desc">Звёзды: больше → меньше</option>
        <option value="stars:asc">Звёзды: меньше → больше</option>
      </select>
    </div>

    <!-- Тип отеля -->
    <div class="control-group">
      <label for="type">Тип отеля</label>
      <select class="filter" id="type">
        <option value="">Все типы</option>
        <option value="Бутик-отель">Бутик-отель</option>
        <option value="Курортный">Курортный</option>
        <option value="Бизнес-отель">Бизнес-отель</option>
        <option value="Спа-отель">Спа-отель</option>
        <option value="Апартаменты">Апартаменты</option>
      </select>
    </div>

    <!-- Звёзды -->
    <div class="control-group">
      <label for="stars">Количество звёзд</label>
      <select class="stars-filter" id="stars">
        <option value="">Все звёзды</option>
        <option value="5">5 звёзд</option>
        <option value="4">4 звезды</option>
        <option value="3">3 звезды</option>
        <option value="2">2 звезды</option>
      </select>
    </div>

    <!-- Переключение вида -->
    <div class="control-group">
      <label>Вид отображения</label>
      <div class="view-buttons">
        <button class="view-btn active" data-view="grid">Плитка</button>
        <button class="view-btn" data-view="list">Список</button>
      </div>
    </div>
  </div>
`;

class HotelControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(tplControls.content.cloneNode(true));
  }

  connectedCallback() {
    const search = this.shadowRoot.querySelector('.search');
    const sort = this.shadowRoot.querySelector('.sort');
    const filter = this.shadowRoot.querySelector('.filter');
    const starsFilter = this.shadowRoot.querySelector('.stars-filter');
    const viewButtons = this.shadowRoot.querySelectorAll('.view-btn');

    // Поиск
    let searchTimer = null;
    search.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        this._emit('search-change', { text: search.value });
      }, 300);
    });

    // Сортировка
    sort.addEventListener('change', () => {
      const [by, dir] = sort.value.split(':');
      this._emit('sort-change', { by, dir });
    });

    // Фильтрация по типу
    filter.addEventListener('change', () => {
      this._emit('filter-change', { category: filter.value || null });
    });

    // Фильтрация по звёздам
    starsFilter.addEventListener('change', () => {
      this._emit('stars-filter', { stars: starsFilter.value || null });
    });

    // Переключение вида
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._emit('view-change', { view });
      });
    });
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('hotel-controls', HotelControls);