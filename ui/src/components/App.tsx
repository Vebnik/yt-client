import { useState } from 'react'
import '../css/App.css'
import videoRepository from '../repository/video.repository'
import { Video } from '../interface/video.interface'

function App() {
  const [query, setQuery] = useState<string>('')
  const [video, setVideo] = useState<Video>()

  const getInfo = () => {
    videoRepository.search(query)
      .then(data => setVideo(data))
  }

  return (
    <div className='main-section'>
      <div className='search-bar'>
        <label className='my-input-box'>
          Video ID or URL
          <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder='https:// ...'/>
        </label>
        <button onClick={getInfo} className='my-btn'>
          <span style={{fontSize: '25px'}}>
          🔎
          </span>
        </button>
      </div>
      <div className='divider'/>
      <div className='preview'>
        <div className='info'>
          <div>
            <img src={video?.thumbnail} width={'200px'} height={'110px'}/>
          </div>
          {video?.title} <br/>
          {video?.channel} <br/>
          {video?.duration} <br/>
          {video?.view_count} <br/>
        </div>
        <div className='formats'>
          <select className='format-select'>
            {
              video?.formats.map(el => (
                <option>
                {el.format_id}
                </option>
              ))
            }
          </select>
          <button>
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
