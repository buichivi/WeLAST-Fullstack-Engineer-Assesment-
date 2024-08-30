import React, { useEffect, useState } from 'react'
import './App.css'
import axios, { AxiosError } from 'axios'

type Repository = {
  fork: boolean;
  forks: number;
  name: string;
  description: string;
  language: string;
  forks_count: number;
  created_at: string
  [key: string]: unknown;
}

type ErrorResponse = {
  message: string
}

function App() {
  const [data, setData] = useState<Repository[] | undefined>(undefined);
  const [selectedLang, setSelectedLang] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3000/repos')
      .then(res => setData(res.data.data))
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.data?.message) {
          setError(error.response.data.message)
        }
      })
  }, [])

  return (
    <div className='flex flex-col gap-2 p-10'>
      {error ?
        <h1>{error}</h1> :
        <React.Fragment>
          <h1 className='text-3xl'>freeCodeCamp Repositories</h1>
          {selectedLang && <div className='flex items-center gap-2'>
            <span>Filter language: <span className='border rounded-md px-2 py-1'>{selectedLang}</span></span>
            <button className='border rounded-md px-2 py-1' onClick={() => setSelectedLang('')}>X</button>
          </div>}
          {data
            ?.filter(repo => !selectedLang ? true : repo.language === selectedLang)
            ?.sort((prev, next) => {
              const prevTime: number = new Date(prev.created_at).getTime()
              const nextTime: number = new Date(next.created_at).getTime()
              return nextTime - prevTime
            })
            ?.map((repo) => {
              return (
                <div className='border p-2 max-w-[50vw] rounded-md '>
                  <h3><span className='font-bold'>Name:</span> {repo.name}</h3>
                  <p><span className='font-bold'>Desription:</span> {repo.description}</p>
                  <p><span className='font-bold'>Language:</span> {repo.language} {!repo.language && <span className='opacity-80 italic'>null</span>} {repo.language && !selectedLang && <button className='border rounded-md px-2 py-1' onClick={() => setSelectedLang(repo.language)}>Filter</button>}</p>
                  <p><span className='font-bold'>Forks count:</span> {repo.forks_count}</p>
                  <p><span className='font-bold'>Created at:</span> {repo.created_at}</p>
                </div>
              )
            })}
        </React.Fragment>}
    </div>
  )
}

export default App
