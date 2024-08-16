import React, { useRef, useState } from 'react'

const PhotoUpload: React.FC = () => {
  const [images, setImages] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files as FileList
    const targetFilesArray = Array.from(targetFiles)
    const selectedFiles: string[] = targetFilesArray
      .map((file) => {
        if (file.type.includes('jpeg') || file.type.includes('jpg')) {
          return URL.createObjectURL(file)
        } else {
          alert('jpg 또는 jpeg 파일만 업로드 가능합니다.')
          return ''
        }
      })
      .filter((url) => url !== '')
    setImages((prev) => prev.concat(selectedFiles))
  }

  const handleClick = () => {
    fileRef?.current?.click()
  }
  // 사진 삭제
  const handleRemoveImage = (url: string) => {
    setImages(images.filter((image) => image !== url))
    URL.revokeObjectURL(url)
  }

  return (
    <form>
      <div>
        <label htmlFor="file"></label>
        <div>
          <div
            onClick={handleClick}
            style={{ cursor: 'pointer', color: 'blue', marginBottom: '10px' }}
          >
            + 사진 업로드?
          </div>
          <input
            ref={fileRef}
            name="file"
            className="hidden"
            type="file"
            multiple
            accept="image/jpeg, image/jpg"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>
        <div>
          {images.map((url, i) => (
            <div
              key={url}
              style={{
                display: 'inline-block',
                position: 'relative',
                margin: '10px',
              }}
            >
              <img
                src={url}
                width="160"
                height="160"
                alt={`image${i}`}
                style={{ border: '1px solid black' }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}

export default PhotoUpload
