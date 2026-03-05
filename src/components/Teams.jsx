import React from 'react'
import Title from './Title'
import { teamData } from '../assets/assets'

const Teams = () => {
  return (
    <div className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'>
        <Title title='Meet the Team' desc='A passionate team of experts dedicated to your success.'/>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-5 xl:grid-cols-4'>
            {teamData().map((member, index) => (
                <div key={index} className='flex flex-col items-center gap-3 text-center'>
                    <img src={member.image} alt={member.name} className='w-24 h-24 rounded-full object-cover' />
                    <h3 className='font-semibold'>{member.name}</h3>
                    <p className='text-sm opacity-60'>{member.role}</p>
                </div>
            ))}
        </div>
      
    </div>
  )
}

export default Teams
