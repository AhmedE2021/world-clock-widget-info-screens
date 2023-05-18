import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { analogClockSvg } from "../../icons/analog-clock";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../city-search/city-search"
import { City } from "../../interfaces";
import { homeIconSvg } from "../../icons/home-icon";
import { backgroundMapSvg } from "../../icons/backgroundMap";


declare global {
  interface Window {
    colibo: any;
  }
}


interface ColiboInfoscreensWorldClockWidgetConfiguration {
  cities: {
    countryCode: any;
    name: string;
    timezone: string;
  }[];
}


@customElement("colibo-infoscreens-world-clock-widget")
export class ColiboInfoscreensWorldClockWidgetElement extends LitElement {
  static styles = [
    css`
    :host {
      display: flex;
      justify-content: space-between;
      padding: 0 !important;
      overflow: hidden;
      font-family: var(--colibo-font-family), Helvetica;
      background-color: #ffffff;
      width: 100vw;
      height: 100vh;
    }
    .clocks-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      background-repeat: no-repeat;
  background-position: center;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    .clock {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border-radius: 4px;
      width: calc(80% / 4); /* Subtracting the gap from the width */
    }
    .analog-clock__circle {
      stroke: black;
      fill: none;
    }
    .analog-clock__hand {
      stroke-linecap: round;
      
    }
    .analog-clock__hand, .circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform-origin: 50% 50%;
    }
    .country-flag {
      height: 0.7em;
      margin-right: 5px;
      vertical-align: baseline;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
    .clock-svg {
      margin-bottom: 1px;
      filter: drop-shadow(0 0 16px rgba(0,0,0,.1));
    }
    h3, p {
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    h3 {
      font-size: calc(var(--clock-size) * 0.1);
    }
    p{
      font-size: calc(var(--clock-size) * 0.09);
    }
    .home-icon svg {
      height: 1em;
      width: 1em;
      position: relative;
      top: 3.5px;
    }
    .city-info {
      display: flex;
      align-items: center;
    }
    .home-icon {
      margin-right: 5px;
    }
    
    @media (max-width: 2169px) {
      .clock {
        width: calc(80% / 3);
      }
    }
    
    @media (max-width: 1200px) {
      .clock {
        width: calc(80% / 2);
      }
    } 
    `,
  ];


  private _conf: ColiboInfoscreensWorldClockWidgetConfiguration = {
    cities: [],
  };


  @property({ type: Object })
  get configuration(): ColiboInfoscreensWorldClockWidgetConfiguration {
    return this._conf;
  }


  set configuration(newVal: ColiboInfoscreensWorldClockWidgetConfiguration) {
    this._conf = newVal;
  }

  @property({ type: String }) backgroundMapSvgDataUrl = '';


// This function is called when the element is connected to the DOM.
// It starts the clock updating process and adds a listener to the window resize event.
  connectedCallback() {
  super.connectedCallback();
  const backgroundMapSvgString = backgroundMapSvg(); // Replace with your actual function
  const encodedBackgroundMapSvg = encodeURIComponent(backgroundMapSvgString);
  this.backgroundMapSvgDataUrl = `url("data:image/svg+xml,${encodedBackgroundMapSvg}")`;
  this.updateTime();
  window.addEventListener('resize', () => {
    this.requestUpdate();
  });
}


// This function is responsible for updating the time on the clock.
// It does this by calling the updateClockHands function and then requesting an update.
updateTime() {
  this.updateClockHands();
  this.requestUpdate();
  setTimeout(() => this.updateTime(), 1000);
}


  // This function calculates the size of the clock based on the number of cities and the window size.
  calculateClockSize() {
    const clockCount = this.configuration.cities?.length || 1;
    let maxClocksPerRow = 4;
    if (window.innerWidth < 2169) {
      maxClocksPerRow = 3;
    }
    if (window.innerWidth < 1200) {
      maxClocksPerRow = 2;
    }
    const numberOfRows = Math.ceil(clockCount / maxClocksPerRow);
    const availableWidth = window.innerWidth / maxClocksPerRow;
    const availableHeight = window.innerHeight / numberOfRows;
    const clockSize = Math.min(availableWidth, availableHeight) * 0.70;
    return { width: clockSize, height: clockSize };
  }
  
