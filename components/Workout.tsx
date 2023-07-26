"use client"

import React, { useState, useEffect } from 'react';
import Timer from '../components/Timer';
import axios from 'axios';
import { useRouter } from 'next/navigation'

interface WorkoutData {
  id: number;
  workout_name: string;
  running: number;
  rest: number;
  speed: number;
  createdAt: string;
  updatedAt: string;
};


const Workout: React.FC = () => {
  const [workout, setWorkout] = useState("running")
  const [table, setTable] = useState<WorkoutData[]>([])
  const [count, setCount] = useState(1)
  const [interval, setInterval] = useState({
    rest: undefined || "",
    run: undefined || "",
    speed: undefined || "",
  })
  const [errors, setErrors] = useState({
    restError: "",
    runError: "",
    speedError: ""
  })
  const [mounted, setMounted] = useState(false)



  const [startWorkout, setStartWorkout] = useState(false);
  const router = useRouter()


  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('/api/table')
      setTable(response.data)
    }
    getData()
  },[])



  const handleTimeUp = async ()  => {


    if(workout === "running") {

        if(count === 5) {
            handleStopWorkout()
            const addWorkout = await axios.post('/api/table', interval
            )
            console.log(addWorkout)
            setTable([...table, addWorkout.data])
            router.refresh()
            setCount(1)
            return
        }

        setWorkout("walking")
    } else {
        setCount(count + 1)
        setWorkout("running")
    }
  };

  const handleStartWorkout = (e: any) => {
    e.preventDefault();
  
    let updatedErrors = { ...errors }; // Create a shallow copy of the errors object
  
    if (!interval.rest) {
      updatedErrors = { ...updatedErrors, restError: "1" };
    }
  
    if (!interval.run) {
      updatedErrors = { ...updatedErrors, runError: "1" };
    }
  
    if (!interval.speed) {
      updatedErrors = { ...updatedErrors, speedError: "1" };
    }
  
    // Check for all errors first before updating the interval state
    if (interval.rest && interval.run && interval.speed) {
      setErrors(updatedErrors); // Apply all the updates at once
      setInterval({
        rest: interval.rest,
        run: interval.run,
        speed: interval.speed,
      });
      setStartWorkout(true);
    } else {
      setErrors(updatedErrors); // Apply error updates
    }
  };
  const handleStopWorkout = (e?: any) => {
    e?.preventDefault();
    setInterval({
        rest: "",
        run: "",
        speed: ""
      })
      setErrors({
        restError: "",
        runError: "",
        speedError: ""
      })
      setCount(1)
      setStartWorkout(false)
  }

  function formatDate(inputDate: string) {
    // Parse the input date string into a Date object
    const date = new Date(inputDate);
  
    // Get the components of the date
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are 0-indexed, so add 1
    const year = date.getUTCFullYear();
  
    // Return the formatted date as "dd.mm.yyyy"
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) {
    return null;
  }

  return (
    <div>
        {startWorkout && (
          <div className='mb-20'>
          <div className="bg-blue-400 p-3 font-medium text-white">
              Cycle {count}
          </div>
          </div>
        )}
        {!startWorkout && (
        <div className="pb-6">
            <form className="flex flex-col gap-3">

                <div className='flex flex-col'>
                <label htmlFor="">Running state:</label>
                <input
                  type='number'
                  onChange={(e) => {
                    setInterval({ ...interval, run: e.target.value });
                    setErrors({ ...errors, runError: "" });
                  }}
                  className={`p-2 rounded-md ${errors.runError && "border-rose-500 border-2"}`}
                  value={interval.run}
                  placeholder='30'
                />
                <div className='text-rose-500'>{errors.runError && "That field cannot be empty!"}</div>
                </div>

                <div className='flex flex-col'>
                <label htmlFor="">Rest state:</label>
                <input
                  type='number'
                  onChange={(e) => {
                    setInterval({ ...interval, rest: e.target.value });
                    setErrors({ ...errors, restError: "" });
                  }}
                  className={`p-2 rounded-md ${errors.restError && "border-rose-500 border-2"}`}
                  value={interval.rest}
                  placeholder='90'
                />
                <div className='text-rose-500'>{errors.restError && "That field cannot be empty!"}</div>
                </div>

                <div className='flex flex-col'>
                <label htmlFor="">Speed state:</label>
                <input type='number' onChange={(e) => {
                    setInterval({...interval, speed: e.target.value});
                    setErrors({ ...errors, speedError: "" });
                }} className={`p-2 rounded-md ${errors.speedError && "border-rose-500 border-2"}`} value={interval.speed} placeholder='6.0' />
                <div className='text-rose-500'>{errors.speedError && "That field cannot be empty!"}</div>
                </div>
                <div className='pt-3'>
                    <button onClick={handleStartWorkout} className="bg-orange-500/10 py-2 px-5 rounded-lg font-medium">Start</button>
                </div>
            </form>
        </div>
        )}
      {startWorkout && (
        <div>
            <div className={`container font-semibold ${workout === "running" ? "bg-green-500" : "bg-orange-300"}`}>
            <h1>{workout === 'running' ? 'Running' : 'Walking'}</h1>
                <Timer
                key={workout} // Add key prop to reset Timer on phase change
                initialTime={workout === 'running' ? Number(interval.run) : Number(interval.rest)}
                onTimeUp={handleTimeUp}
                />
            </div>

            <div className="flex justify-center items-center pt-[4rem]">
                <button onClick={handleStopWorkout} className="bg-red-500/50 py-2 px-5 rounded-lg font-medium">Stop</button>
            </div>
            
        </div>
      )}
      {!startWorkout && (
              <div className="relative w-full xl:absolute xl:top-[20px] xl:right-[5%] xl:w-[400px] text-center md:text-sm">
            <table className='w-full'>
                <tr>
                    <th>Workout</th>
                    <th>Running</th>
                    <th>Rest</th>
                    <th>Speed</th>
                    <th>Date</th>
                </tr>
                {table && table.map((data: WorkoutData) => (
                <tr key={data.id}>
                  <td>{data.workout_name.replace(" ", `\u00A0`)}</td>
                  <td>{data.running}s</td>
                  <td>{data.rest}s</td>
                  <td>{data.speed}</td>
                  <td>{formatDate(data.createdAt)}</td>
                </tr>
              ))}
            </table>
        </div>
      )}
    </div>
  );
};

export default Workout;