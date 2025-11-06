# Update ProductDetail.tsx to Use Calendar Component

## Step 1: Import the DatePicker and CSS

Add these imports at the top of the file (around line 8):

```tsx
import { DatePicker } from "@/components/molecules/DatePicker/DatePicker"
import "@/styles/datepicker.css"
```

## Step 2: Update State for Date

Change line 23 from:
```tsx
const [selectedDate, setSelectedDate] = useState('')
```

To:
```tsx
const [selectedDate, setSelectedDate] = useState<Date | null>(null)
```

## Step 3: Update handleAddToCart Validation

Around line 54-60, update the date validation:

```tsx
// Validate required fields
if (!selectedDate || !locationType || !contactName || !contactPhone) {
  toast.error({
    title: "Fehlende Pflichtfelder",
    description: "Bitte füllen Sie alle Pflichtfelder aus",
  })
  return
}

// Format date to YYYY-MM-DD for backend
const formattedDate = selectedDate.toISOString().split('T')[0]

// Check if selected date is already booked
if (bookedDates.includes(formattedDate)) {
  toast.error({
    title: "Datum nicht verfügbar",
    description: "Dieses Lieferdatum ist bereits gebucht. Bitte wählen Sie ein anderes Datum.",
  })
  return
}
```

## Step 4: Update metadata in addToCart

Around line 92-98, change `delivery_date` to use formatted date:

```tsx
metadata: {
  delivery_date: formattedDate,  // Changed from selectedDate
  installation_location: locationType,
  container_exchange: containerExchange,
  contact_name: contactName,
  contact_phone: contactPhone,
},
```

## Step 5: Clear date on success

Around line 118, update the date clearing:

```tsx
setSelectedDate(null)  // Changed from setSelectedDate("")
```

## Step 6: Replace the Date Input (Lines 304-347)

Replace the entire calendar section with:

```tsx
              {/* Calendar */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Liefertermin: *
                </label>
                <DatePicker
                  selectedDate={selectedDate}
                  onChange={setSelectedDate}
                  bookedDates={bookedDates}
                  loading={loadingDates}
                  minDate={new Date(Date.now() + 86400000)}
                  className="w-full"
                />
              </div>
```

## Summary of Changes

1. Import DatePicker component and CSS
2. Change `selectedDate` state from string to `Date | null`
3. Format date to YYYY-MM-DD before saving
4. Replace input with DatePicker component
5. Update all date-related logic to work with Date objects

This will give you a proper calendar UI with disabled dates that are already booked!
