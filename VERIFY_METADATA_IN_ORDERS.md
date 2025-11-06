# Verify Metadata in Orders

## The metadata IS being transferred!

Looking at the backend code (`split-and-complete-cart.ts` line 162):

```typescript
const items = sellerLineItemsMap.get(sellerId)!.map((item) =>
  prepareLineItemData({
    item,
    variant: item.variant,
    unitPrice: item.unit_price,
    compareAtUnitPrice: item.compare_at_unit_price,
    isTaxInclusive: item.is_tax_inclusive,
    quantity: item.quantity,
    metadata: item?.metadata,  // <-- METADATA IS PASSED HERE
    taxLines: item.tax_lines ?? [],
    adjustments: item.adjustments ?? []
  })
)
```

The metadata from cart items is being transferred to order items when the order is created.

## Where to Check

### 1. Frontend - Order Details Page
You've already added metadata display to:
- ✅ `OrderItems/Item.tsx` - Shows metadata in order details
- ✅ `OrderProductListItem.tsx` - Shows metadata in order list

### 2. Check the Order in Database

To verify the metadata is actually saved, you can:

**Option A: Check via Admin Panel**
1. Go to your Medusa admin
2. Find the order
3. Look at the line items
4. Check if metadata field contains your data

**Option B: Check via API**
Make a request to:
```
GET /admin/orders/{order_id}
```

Look for the `items` array and check each item's `metadata` field.

### 3. Debug the Frontend

Add console.log to see the data:

In `OrderItems/Item.tsx`, add at the top of the component:

```tsx
export const Item = ({ item, currencyCode }) => {
  console.log('Order Item Metadata:', item.metadata)  // <-- ADD THIS
  
  // rest of code...
}
```

## Expected Metadata Structure

```json
{
  "delivery_date": "2025-10-04",
  "installation_location": "private",
  "container_exchange": "true",
  "contact_name": "John Doe",
  "contact_phone": "+1234567890"
}
```

## If Metadata is Missing

If you still don't see metadata in orders:

1. **Clear old test orders** - Orders created before you added metadata won't have it
2. **Create a new test order** with all fields filled
3. **Check the cart** before checkout - verify metadata is there
4. **Check the order** after checkout - verify it transferred

## Quick Test

1. Add a product to cart with delivery date and contact info
2. Before checkout, check cart in browser DevTools:
   ```javascript
   // In browser console
   fetch('/store/carts/YOUR_CART_ID')
     .then(r => r.json())
     .then(d => console.log('Cart items metadata:', d.cart.items.map(i => i.metadata)))
   ```
3. Complete checkout
4. Check order metadata the same way

The metadata transfer is working in the backend - if you don't see it, it's likely:
- Old orders from before you added the feature
- Data not being displayed (but it's there)
- Need to refresh/clear cache
