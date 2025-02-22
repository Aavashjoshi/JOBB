import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobslice';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Button } from './ui/button';

const filterData = [
  {
    filterType: "Location",
    array: ["Kathmandu", "Dhangadhi", "Lalitpur", "Bhaktapur", "USA"]
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },

];

const FilterCard = () => {
  const [selectedValues, setSelectedValues] = useState([]);
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValues((prev) =>
      prev.some((item) => JSON.stringify(item) === JSON.stringify(value))
        ? prev.filter((item) => JSON.stringify(item) !== JSON.stringify(value))
        : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedValues([]);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValues));
  }, [selectedValues, dispatch]);

  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3' />
      {filterData.map((data, index) => (
        <div key={index}>
          <h1 className='font-bold text-lg'>{data.filterType}</h1>
          {data.array.map((item, idx) => {
            const itemId = `id${index}-${idx}`;
            return (
              <div key={itemId} className='flex items-center space-x-2 my-2'>
                <Checkbox
                  checked={selectedValues.some((selected) => JSON.stringify(selected) === JSON.stringify(item))}
                  onCheckedChange={() => changeHandler(item)}
                  id={itemId}
                />
                <Label htmlFor={itemId}>{item.label || item}</Label>
              </div>
            );
          })}
        </div>
      ))}
      <Button className='mt-3 w-full' onClick={clearFilters}>Clear Filters</Button>
    </div>
  );
};

export default FilterCard;
