import React from 'react'

export const DownArrow = (props) => {
  return (
    <div className={props.className || 'text-default opacity-40'}>
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='fill-current mx-auto'
      >
        <path d='M7 1V12.17L2.12 7.29C1.73 6.9 1.09 6.9 0.700001 7.29C0.310001 7.68 0.310001 8.31 0.700001 8.7L7.29 15.29C7.68 15.68 8.31 15.68 8.7 15.29L15.29 8.7C15.68 8.31 15.68 7.68 15.29 7.29C14.9 6.9 14.27 6.9 13.88 7.29L9 12.17V1C9 0.45 8.55 0 8 0C7.45 0 7 0.45 7 1Z' />
      </svg>
    </div>
  )
}
