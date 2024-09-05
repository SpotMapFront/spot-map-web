import { useState, useEffect, useRef } from 'react'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import './mapboxMap.scss'

const MapboxMap = ({ onBoundsChange, markers, setMarkers, spotId }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markersRef = useRef([])
  const [lng, setLng] = useState(30)
  const [lat, setLat] = useState(59)
  const [zoom, setZoom] = useState(13)
  const idleTimeoutRef = useRef(null)
  const spotIdRef = useRef(spotId)

  useEffect(() => {
    spotIdRef.current = spotId
  }, [spotId])

  const fetchMarkers = async (northWest, southEast, currentSpotId) => {
    if (!currentSpotId) return
    const url = `api/spot/map?spotType=${currentSpotId}&lat1=${northWest.lat}&lon1=${northWest.lng}&lat2=${southEast.lat}&lon2=${southEast.lng}`

    try {
      const response = await fetch(url)
      const spots = await response.json()

      const filteredSpots = spots.filter((s) => {
        const lat = parseFloat(s.lat)
        const lon = parseFloat(s.lon)

        return (
          lat <= northWest.lat && lat >= southEast.lat &&
          lon >= northWest.lng && lon <= southEast.lng
        );
      })

      setMarkers(filteredSpots.map(spot => ({
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lon)
      })))
    } catch (error) {
      console.error('Ошибка при получении точек:', error)
    }
  }

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: 'pk.eyJ1IjoieXV0a2FjaGV2IiwiYSI6ImNtMGZ2cmFpdzB4YmcybHF2cWZ1eXNkMjkifQ.i54ioLyfcnPCj_DU_Gchlw',
      style: 'mapbox://styles/yutkachev/cm0fetjsp000201qy8u933dj0',
      center: [lng, lat],
      zoom: zoom
    })

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))

      const bounds = map.current.getBounds()
      const northWest = { lat: bounds.getNorth(), lng: bounds.getWest() }
      const southEast = { lat: bounds.getSouth(), lng: bounds.getEast() }

      onBoundsChange({ northWest, southEast })

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }

      idleTimeoutRef.current = setTimeout(() => {
        fetchMarkers(northWest, southEast, spotIdRef.current)
      }, 500)
    })

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLng = position.coords.longitude
        const userLat = position.coords.latitude
        map.current.setCenter([userLng, userLat])
        setLng(userLng.toFixed(4))
        setLat(userLat.toFixed(4))
      }, (error) => {
        console.error('Error getting geolocation: ', error)
      })
    }
  }, [onBoundsChange, setMarkers])

  useEffect(() => {
    if (map.current) {
      markersRef.current.forEach(marker => marker.remove())

      markersRef.current = []

      markers.forEach((marker) => {
        const newMarker = new mapboxgl.Marker()
          .setLngLat([marker.lng, marker.lat])
          .addTo(map.current)

        markersRef.current.push(newMarker)
      })
    }
  }, [markers])

  useEffect(() => {
    if (spotId && map.current) {
      const bounds = map.current.getBounds()
      const northWest = { lat: bounds.getNorth(), lng: bounds.getWest() }
      const southEast = { lat: bounds.getSouth(), lng: bounds.getEast() }
      fetchMarkers(northWest, southEast, spotId)
    }
  }, [spotId])

  return (
    <div className='map'>
      <div className="sidebar">
        Долгота: {lng} | Широта: {lat} | Зум: {zoom} | Spot ID: {spotId || 'Не выбран'}
      </div>
      <div ref={mapContainer} className="map-container"/>
    </div>
  )
}

export default MapboxMap