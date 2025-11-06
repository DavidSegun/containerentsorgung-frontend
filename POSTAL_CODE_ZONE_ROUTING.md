# Postal Code Zone Routing System ✅

## Overview

Implemented a German postal code-based zone routing system that:
1. Maps postal codes to zones (0-9) based on Wikipedia
2. Routes users to products filtered by zone tags
3. Uses Medusa product tags for zone-based filtering

## How It Works

### 1. User Flow
1. User visits `/container-bestellen`
2. Enters postal code (e.g., "10115" for Berlin)
3. System determines zone (Zone 1 for Berlin)
4. Fetches tag ID for "zone1"
5. Routes to `/products?tag_id={tagId}&zone=1`
6. Shows only products tagged with that zone

### 2. Zone Mapping (Based on Wikipedia)

| Zone | Postal Range | Cities | Tag Name |
|------|--------------|--------|----------|
| 0 | 01000-09999 | Dresden, Chemnitz, Görlitz | zone0 |
| 1 | 10000-19999 | Berlin, Potsdam | zone1 |
| 2 | 20000-29999 | Hamburg, Bremen, Rostock | zone2 |
| 3 | 30000-39999 | Hannover, Braunschweig | zone3 |
| 4 | 40000-49999 | Düsseldorf, Köln, Dortmund | zone4 |
| 5 | 50000-69999 | Frankfurt, Kassel, Wiesbaden | zone5 |
| 6 | 70000-79999, 90000-99999 | Nürnberg, Würzburg | zone6 |
| 7 | 70000-79999 | Stuttgart, Karlsruhe | zone7 |
| 8 | 80000-89999 | München, Augsburg | zone8 |
| 9 | 90000-99999 | Nürnberg, Regensburg | zone9 |

## Files Created

### 1. `/src/lib/helpers/postal-code-zones.ts`
- Contains zone definitions
- `getZoneFromPostalCode()` - Maps postal code to zone
- `getTagNameFromPostalCode()` - Gets tag name from postal code

### 2. `/src/lib/data/tags.ts`
- `getProductTags()` - Fetches all product tags
- `getTagIdByName()` - Gets tag ID by name
- `getZoneTagIdFromPostalCode()` - Complete flow from postal code to tag ID

### 3. Updated `/src/components/sections/ContainerOrderingHero/ContainerOrderingHero.tsx`
- Integrated postal code zone routing
- Added loading state
- Error handling with toast notifications
- Routes to products with tag filter

## Setup Required

### 1. Create Zone Tags in Medusa Admin

You need to create product tags in Medusa admin:

```
zone0
zone1
zone2
zone3
zone4
zone5
zone6
zone7
zone8
zone9
```

**Steps:**
1. Go to Medusa Admin
2. Navigate to Products → Product Tags
3. Create tags: `zone0`, `zone1`, `zone2`, etc.
4. Tag your products with appropriate zones

### 2. Tag Your Products

For each product:
1. Edit product in admin
2. Add appropriate zone tag(s)
3. Example: Container for Berlin → Add "zone1" tag

### 3. Products Page Must Support Tag Filtering

The products page at `/products` must accept `tag_id` query parameter:

```tsx
// In your products page
const searchParams = useSearchParams()
const tagId = searchParams.get('tag_id')

// Use tagId in product query
const products = await getProducts({ tag_id: tagId })
```

## API Reference

### Medusa API Endpoints Used

1. **List Product Tags**:
```
GET /store/product-tags
```

2. **List Products by Tag**:
```
GET /store/products?tag_id={tagId}
```

## Testing

### Test Postal Codes

- **10115** → Zone 1 (Berlin)
- **20095** → Zone 2 (Hamburg)
- **40210** → Zone 4 (Düsseldorf)
- **80331** → Zone 8 (München)

### Test Flow

1. Go to `http://localhost:3000/pl/container-bestellen`
2. Enter postal code: `10115`
3. Click "SUCHEN"
4. Should route to: `/pl/products?tag_id={zone1_id}&zone=1`
5. Should show only products tagged with "zone1"

## Error Handling

- **Invalid postal code**: Shows error toast
- **Zone not found**: Shows error with zone info
- **No tag found**: Shows error that no products available for zone
- **Loading state**: Shows spinner during search

## Benefits

✅ **Automatic zone detection** from postal code
✅ **Product filtering** by delivery zone
✅ **Scalable** - Easy to add/modify zones
✅ **User-friendly** - Clear error messages
✅ **Based on official** German postal code system
✅ **Tag-based** - Uses Medusa's built-in tagging

## Next Steps

1. **Create zone tags** in Medusa admin (zone0-zone9)
2. **Tag products** with appropriate zones
3. **Update products page** to filter by tag_id parameter
4. **Test** with different postal codes
5. **Optional**: Add zone info display on product pages
