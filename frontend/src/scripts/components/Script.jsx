import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Script = ({id, name}) => {
  const navigate = useNavigate();

  const onEdit = () => {
    navigate({pathname: '/script', search: `id=${id}`});

  }
  return (
    <div className='script' key={id} onClick={onEdit}>
      <p className='script__name'>📃 {name}</p>  
    </div>
  )
}
