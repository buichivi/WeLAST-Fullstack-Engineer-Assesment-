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
  created_at: string;
  url: string;
  commits?: Commit[] | undefined
  [key: string]: unknown;
}

type ErrorResponse = {
  message: string
}

type CommitData = {
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
};

type Commit = {
  date: string
  author: string
  message: string
}

const reposMap = new Map<string, Repository>()


function App() {
  const [data, setData] = useState<Repository[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLang, setSelectedLang] = useState('')
  const [error, setError] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<Repository | undefined>(undefined)

  useEffect(() => {
    setIsLoading(true)
    axios.get('http://localhost:3000/repos')
      .then(res => {
        setData(res.data.data)
        setIsLoading(false)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.data?.message) {
          setError(error.response.data.message)
        }
      })
  }, [])

  useEffect(() => {
    if (selectedRepo) {
      if (reposMap.has(selectedRepo.name)) {
        setSelectedRepo(reposMap.get(selectedRepo.name));
      } else {
        setIsLoading(true);
        axios.get(selectedRepo.url + '/commits')
          .then(res => {
            setIsLoading(false);
            setSelectedRepo((prev): Repository => {
              const updatedRepo = {
                ...prev,
                commits: res.data.map((commit_data: CommitData): Commit => ({
                  date: commit_data.commit.author.date,
                  author: commit_data.commit.author.name,
                  message: commit_data.commit.message
                }))
              } as Repository;
              reposMap.set(selectedRepo.name, updatedRepo);
              return updatedRepo;
            });
          })
          .catch(err => {
            setIsLoading(false);
            console.log(err);
          });
      }
    }
  }, [selectedRepo]);


  return (
    <div className='flex flex-col gap-2 p-10'>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <React.Fragment>
          <h1 className='text-3xl'>freeCodeCamp Repositories</h1>
          {isLoading && <p>Loading...</p>}
          {selectedLang && (
            <div className='flex items-center gap-2'>
              <span>
                Filter language: <span className='border rounded-md px-2 py-1'>{selectedLang}</span>
              </span>
              <button className='border rounded-md px-2 py-1' onClick={() => setSelectedLang('')}>
                X
              </button>
            </div>
          )}
          {selectedRepo ? (
            <React.Fragment>
              <button
                className='w-24 border rounded-md px-2 py-1'
                onClick={() => setSelectedRepo(undefined)}
              >
                🔙 Back
              </button>
              <div className='border p-2 max-w-[50vw] rounded-md'>
                <h3><span className='font-bold'>Name:</span> {selectedRepo.name}</h3>
                <p><span className='font-bold'>Description:</span> {selectedRepo.description}</p>
                <p>
                  <span className='font-bold'>Language:</span>{' '}
                  {selectedRepo.language || <span className='opacity-80 italic'>null</span>}
                </p>
                <p><span className='font-bold'>Forks count:</span> {selectedRepo.forks_count}</p>
                <p><span className='font-bold'>Created at:</span> {selectedRepo.created_at}</p>
                {isLoading && <p>Loading...</p>}
                {selectedRepo.commits && (
                  <div>
                    <span className='font-bold'>Recent commit:</span>
                    <div className='pl-4'>
                      <p><span className='font-bold'>Commit date:</span> {selectedRepo.commits[0].date}</p>
                      <p><span className='font-bold'>Author:</span> {selectedRepo.commits[0].author}</p>
                      <p><span className='font-bold'>Message:</span> {selectedRepo.commits[0].message}</p>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {data
                ?.filter(repo => !selectedLang || repo.language === selectedLang)
                ?.sort((prev, next) => {
                  const prevTime = new Date(prev.created_at).getTime();
                  const nextTime = new Date(next.created_at).getTime();
                  return nextTime - prevTime;
                })
                ?.map((repo, index) => (
                  <div
                    key={index}
                    className='border p-2 max-w-[50vw] rounded-md cursor-pointer hover:scale-105 transition-all'
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <h3><span className='font-bold'>Name:</span> {repo.name}</h3>
                    <p><span className='font-bold'>Description:</span> {repo.description}</p>
                    <p>
                      <span className='font-bold'>Language:</span>{' '}
                      {repo.language || <span className='opacity-80 italic'>null</span>}
                      {repo.language && !selectedLang && (
                        <button
                          className='border rounded-md px-2 py-1'
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLang(repo.language);
                          }}
                        >
                          Filter
                        </button>
                      )}
                    </p>
                    <p><span className='font-bold'>Forks count:</span> {repo.forks_count}</p>
                    <p><span className='font-bold'>Created at:</span> {repo.created_at}</p>
                  </div>
                ))}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  )
}

export default App
