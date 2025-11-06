/**
 * German Postal Code Zones based on Wikipedia
 * https://en.wikipedia.org/wiki/Postal_codes_in_Germany
 */

export interface PostalZone {
  zone: number
  name: string
  ranges: { min: number; max: number }[]
  tagName: string
}

export const GERMAN_POSTAL_ZONES: PostalZone[] = [
  {
    zone: 0,
    name: "Dresden, Chemnitz, Görlitz",
    ranges: [
      { min: 1000, max: 1999 },
      { min: 2000, max: 2999 },
      { min: 3000, max: 3999 },
      { min: 4000, max: 4999 },
      { min: 7000, max: 7999 },
      { min: 8000, max: 8999 },
      { min: 9000, max: 9999 }
    ],
    tagName: "zone0"
  },
  {
    zone: 1,
    name: "Berlin, Potsdam",
    ranges: [
      { min: 10000, max: 19999 }
    ],
    tagName: "zone1"
  },
  {
    zone: 2,
    name: "Hamburg, Bremen, Rostock",
    ranges: [
      { min: 20000, max: 29999 }
    ],
    tagName: "zone2"
  },
  {
    zone: 3,
    name: "Hannover, Braunschweig, Göttingen",
    ranges: [
      { min: 30000, max: 39999 }
    ],
    tagName: "zone3"
  },
  {
    zone: 4,
    name: "Düsseldorf, Köln, Dortmund",
    ranges: [
      { min: 40000, max: 49999 }
    ],
    tagName: "zone4"
  },
  {
    zone: 5,
    name: "Frankfurt, Kassel, Wiesbaden",
    ranges: [
      { min: 50000, max: 59999 },
      { min: 60000, max: 69999 }
    ],
    tagName: "zone5"
  },
  {
    zone: 6,
    name: "Nürnberg, Würzburg",
    ranges: [
      { min: 70000, max: 79999 },
      { min: 90000, max: 99999 }
    ],
    tagName: "zone6"
  },
  {
    zone: 7,
    name: "Stuttgart, Karlsruhe",
    ranges: [
      { min: 70000, max: 79999 }
    ],
    tagName: "zone7"
  },
  {
    zone: 8,
    name: "München, Augsburg",
    ranges: [
      { min: 80000, max: 89999 }
    ],
    tagName: "zone8"
  },
  {
    zone: 9,
    name: "Nürnberg, Regensburg",
    ranges: [
      { min: 90000, max: 99999 }
    ],
    tagName: "zone9"
  }
]

/**
 * Get zone information from postal code
 */
export function getZoneFromPostalCode(postalCode: string): PostalZone | null {
  const code = parseInt(postalCode.replace(/\s/g, ''))
  
  if (isNaN(code)) {
    return null
  }

  for (const zone of GERMAN_POSTAL_ZONES) {
    for (const range of zone.ranges) {
      if (code >= range.min && code <= range.max) {
        return zone
      }
    }
  }

  return null
}

/**
 * Get tag name for a postal code
 */
export function getTagNameFromPostalCode(postalCode: string): string | null {
  const zone = getZoneFromPostalCode(postalCode)
  return zone ? zone.tagName : null
}
