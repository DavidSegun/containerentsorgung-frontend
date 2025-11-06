# Complete Checkout Loading States Implementation

## 1. CartShippingMethodsSection.tsx

You already added: `const [isSaving, setIsSaving] = useState(false)`

### Update handleSubmit (around line 119):

```tsx
const handleSubmit = () => {
  setIsSaving(true)
  router.push(pathname + "?step=payment", { scroll: false })
}
```

### Find the Continue button and update it:

Search for the button that calls `handleSubmit` and update it to:

```tsx
<Button
  onClick={handleSubmit}
  disabled={isSaving || isLoadingPrices}
  loading={isSaving}
>
  {isSaving ? 'Saving...' : 'Continue to Payment'}
</Button>
```

## 2. CartPaymentSection.tsx

**File**: `src/components/sections/CartPaymentSection/CartPaymentSection.tsx`

### Add state at the top:

```tsx
const [isSaving, setIsSaving] = useState(false)
```

### Update the form action:

Find the form with `action={async (data) => {` and update to:

```tsx
<form
  action={async (data) => {
    setIsSaving(true)
    await formAction(data)
    router.push(pathname + "?step=review", { scroll: false })
  }}
>
```

### Update the submit button:

```tsx
<Button
  disabled={isSaving}
  loading={isSaving}
>
  {isSaving ? 'Saving...' : 'Continue to Review'}
</Button>
```

## 3. PlaceOrder / Submit Order Button

**File**: Look for `PlaceOrderButton.tsx` or similar in `src/components`

### Add loading state:

```tsx
const [isPlacingOrder, setIsPlacingOrder] = useState(false)

const handlePlaceOrder = async () => {
  setIsPlacingOrder(true)
  try {
    await placeOrder()
    // success handling
  } catch (error) {
    // error handling
  } finally {
    setIsPlacingOrder(false)
  }
}
```

### Update button:

```tsx
<Button
  onClick={handlePlaceOrder}
  disabled={isPlacingOrder}
  className="flex items-center justify-center"
>
  {isPlacingOrder ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing Order...
    </>
  ) : (
    'Place Order'
  )}
</Button>
```

## Summary

All checkout steps now need:
1. ✅ Address - DONE
2. ⏳ Delivery - Add to handleSubmit + button
3. ⏳ Payment - Add state + form action + button
4. ⏳ Place Order - Add loading to final button

Follow the patterns above and all buttons will show proper loading states!
