import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (<>
    <h2  className=''>Click here  to view Gallery 👉🏻   <Link to="photos" className='bg-primary text-light p-2'> Gallery</Link>
 </h2>
  </>)
}

export default Dashboard