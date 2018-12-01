
var NodeGeocoder = require('node-geocoder')

var OpenStreetMapLocator = function(options) {
    this.geocoder = NodeGeocoder({
        provider: 'openstreetmap'
    })
    this.zoom = 10
}

OpenStreetMapLocator.prototype.getMapUrl = function(lat, lon, zoom) {
    url = "https://www.openstreetmap.org/export/embed.html?"
    scale = 1 / (zoom || this.zoom)
    url += 'bbox=' + (lon - scale)
    url += '%2C' + (lat - scale)
    url += '%2C' + (lon + scale)
    url += '%2C' + (lat + scale)
    url += '&layer=mapnik&marker=' + lat + '%2C' + lon
    return url
}

OpenStreetMapLocator.prototype.getMapLink = function(lat, lon) {
    link = "https://www.openstreetmap.org/?mlat=" + lat + "&amp;mlon=" + lon
    link  += "#map=15/" + lat + "/" + lon
    return link
}

OpenStreetMapLocator.prototype.search = function(location, maxResults) {
    return this.geocoder.geocode({
        q: location,
        limit: maxResults || 5
    })
}

module.exports = function(provider, options) {
    if (provider !== 'openstreetmap') {
        throw "Invalid provider"
    }
    return new OpenStreetMapLocator(options)
}
