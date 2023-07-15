import React from 'react'

export const RoomPass = () => {
  return (
    <div className="room-form-pass">
        <label htmlFor="roomPass">Room Password:</label>
        <br/>
        <input name="roomPass" type="password" placeholder="password"></input>
    </div>
  )
}
