import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Script = ({id, name}) => {
  const navigate = useNavigate();

  const onEdit = () => {
    navigate(`/editor/${id}`);
  }
  return (
    <div key={id}>
      <p>{name}</p>
      <button onClick={onEdit}>✏️</button>  
    </div>
  )
}
