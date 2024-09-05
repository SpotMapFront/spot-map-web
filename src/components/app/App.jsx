import { useState } from 'react'

import AppHeader from '../appHeader/AppHeader.jsx'
import SpotList from '../spotList/SpotList.jsx'
import SpotName from '../spotName/SpotName.jsx'

function App() {
  const [markers, setMarkers] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [mapBounds, setMapBounds] = useState({
    northWest: { lat: 59, lng: 30 },
    southEast: { lat: -60, lng: 31 }
  })

  return (
    <div className='app'>
      <AppHeader />
      <main className='main'>
        <SpotName
          mapBounds={mapBounds}
          setMarkers={setMarkers}
          setSelectedSpotId={setSelectedSpotId}
        />
        <SpotList
          onBoundsChange={setMapBounds}
          markers={markers}
          setMarkers={setMarkers}
          spotId={selectedSpotId}
        />
      </main>
    </div>
  )
}

export default App