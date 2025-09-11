import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
  { fitlerType: 'Location', array: ['Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai'] },
  { fitlerType: 'Industry', array: ['Frontend Developer', 'Backend Developer', 'FullStack Developer'] },
  { fitlerType: 'Salary', array: ['0-40k', '42-1lakh', '1lakh to 5lakh'] },
]

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('')
  const dispatch = useDispatch()

  const changeHandler = (value) => setSelectedValue(value)

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue))
  }, [selectedValue, dispatch])

  return (
    // One full viewport height; scroll inside if content overflows.
    <div className="w-full bg-white p-4 rounded-sm border ring-1 ring-gray-100 overflow-y-auto pt-2">
      <h2 className="font-bold text-lg">Filter Jobs</h2>

      <RadioGroup value={selectedValue} onValueChange={changeHandler} className="space-y-4">
        {fitlerData.map((group) => (
          <div key={group.fitlerType} className="py-2 border-b last:border-b-0">
            <h3 className="font-semibold text-base">{group.fitlerType}</h3>

            <div className="mt-2 space-y-2">
              {group.array.map((item, idx) => {
                const id = `${group.fitlerType}-${idx}`
                return (
                  <div key={id} className="flex items-center space-x-2">
                    <RadioGroupItem id={id} value={item} />
                    <Label htmlFor={id} className="cursor-pointer">
                      {item}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterCard
