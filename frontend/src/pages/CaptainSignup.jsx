import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
const CaptainSignup = () => {

  const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    
    const [vehicleColor, setVehicleColor] = useState('')
    const [vehiclePlate, setVehiclePlate] = useState('')
    const [vehicleCapacity, setVehicleCapacity] = useState('')
    const [vehicleType, setVehicleType] = useState('')

    console.log(CaptainDataContext);

    const {captain, setCaptain} = React.useContext(CaptainDataContext);

    const submitHandler = async(e) => {
      e.preventDefault();
      const captainData = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email:email,
        password:password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType: vehicleType
        }
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`,captainData)

      if(response.status === 201){
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
      setEmail('')
      setFirstName('')
      setLastName('')
      setPassword('')
      setVehicleColor('')
      setVehiclePlate('')
      setVehicleCapacity('')
      setVehicleType('')
    }
  return (
    <div className="py-5 px-5 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-2"
          src="/uber-driver.svg"
          alt="Uber logo"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-base mb-2 w-full">What's your name</h3>

          <div className="flex gap-4 mb-6">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-base"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
            />

            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <h3 className="text-base font-medium mb-2">What's your email</h3>
          <input
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full border text-lg placeholder:text-base"
            required
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e)=> {
              setEmail(e.target.value);
            }}
          />

          <h3 className="text-base mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 w-full border text-lg placeholder:text-base"
            required
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <input 
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value)
              }}
            />
            <input 
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text" 
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value)
              }}
            />
            </div>
            <div className="flex gap-4 mb-7">
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="number"
                placeholder="Vehicle Capacity"
                value={vehicleCapacity}
                onChange={(e) => {
                  setVehicleCapacity(e.target.value)
                }}
              />
              <select
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                value={vehicleType}
                onChange={(e) => {
                  setVehicleType(e.target.value)
                }}
              >
                <option value="" disabled>Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>

            
          </div>

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg"
          >
            Create Captain Account
          </button>
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <Link className="text-blue-600" to="/captain-login">
            Login Here
          </Link>
        </p>
      </div>

      <div>
        <p className="text-[10px] mt-6 leading-tight">This site is protected by reCAPTCHA and the <span className="underline">Google  Policy</span> and <span className="underline">erms of Service apply</span>T</p>
      </div>
    </div>
  )
}

export default CaptainSignup