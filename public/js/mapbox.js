/* eslint-disable */

const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamVzdXNnYXJ6YSIsImEiOiJjazF0bHI5OXMwczM0M2JwcXR0NDQ1ODYxIn0.RIkp6YoABuEcyFg-qMYFxA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jesusgarza/ck1tm1h0160081clh5235e4m3',
    scrollZoom: false
    // center: [-118.116579, 34.111692],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add Popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};

export { displayMap as default };