  // This function checks if it is currently night time in a given timezone.
  isNightTime(timezone: string): boolean {
    const localTime = new Date().toLocaleString("en-US", { timeZone: timezone });
    const localDate = new Date(localTime);
    const hour = localDate.getHours();
    return hour >= 18 || hour < 6;
  }

// This function updates the position of the clock hands based on the current time in each city.
  updateClockHands() {
    this.configuration.cities?.forEach((city, index) => {
      const localTime = new Date().toLocaleString("en-US", { timeZone: city.timezone });
      const localDate = new Date(localTime);
      const hours = localDate.getHours() % 12;
      const minutes = localDate.getMinutes();
      const seconds = localDate.getSeconds();
      const hourRotation = (360 / 12) * hours + (360 / 12) * (minutes / 60);
      const minuteRotation = (360 / 60) * minutes;
      const secondRotation = (360 / 60) * seconds;
      const clockSvg = this.shadowRoot?.querySelector(`#clock-${index}`);
      if (clockSvg) {
        const hourHand = clockSvg.querySelector("#hour-hand");
        const minuteHand = clockSvg.querySelector("#minute-hand");
        const secondHand = clockSvg.querySelector("#second-hand");
        if (hourHand && minuteHand && secondHand) {
          (hourHand as HTMLElement).style.transform = `rotate(${hourRotation}deg)`;
          (minuteHand as HTMLElement).style.transform = `rotate(${minuteRotation}deg)`;
          (secondHand as HTMLElement).style.transform = `rotate(${secondRotation}deg)`;
        }
      }
    });
  }

// This function is called when a new city is added.
// It adds the city to the configuration and requests an update.
  addCity(e: CustomEvent) {
    const city = e.detail as City;
    this.configuration.cities.push(city);
    this.requestUpdate();
  }
  
// This function is responsible for rendering the element.
// It calculates the size of the clock and then renders a clock for each city in the configuration.
  render() {
    const { width, height } = this.calculateClockSize();
    const clockSize = Math.min(width, height);
    const backgroundMapSvgString = backgroundMapSvg(); // Returns your SVG as a string
const encodedBackgroundMapSvg = encodeURIComponent(backgroundMapSvgString);
this.backgroundMapSvgDataUrl = `url("data:image/svg+xml,${encodedBackgroundMapSvg}")`;

return html`
<style>
  :host {
    --clock-size: ${clockSize}px;
    --background-map: ${this.backgroundMapSvgDataUrl};
  }
</style>
<div class="clocks-container" style="background-image: var(--background-map);">
  ${this.configuration.cities?.map((city, index) =>
    this.renderClock(city, index, width, height, true))}
</div>
`;
}

  // This function renders a single clock for a given city.
// It determines the colors to use based on whether it is currently night time in the city.
  renderClock(city: { countryCode: any; name: any; timezone: any; }, index: unknown, width: number, height: number, isSmall: boolean) {
    const isNight = this.isNightTime(city.timezone);
    const circleColor = isNight ? "#29292d" : "#ffffff";
    const hourMinuteHandColor = isNight ? "#cccccd" : "black";
    const secondHandColor = isNight ? "#f2a43a" : "#e85d5e";
    const hourNumbersColor = isNight ? "#ffffff" : "black";
    const pinColor = isNight ? "#cccccd" : "black";
    const pinInnerColor = isNight ? "#29292d" : "#ffffff";
    const localTime = new Date().toLocaleString("en-US", { timeZone: city.timezone });
    const localDate = new Date(localTime);
    const formattedTime = localDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, weekday: 'short' });
    const flagUrl = city.countryCode ? `https://flagcdn.com/${city.countryCode.toLowerCase()}.svg` : '';
    const homeIcon = index === 0 ? html`<span class="home-icon">${unsafeSVG(homeIconSvg())}</span>` : '';

    return html`
  <div class="clock ${isSmall ? 'small-clock' : ''}">
    <div id="clock-${index}" class="clock-svg">${unsafeSVG(analogClockSvg(width, height, circleColor, hourMinuteHandColor, secondHandColor, hourNumbersColor, pinColor, pinInnerColor))}</div>
    <h3 class="city-info">${homeIcon} <img src="${flagUrl}" class="country-flag" alt="${city.name}"> ${city.name}</h3>
    <p>${formattedTime}</p>
  </div>`;
}
 
}
