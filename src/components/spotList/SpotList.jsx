import MapboxMap from '../map/MapboxMap.jsx'

import './spotList.scss'

const SpotList = ({ onBoundsChange, markers, setMarkers, spotId }) => {
  return (
    <div className='spot-list'>
      <MapboxMap
        onBoundsChange={onBoundsChange}
        markers={markers}
        setMarkers={setMarkers}
        spotId={spotId}
      />
    </div>
  );
}

export default SpotList