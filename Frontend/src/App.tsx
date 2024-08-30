import { useEffect, useState } from 'react'
import './App.css'

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

function App() {
  const [data, setData] = useState<Repository[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/repos')
      .then((res) => res.json())
      .then((res) => {
        const data: Repository[] = res.data
        setData(data)
      })
  }, [])


  return (
    <div className='flex flex-col gap-2 p-10'>
      <h1 className='text-3xl'>freeCodeCamp Repositories</h1>
      {data.sort((prev, next) => {
        const prevTime = new Date(prev.created_at).getTime()
        const nextTime = new Date(next.created_at).getTime()
        return nextTime - prevTime
      }).map((repo) => {
        return (
          <div className='border p-2 max-w-96 rounded-md '>
            <h3><span className='font-bold'>Name:</span> {repo.name}</h3>
            <p><span className='font-bold'>Desription:</span> {repo.description}</p>
            <p><span className='font-bold'>Language:</span> {repo.language}</p>
            <p><span className='font-bold'>Forks count:</span> {repo.forks_count}</p>
            <p><span className='font-bold'>Created at:</span> {repo.created_at}</p>
          </div>
        )
      })}
    </div>
  )
}

export default App
