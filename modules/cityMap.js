class CityMap {
  constructor(string) {
    this.list = string
      .replace(/["'\n ]/g, '')
      .split(';')
      .slice(0, -1)
      .map(str => {
        const arr = str.split(",");
        return {
          city: arr[0],
          abbreviation: arr[1],
          latitude: parseFloat(arr[2]),
          longitude: parseFloat(arr[3])
        }
      });
  }

  getNorthernMostName() {
    const result = this.list.reduce(
      (northMostMap, currentMap) => {
        if (northMostMap.longitude > currentMap.longitude) {
          return northMostMap;
        } else return currentMap;
      }
    )
    return result.city;
  }

  getSouthernMostName() {
    const result = this.list.reduce(
      (northMostMap, currentMap) => {
        if (northMostMap.longitude < currentMap.longitude) {
          return northMostMap;
        } else return currentMap;
      }
    )
    return result.city;
  }
  getEasternMostName() {
    const result = this.list.reduce(
      (northMostMap, currentMap) => {
        if (northMostMap.latitude > currentMap.latitude) {
          return northMostMap;
        } else return currentMap;
      }
    )
    return result.city;
  }

  getWesternMostName() {
    const result = this.list.reduce(
      (northMostMap, currentMap) => {
        if (northMostMap.latitude < currentMap.latitude) {
          return northMostMap;
        } else return currentMap;
      }
    )
    return result.city;
  }

  getNearestCity(longitude, latitude) {
    Number.prototype.toRad = function () { return this * Math.PI / 180; }
    const R = 6371; // km

    const result = this.list.map(currentMap => {

      const dLat = (currentMap.latitude - latitude).toRad();
      const dLon = (currentMap.longitude - longitude).toRad();
      const lat1 = currentMap.latitude.toRad();
      const lat2 = latitude.toRad();

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      console.log({ city: currentMap.city, distance: d });
      return { city: currentMap.city, distance: d };
    }).reduce(
      (nearestMap, currentMap) => {
        if (nearestMap.distance < currentMap.distance) {
          return nearestMap;
        } else return currentMap;
      }
    );
    return result.city;
  }

  getStates() {
    function unique(arr) {
      return Array.from(new Set(arr));
    };
    return unique(this.list
      .map(currentMap => currentMap.abbreviation)
    ).join(' ');
  };
}

export { CityMap };