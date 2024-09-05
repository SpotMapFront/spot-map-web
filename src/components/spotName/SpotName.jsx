import { useState, useEffect } from 'react'

import './spotName.scss'

const SpotName = ({ mapBounds, setMarkers, setSelectedSpotId }) => {
  const [spotTypes, setSpotTypes] = useState([])

  useEffect(() => {
    const fetchSpotTypes = async () => {
      try {
        const response = await fetch('api/spot/types')
        const data = await response.json()
        setSpotTypes(data)
      } catch (error) {
        console.error('Ошибка при получении данных:', error)
      }
    }
    fetchSpotTypes()
  }, [])

  const handleClick = async (spot) => {
    setSelectedSpotId(spot.id)
    const { northWest, southEast } = mapBounds

    const url = `api/spot/map?spotType=${spot.id}&lat1=${northWest.lat}&lon1=${northWest.lng}&lat2=${southEast.lat}&lon2=${southEast.lng}`
    try {
      const response = await fetch(url)
      const spots = await response.json()

      const filteredSpots = spots.filter((s) => {
        const lat = parseFloat(s.lat)
        const lon = parseFloat(s.lon)

        return (
          lat <= northWest.lat && lat >= southEast.lat &&
          lon >= northWest.lng && lon <= southEast.lng
        )
      })

      setMarkers(filteredSpots.map(spot => ({
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lon)
      })))
    } catch (error) {
      console.error('Ошибка при получении точек:', error)
    }
  }

  return (
    <div className='spot-name'>
      <ul>
        {spotTypes.map(spot => (
          <li key={spot.id} onClick={() => handleClick(spot)}>
            {spot.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SpotName