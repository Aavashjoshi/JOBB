import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label';

const filterData = [
  {
    filterType: 'Location',
    array: ['Kathmandu', 'Bhaktapur', 'Lalitpur', 'Pokhara', 'Kanchanpur'],
  },
  {
    filterType: 'Industry',
    array: ['Frontend Developer', 'Backend Developer', 'FullStack Developer'],
  },
  {
    filterType: 'Salary',
    array: ['0-40k', '42-1lakh', '1lakh to 5lakh'],
  },
];

const FilterCard = () => {
  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className="mt-3 mb-4" />

      <RadioGroup className="space-y-6">
        {filterData.map((data, index) => (
          <fieldset key={index} className="space-y-2">
            <legend className="text-sm font-medium text-gray-700">
              {data.filterType}
            </legend>
            {data.array.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <RadioGroupItem
                  id={item}
                  value={item}
                  className="w-4 h-4 border-2 border-gray-400 "
                />
                <Label htmlFor={item} className="text-sm text-gray-700">
                  {item}
                </Label>
              </div>
            ))}
          </fieldset>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
