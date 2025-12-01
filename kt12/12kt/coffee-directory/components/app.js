const tplApp = document.createElement('template');
tplApp.innerHTML = `
  <style>
    :host {
      display: block;
      padding: 16px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e8f4ff 100%);
      min-height: 100vh;
    }
    .app {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      padding: 20px;
      color: #1e3a8a;
    }
    .header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 300;
    }
    .header p {
      color: #475569;
      font-size: 1.1rem;
    }
  </style>

  <div class="app">
    <div class="header">
      <h1>Hotel Explorer</h1>
      <p>Найдите идеальный отель для вашего отдыха</p>
    </div>
    <hotel-controls></hotel-controls>
    <hotel-browser></hotel-browser>
    <item-details></item-details>
  </div>
`;

class HotelApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(tplApp.content.cloneNode(true));

    this.data = [];
    this.filtered = [];

    this.controls = this.shadowRoot.querySelector("hotel-controls");
    this.browser = this.shadowRoot.querySelector("hotel-browser");
    this.details = this.shadowRoot.querySelector("item-details"); // теперь корректно
  }

  connectedCallback() {
    fetch("data/hotels.json")
      .then(r => r.json())
      .then(json => {
        this.data = json;
        this.filtered = json.slice();
        this._renderBrowser();
      });

    this.shadowRoot.addEventListener("view-change", e => {
      this.browser.setAttribute("view", e.detail.view);
    });

    this.shadowRoot.addEventListener("sort-change", e => this._applySort(e.detail));
    this.shadowRoot.addEventListener("filter-change", e => this._applyFilter(e.detail));
    this.shadowRoot.addEventListener("stars-filter", e => this._applyStarsFilter(e.detail));
    this.shadowRoot.addEventListener("search-change", e => this._applySearch(e.detail));

    this.shadowRoot.addEventListener("hotel-selected", e => {
      this.details.showItem(e.detail.id, this.data); // теперь работает
    });
  }

  _renderBrowser() {
    this.browser.hotels = this.filtered;
  }

  _applySort({ by, dir }) {
    this.filtered.sort((a, b) => {
      let va = a[by];
      let vb = b[by];

      if (['price', 'rating', 'stars'].includes(by)) return dir === "asc" ? va - vb : vb - va;

      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();

      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    this._renderBrowser();
  }

  _applyFilter({ category }) {
    this.filtered = category ? this.data.filter(h => h.type === category) : this.data.slice();
    this._renderBrowser();
  }

  _applyStarsFilter({ stars }) {
    this.filtered = stars ? this.data.filter(h => h.stars == stars) : this.data.slice();
    this._renderBrowser();
  }

  _applySearch({ text }) {
    const t = (text || "").toLowerCase();
    this.filtered = this.data.filter(h =>
      h.name.toLowerCase().includes(t) ||
      h.city.toLowerCase().includes(t) ||
      (h.amenities && h.amenities.join(" ").toLowerCase().includes(t))
    );
    this._renderBrowser();
  }
}

customElements.define("hotel-app", HotelApp);
