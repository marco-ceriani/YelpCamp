
var NodeGeocoder = require('node-geocoder')

var OpenStreetMapLocator = function (options) {
    this.geocoder = NodeGeocoder({
        provider: 'openstreetmap'
    })
    this.zoom = 10
}

OpenStreetMapLocator.prototype.getMapUrl = function (lat, lon, zoom) {
    url = "https://www.openstreetmap.org/export/embed.html?"
    scale = 1 / (zoom || this.zoom)
    url += 'bbox=' + (lon - scale)
    url += '%2C' + (lat - scale)
    url += '%2C' + (lon + scale)
    url += '%2C' + (lat + scale)
    url += '&layer=mapnik&marker=' + lat + '%2C' + lon
    return url
}

OpenStreetMapLocator.prototype.getMapLink = function (lat, lon) {
    link = "https://www.openstreetmap.org/?mlat=" + lat + "&amp;mlon=" + lon
    link += "#map=15/" + lat + "/" + lon
    return link
}

OpenStreetMapLocator.prototype.search = function (location, maxResults) {
    return this.geocoder.geocode({
        q: location,
        limit: maxResults || 5
    })
}

OpenStreetMapLocator.prototype.reverse = function (lat, lon, zoom = 0) {
    return this.geocoder.reverse({
        lat: lat,
        lon: lon,
        zoom: zoom
    })
}

function toGeoPoint(coordinates) {
    if (coordinates) {
        return {
            type: 'Point',
            coordinates: [coordinates.longitude, coordinates.latitude]
        }
    } else {
        return null
    }
}

OpenStreetMapLocator.prototype.decode = async function (value) {
    if (value === undefined || value === null) {
        return value;
    }
    if (typeof value === 'string' || value instanceof String) {
        const results = await this.search(value, 1);
        if (results && results.length > 0) {
            return {
                textual: value,
                geo: toGeoPoint(results[0])
            }
        }
    } else {
        if (value.textual && value.geo === undefined) {
            const results = await this.search(value.textual, 1);
            value.geo = toGeoPoint(results[0]);
        }
        return value;
    }
}

module.exports = function (options = {}) {
    let provider = options.provider || 'openstreetmap'
    if (provider !== 'openstreetmap') {
        throw "Invalid provider"
    }
    return new OpenStreetMapLocator(options)
}
