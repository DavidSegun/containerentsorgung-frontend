# Add Loading States to Checkout Pages

## Files to Update

### 1. CartAddressSection.tsx (PARTIALLY DONE)
**File**: `src/components/sections/CartAddressSection/CartAddressSection.tsx`

Already added:
- ✅ Import useState
- ✅ Added `const [isSaving, setIsSaving] = useState(false)`
- ✅ Set `setIsSaving(true)` in form action

Still need to update the Save button (line 87-93):

```tsx
<Button
  className="mt-6"
  data-testid="submit-address-button"
  variant="tonal"
  loading={isSaving}
  disabled={isSaving}
>
  {isSaving ? 'Saving...' : 'Save'}
</Button>
```

### 2. CartShippingMethodsSection.tsx
**File**: `src/components/sections/CartShippingMethodsSection/CartShippingMethodsSection.tsx`

Add loading state for delivery method selection:

1. Add state: `const [isSaving, setIsSaving] = useState(false)`
2. Update form action to set loading
3. Add loading prop to submit button

### 3. CartPaymentSection.tsx
**File**: `src/components/sections/CartPaymentSection/CartPaymentSection.tsx`

Add loading state for payment method:

1. Add state: `const [isSaving, setIsSaving] = useState(false)`
2. Update form action
3. Add loading to button

### 4. PlaceOrderButton or Final Checkout Button

Find the final "Place Order" or "Complete Order" button and add:
- Loading spinner
- Disabled state
- "Processing..." text

## Pattern to Follow

For each section:

```tsx
// 1. Import useState
import { useState } from "react"

// 2. Add state
const [isSaving, setIsSaving] = useState(false)

// 3. Update form action
<form
  action={async (data) => {
    setIsSaving(true)
    await formAction(data)
    router.replace(`${pathname}?step=next`)
  }}
>

// 4. Update button
<Button
  loading={isSaving}
  disabled={isSaving}
>
  {isSaving ? 'Saving...' : 'Save'}
</Button>
```

## Quick Fix

If the Button component doesn't support `loading` prop, use this pattern:

```tsx
<Button disabled={isSaving} className="flex items-center justify-center">
  {isSaving && (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )}
  {isSaving ? 'Saving...' : 'Save'}
</Button>
```
