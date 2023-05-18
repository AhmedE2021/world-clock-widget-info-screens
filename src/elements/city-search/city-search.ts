import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";


declare global {
  interface Window {
    colibo: any;
  }
}


interface City {
  name: string;
  timezone: string;
  countryCode: string;
}


interface CitySearchConfiguration {
  cities: City[];
}


@customElement("city-search")
export class CitySearchElement extends LitElement {
  static styles = [
    css`
      .search-container {
        position: relative;
        margin: 0 2% 0 2%;
      }
      input[type="text"] {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        font-size: 26px;
      }
      ul {
        position: absolute;
        background-color: white;
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      li {
        padding: 8px 16px;
        cursor: pointer;
      }
      li:hover {
        background-color: #ddd;
      }
      .city-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 2% 0 2%;
        font-size: 20px;
      }
      .remove-button {
        color: red;
        cursor: pointer;
        font-size: 70px;
      }
    `,
  ];

  constructor() {
    super();
  }

  @property({ type: Array })
  private selectedCities: City[] = [];

  private _conf: CitySearchConfiguration = {
    cities: [
      { name: "Aarhus", timezone: "Europe/Copenhagen", countryCode: "DK" },
      { name: "New York", timezone: "America/New_York", countryCode: "US" },
      { name: "Sydney", timezone: "Australia/Sydney", countryCode: "AU" },
      { name: "Cairo", timezone: "Africa/Cairo", countryCode: "EG" },
      { name: "Tokyo", timezone: "Asia/Tokyo", countryCode: "JP" },
      { name: "Dubai", timezone: "Asia/Dubai", countryCode: "AE" },
      { name: "Berlin", timezone: "Europe/Berlin", countryCode: "DE" },
    ],
  };

  @property({ type: Object })
  get configuration(): CitySearchConfiguration {
    return this._conf;
  }


  set configuration(newVal: CitySearchConfiguration) {
    this._conf = newVal;
  }


  @query("input[type='text']")
  private inputElement!: HTMLInputElement;
  private filteredCities: City[] = [];

  // This function is triggered when the user types in the search input.
  // It filters the list of cities based on the user's input.
  private handleInput(e: Event) {
    try {
      const input = (e.target as HTMLInputElement).value.toLowerCase();
      this.filteredCities = this.configuration.cities.filter((city) =>
        city.name.toLowerCase().includes(input)
      );
      this.requestUpdate();
    } catch (error) {
      console.error('Error occurred while handling input:', error);
    }
  }


  // This function dispatches a custom event when a city is selected.
  // The selected city is passed as a detail of the event.
  private emitCitySelected(city: City) {
    const event = new CustomEvent("city-selected", { detail: city });
    this.dispatchEvent(event);
  }
  

  // This function is called when a city is selected from the dropdown.
  // It clears the search input and the filtered cities list, and dispatches the "city-selected" event.
  // If the selected city is not already in the selected cities list, it is added to the list. 
  private selectCity(city: City) {
    this.inputElement.value = '';
    this.filteredCities = [];
    this.emitCitySelected(city);
    if (!this.selectedCities.find(selectedCity => selectedCity.name === city.name)) {
      this.selectedCities = [...this.selectedCities, city];
    }
  }
  

  // This function is called when the remove button is clicked for a city.
  // It removes the city from the selected cities list.
  private removeCity(city: City) {
    this.selectedCities = this.selectedCities.filter(selectedCity => selectedCity.name !== city.name);
  }

  
  // This function is responsible for rendering the component.
  // It renders a search input, a dropdown list of filtered cities, and a list of selected cities.
  render() {
    return html`
      <div class="search-container">
        <input
          type="text"
          placeholder="Add city..."
          @input="${this.handleInput}"
        />
        ${this.filteredCities.length > 0
          ? html`
              <ul>
                ${this.filteredCities.map(
                  (city) => html`<li @click="${() => this.selectCity(city)}">${
                    city.name
                  }</li>`
                )}
              </ul>
            `
          : ""}
          <div>
          ${this.selectedCities.map(
            (city) => html`
              <div class="city-item">
                <span>${city.name}</span>
                <span class="remove-button" @click="${() => this.removeCity(city)}">-</span>
              </div>`
          )}
        </div>
      </div>
    `;
  }
}


