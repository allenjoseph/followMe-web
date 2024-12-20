import L from "leaflet";

export class FollowMap {
  centerMap: boolean = true;

  onLocation: (e: L.LatLng) => void;

  onLocationStop: () => void;

  private map: L.Map;

  private marker: L.Marker;

  private polyline: L.Polyline;

  private route: L.LatLng[] = [];

  constructor() {
    this.map = L.map("map").fitWorld();

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.map.locate({ setView: false, maxZoom: 18, watch: true });

    this.map.on("locationfound", this.onLocationFound.bind(this));
  }

  setRoute(route: L.LatLng[], finished = false) {
    this.route = route;

    this.updatePolyline();

    this.updateMarker(route[route.length - 1]);

    if (finished) {
      this.map.setView(this.polyline.getBounds().getCenter(), 15);
      this.map.stopLocate();
      setTimeout(() => this.onLocationStop(), 1000);
    }
  }

  private onLocationFound(e: L.LocationEvent) {
    this.route.push(e.latlng);

    this.updatePolyline();

    this.updateMarker(e.latlng);

    // center position in map
    if (this.centerMap) {
      this.map.setView(e.latlng, 18);
    }

    // emit location
    if (this.onLocation) {
      this.onLocation(e.latlng);
    }
  }

  private updatePolyline() {
    // if polyline is empty, create a new polyline
    if (!this.polyline) {
      this.polyline = L.polyline(this.route, {
        color: "blue",
        opacity: 0.5,
        weight: 8,
      }).addTo(this.map);
    } else {
      this.polyline.setLatLngs(this.route);
    }
  }

  private updateMarker(latlng: L.LatLng) {
    // if marker is empty, create a new marker
    if (!this.marker) {
      this.marker = L.marker(latlng, {
        icon: L.divIcon({
          html: '<i class="emoji" style="font-size: 28px;">🙈</i>',
          className: "custom-icon",
          iconAnchor: [14, 28],
          iconSize: [28, 28],
        }),
      }).addTo(this.map);
    } else {
      this.marker.setLatLng(latlng);
    }
  }
}
