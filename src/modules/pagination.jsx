import { useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'

const fetchPhoto = pageNumber => {
  return axios.get(`http://16.171.239.100:3000/photos?limit=2&page=${pageNumber}`)
}

export const PaginatedQueriesPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const { data: photos,isLoading, isError, error,  isFetching } = useQuery(
    ['photo', pageNumber],
    () => fetchPhoto(pageNumber),
    {
      keepPreviousData: true
    }
  )

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (isError) {
    return <h2>{error.message}</h2>
  }
  console.log((photos),"photo");
  return (
    <>
      <div>
        {photos?.photos.map(photo => {
          return (
            <div key={photo.id}>
              <h2>
                {photo.id}. {photo.label}
              </h2>
            </div>
          )
        })}
      </div>
      <div>
        <button
          onClick={() => setPageNumber(page => page - 1)}
          disabled={pageNumber === 1}>
          Prev Page
        </button>
        <button
          onClick={() => setPageNumber(page => page + 1)}
          disabled={pageNumber === 4}>
          Next Page
        </button>
      </div>
      {isFetching && 'Loading'}
    </>
  )
}
export default PaginatedQueriesPage