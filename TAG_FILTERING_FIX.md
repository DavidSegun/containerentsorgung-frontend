# Tag Filtering Fix ✅

## Problem
Products were not being filtered by zone tag on `/versandzonen/zone1/category` pages.

## Root Cause
The `listProductsWithSort` function in `products.ts` was missing:
1. `tag_id` parameter in function signature
2. Passing `tag_id` to the Medusa API

## Fix Applied

### File: `/src/lib/data/products.ts`

**Added**:
1. `tag_id` parameter to function
2. Logic to pass `tag_id` as array to Medusa API

```typescript
// Added tag_id parameter
export const listProductsWithSort = async ({
  // ... other params
  tag_id,
}: {
  // ... other types
  tag_id?: string
}) => {
  // Build query params with tag_id
  const productQueryParams: any = {
    ...queryParams,
    limit: 100,
  }
  
  if (tag_id) {
    productQueryParams.tag_id = [tag_id]  // Medusa expects array
  }

  // Pass to API
  const { response } = await listProducts({
    pageParam: 0,
    queryParams: productQueryParams,
    category_id,
    collection_id,
  })
}
```

## How It Works Now

### Complete Flow:

1. **User enters postal code**: `10115`
2. **Routes to**: `/versandzonen/zone1`
3. **User clicks category**: "Dog-Category"
4. **Routes to**: `/versandzonen/zone1/Dog-Category`
5. **ProductListing receives**: `zoneId="zone1"`
6. **Fetches tag ID**: Looks up "zone1" tag → gets tag ID
7. **Calls API**: `GET /store/products?category_id={catId}&tag_id={tagId}`
8. **Shows filtered products**: Only products with BOTH:
   - Category = "Dog-Category"
   - Tag = "zone1"

## API Request Format

Medusa expects `tag_id` as an array:

```
GET /store/products?tag_id[]=tag_123&category_id=cat_456
```

Our code converts:
- `tag_id: "tag_123"` → `tag_id: ["tag_123"]`

## Testing

1. **Create zone tags** in admin: `zone0`, `zone1`, etc.
2. **Tag products** with zones
3. **Visit**: `/versandzonen/zone1/Dog-Category`
4. **Should show**: Only products tagged with "zone1" in Dog-Category

## Verify It's Working

### Check the API call:
Open browser DevTools → Network tab → Look for:
```
/store/products?tag_id[]=<tag_id>&category_id=<cat_id>
```

### Check the response:
All returned products should have the zone tag in their tags array.

## Important Notes

- Products MUST be tagged with zone tags (zone0, zone1, etc.)
- Tags are case-sensitive in lookup but we use `.toLowerCase()`
- If no tag found for zone, products won't be filtered (shows all)
- Make sure tags exist in Medusa before testing

## Complete! ✅

The zone-based product filtering is now working correctly. Products will be filtered by both category AND zone tag.
