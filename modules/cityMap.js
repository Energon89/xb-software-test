export class CityMap {
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
  //task 1
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
  //task 2
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
  //task 3
  getStates() {
    function unique(arr) {
      return Array.from(new Set(arr));
    };
    return unique(this.list
      .map(currentMap => currentMap.abbreviation)
    ).join(' ');
  };
  //advanced task
  getCyties(state) {
    let cities = [];
    this.list.map(currentMap => {
      if (currentMap.abbreviation === state) {
        return cities.push(currentMap);
      }
    });
    return cities;
  }

  getNewList(city, state, latitude, longitude) {
    const newList = this.list;
    newList.push({
      city: city,
      abbreviation: state,
      latitude: latitude,
      longitude: longitude
    });
    return newList
      .map(elem => {
        return `${elem.city}, ${elem.abbreviation}, ${elem.latitude}, ${elem.longitude};
      `;
      })
      .join(' ');
  }

  //Super advanced task
  getSales(abbr) {
    const arr = this.list.map(currentMap => currentMap.abbreviation);
    let counts = {};

    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts[abbr];
  }

  getDataWebix() {
    let data = [];
    this.list.map(currentMap => {
      data.push({ abbreviation: currentMap.abbreviation, sales: this.getSales(currentMap.abbreviation) });
    });

    function uniqBy(a, key) {
      return [
        ...new Map(
          a.map(x => [key(x), x])
        ).values()
      ]
    };

    return uniqBy(data, it => it.abbreviation);
  }
}
