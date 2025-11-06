"use client"

import { useState } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "@/lib/helpers/toast"

interface DatePickerProps {
  selectedDate: Date | null
  onChange: (date: Date | null) => void
  bookedDates: string[]
  loading?: boolean
  minDate?: Date
  className?: string
}

export const DatePicker = ({
  selectedDate,
  onChange,
  bookedDates,
  loading = false,
  minDate,
  className = "",
}: DatePickerProps) => {
  // Convert booked date strings to Date objects for comparison
  const bookedDateObjects = bookedDates.map(dateStr => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  })

  // Function to check if a date is booked
  const isDateBooked = (date: Date) => {
    return bookedDateObjects.some(
      bookedDate =>
        bookedDate.getFullYear() === date.getFullYear() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getDate() === date.getDate()
    )
  }

  // Filter out booked dates
  const filterDate = (date: Date) => {
    return !isDateBooked(date)
  }

  // Handle date selection with validation
  const handleDateChange = (date: Date | null) => {
    if (date && isDateBooked(date)) {
      toast.error({
        title: "Datum nicht verfügbar",
        description: "Dieses Datum ist bereits gebucht. Bitte wählen Sie ein anderes Datum.",
      })
      return
    }
    onChange(date)
  }

  return (
    <div className={className}>
      <ReactDatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        filterDate={filterDate}
        minDate={minDate}
        dateFormat="dd.MM.yyyy"
        placeholderText="Datum auswählen"
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
        calendarClassName="custom-calendar"
        inline={false}
        showPopperArrow={false}
        excludeDates={bookedDateObjects}
      />
      
      {loading && (
        <p className="text-xs text-gray-500 mt-1">Lade verfügbare Termine...</p>
      )}
      
      {!loading && bookedDates.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs font-medium text-yellow-800 mb-1">
            ⚠️ Gebuchte Termine:
          </p>
          <div className="flex flex-wrap gap-1">
            {bookedDates.slice(0, 5).map((date) => {
              const [year, month, day] = date.split('-')
              return (
                <span key={date} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  {day}.{month}.{year}
                </span>
              )
            })}
            {bookedDates.length > 5 && (
              <span className="text-xs text-gray-600">+{bookedDates.length - 5} weitere</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
