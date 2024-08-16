import React, { useEffect, useState, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

interface Marker {
  position: {
    lat: number
    lng: number
  }
  content: string
  label: string
}

interface MapBoxProps {
  lat: number
  lng: number
}

const MapBox: React.FC<MapBoxProps> = ({ lat, lng }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [places, setPlaces] = useState<any[]>([])
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef<any[]>([]) // 마커 참조 저장
  const defaultLevel = 5

  const getLabelFromIndex = (index: number): string => {
    return String.fromCharCode(65 + index)
  }

  const initializeMap = () => {
    if (!mapContainerRef.current) return

    const options = {
      center: new window.kakao.maps.LatLng(lat, lng), // props로 받은 lat, lng 사용
      level: defaultLevel,
    }

    mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, options)

    const zoomControl = new window.kakao.maps.ZoomControl()
    mapRef.current.addControl(
      zoomControl,
      window.kakao.maps.ControlPosition.RIGHT
    )

    const mapTypeControl = new window.kakao.maps.MapTypeControl()
    mapRef.current.addControl(
      mapTypeControl,
      window.kakao.maps.ControlPosition.TOPRIGHT
    )

    const ps = new window.kakao.maps.services.Places()

    const searchOptions = {
      location: new window.kakao.maps.LatLng(lat, lng), // props로 받은 lat, lng 사용
      radius: 10000,
    }

    ps.keywordSearch(
      '정신건강',
      (data: any, status: any, _pagination: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds()
          const newMarkers: Marker[] = []
          const newPlaces: any[] = []

          for (let i = 0; i < data.length; i++) {
            const latLng = new window.kakao.maps.LatLng(
              parseFloat(data[i].y),
              parseFloat(data[i].x)
            )

            const label = getLabelFromIndex(i)

            newMarkers.push({
              position: {
                lat: parseFloat(data[i].y),
                lng: parseFloat(data[i].x),
              },
              content: data[i].place_name,
              label: label,
            })

            newPlaces.push({ ...data[i], label })
            bounds.extend(latLng)
          }
          setMarkers(newMarkers)
          setPlaces(newPlaces)
          mapRef.current.setBounds(bounds)

          newMarkers.forEach((marker, index) => {
            const markerPosition = new window.kakao.maps.LatLng(
              marker.position.lat,
              marker.position.lng
            )
            const kakaoMarker = new window.kakao.maps.Marker({
              position: markerPosition,
              title: marker.label,
            })

            kakaoMarker.setMap(mapRef.current)
            markerRefs.current.push(kakaoMarker) // 마커 참조 저장

            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: markerPosition,
              content: `<div style="padding:5px;background-color:white;border:1px solid black;border-radius:3px;">${marker.label}</div>`,
            })
            customOverlay.setMap(mapRef.current)

            window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
              setSelectedIndex(index)
            })
          })
        } else {
          console.error('Failed to search places: ', status)
        }
      },
      searchOptions
    )
  }

  useEffect(() => {
    const mapScript = document.createElement('script')

    mapScript.async = true
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_APP_KAKAO_KEY}&autoload=false&libraries=services`

    document.head.appendChild(mapScript)

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        initializeMap()
      })
    }

    mapScript.addEventListener('load', onLoadKakaoMap)

    return () => {
      mapScript.removeEventListener('load', onLoadKakaoMap)
    }
  }, [lat, lng]) // lat과 lng 변경될 때마다 useEffect가 실행

  const handleCenter = () => {
    if (mapRef.current) {
      mapRef.current.setCenter(
        new window.kakao.maps.LatLng(lat, lng) // props로 받은 lat, lng 사용
      )
      mapRef.current.setLevel(defaultLevel)
      initializeMap() // 초기화 시 마커와 검색 결과를 다시 로드
    }
  }

  return (
    <div style={{ position: 'relative', paddingBottom: '50px' }}>
      <div
        id="map"
        style={{ width: '100%', height: '500px' }}
        ref={mapContainerRef}
      />
      <button
        onClick={handleCenter}
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          padding: '10px 20px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        내 동네로 돌아가기
      </button>
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {places.map((place, index) => (
            <div
              key={index}
              style={{
                flex: '0 1 calc(50% - 20px)',
                backgroundColor: '#fff',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                color: selectedIndex === index ? '#ff713c' : 'black',
              }}
            >
              <strong>
                <a
                  href={place.place_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {place.label}. {place.place_name}
                </a>
              </strong>
              <br />
              {place.address_name}
              <br />
              {place.phone ? `전화번호: ${place.phone}` : '전화번호 정보 없음'}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapBox
