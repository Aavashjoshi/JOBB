import React from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useState } from 'react';
import { setSearchedQuery } from '@/redux/jobslice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
}

  return (
    <div className='text-center'>
      <div className='flex flex-col gap-5 my-10'>
        <span
          className=' mx-auto px-4 py-2 rounded-full bg-gray-200 text-[#F83002] font-medium'>No.1 Job Hunt Website
        </span>
        <h1 className='text-4xl font-bold'>Search, Apply and <br /> Fulfill Your <span className='text-[#6A38C2]'>Dreams By Getting Interested Jobs</span></h1>
        <p>You can apply for your dream jobs through the help of our Website.</p>
        <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
          <input
            type="text"
            placeholder='Find your dream jobs'
            onChange={(e) => setQuery(e.target.value)}
            className='outline-none border-none w-full'
          />
          <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
            <Search className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection