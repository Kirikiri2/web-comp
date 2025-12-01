const tplBrowser  = document.createElement('template');
tplBrowser .innerHTML = `
  <style>
    :host {
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .hotel-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(30, 58, 138, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
      animation: fadeIn .4s ease both;
    }

    .hotel-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(30, 58, 138, 0.15);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: none; }
    }

    .hotel-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }

    .hotel-info {
      padding: 20px;
    }

    .hotel-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .hotel-name {
      margin: 0;
      color: #1e3a8a;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .hotel-price {
      color: #3b82f6;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .hotel-price span {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: normal;
    }

    .hotel-location {
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
    }

    .hotel-rating {
      background: #3b82f6;
      color: white;
      padding: 4px 8px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .stars {
      color: #fbbf24;
      margin: 8px 0;
    }

    .amenities {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 12px;
    }

    .amenity-tag {
      background: #eff6ff;
      color: #1e40af;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
    }

    /* Стиль для списка */
    .list .hotel-card {
      display: flex;
      height: 200px;
    }

    .list .hotel-image {
      width: 280px;
      height: 100%;
      flex-shrink: 0;
    }

    .list .hotel-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #64748b;
      font-size: 1.125rem;
    }
  </style>

  <div id="container" class="grid"></div>
`;

class HotelBrowser extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(tplBrowser .content.cloneNode(true));
    this.container = this.shadowRoot.getElementById('container');
    this._hotels = [];
    this.view = 'grid';
  }

  set hotels(val) {
    this._hotels = Array.isArray(val) ? val : [];
    this._render();
  }

  connectedCallback() {
    if (this.hasAttribute('view')) this.view = this.getAttribute('view');
    this._applyView();
  }

  static get observedAttributes() { return ['view']; }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'view') {
      this.view = newVal;
      this._applyView();
    }
  }

  _applyView() {
    this.container.className = (this.view === 'list') ? 'list' : 'grid';
  }

  _render() {
    this.container.innerHTML = '';
    
    if (this._hotels.length === 0) {
      this.container.innerHTML = `
        <div class="no-results">
          <h3>Отели не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      `;
      return;
    }
    
    const df = document.createDocumentFragment();
    this._hotels.forEach((hotel, i) => {
      df.appendChild(this._createCard(hotel, i));
    });
    this.container.appendChild(df);
  }

  _createCard(hotel, index) {
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.dataset.id = hotel.id;
    card.style.animationDelay = (index * 30) + 'ms';

    // Создаём звёзды
    const stars = '★'.repeat(hotel.stars) + '☆'.repeat(5 - hotel.stars);
    
    // Создаём теги 
    const amenitiesHTML = hotel.amenities
      ? hotel.amenities.slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join('')
      : '';

    card.innerHTML = `
      <img class="hotel-image" src="${hotel.image}" alt="${hotel.name}" loading="lazy">
      <div class="hotel-info">
        <div class="hotel-header">
          <h3 class="hotel-name">${hotel.name}</h3>
          <div class="hotel-rating">${hotel.rating}</div>
        </div>
        
        <div class="hotel-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          ${hotel.city}, ${hotel.country}
        </div>
        
        <div class="stars" title="${hotel.stars} звёзд">${stars}</div>
        
        <div class="hotel-price">
          ${hotel.price.toLocaleString()} ₽
          <span>/ночь</span>
        </div>
        
        <div class="amenities">
          ${amenitiesHTML}
          ${hotel.amenities && hotel.amenities.length > 3 ? 
            `<span class="amenity-tag">+${hotel.amenities.length - 3}</span>` : ''}
        </div>
      </div>
    `;

    card.addEventListener('click', () => this._select(hotel.id));
    return card;
  }

  _select(id) {
    this.dispatchEvent(new CustomEvent('hotel-selected', {
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('hotel-browser', HotelBrowser);