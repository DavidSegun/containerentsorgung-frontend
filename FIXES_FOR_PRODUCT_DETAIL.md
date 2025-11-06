# Fixes for ProductDetail.tsx

## Issue 1: Button Loading State Not Showing

**Line 496-501** - Replace the button with:

```tsx
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 transition-colors mt-6 flex items-center justify-center"
                >
                  {isAdding ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Wird hinzugefügt...
                    </>
                  ) : (
                    'In den Warenkorb'
                  )}
                </button>
```

## Issue 2: Hydration Error (Date Formatting)

**Lines 332-336** - The `toLocaleDateString` causes hydration mismatch. Replace with:

```tsx
                      {bookedDates.slice(0, 5).map((date) => (
                        <span key={date} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          {date}
                        </span>
                      ))}
```

Or if you want formatted dates, use a client-only approach:

```tsx
                      {bookedDates.slice(0, 5).map((date) => {
                        const [year, month, day] = date.split('-')
                        return (
                          <span key={date} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            {day}.{month}.{year}
                          </span>
                        )
                      })}
```

## Summary

1. **Button**: Add `disabled={isAdding}` and show spinner when loading
2. **Hydration**: Remove `toLocaleDateString()` - use simple date string or manual formatting
