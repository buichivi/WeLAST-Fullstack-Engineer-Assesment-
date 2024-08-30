import { useEffect, useState } from 'react'
import './App.css'

type Repository = {
  fork: boolean;
  forks: number;
  name: string;
  description: string;
  language: string;
  forks_count: number
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
    <div className='flex flex-col gap-2'>
      {data.map((repo) => {
        return (
          <div className='border p-2 max-w-96 rounded-md '>
            <h3>Name: {repo.name}</h3>
            <p>Desription: {repo.description}</p>
            <p>Language: {repo.language}</p>
            <p>Forks count: {repo.forks_count}</p>
          </div>
        )
      })}
    </div>
  )
}

export default App
