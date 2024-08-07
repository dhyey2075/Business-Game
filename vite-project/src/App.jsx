import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import io from 'socket.io-client';
import Navbar from './components/navbar'
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'flowbite-react';
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';

const socket = io("https://d5ttvtw2-3000.inc1.devtunnels.ms/");

function App() {
  const [count, setCount] = useState(0)
  const [room, setRoom] = useState('')
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [players, setPlayers] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('room already created', (room, id, name) => {
      console.log(name, " Room already created ", room);
      alert(`${name} Room already created to ${room}`);
    })
    socket.on('room created', (room, id, name) => {
      console.log(name, " Successfully created ", room);
      alert(`${name} Successfully created to ${room}`);
      // if(!players.includes({name: name, id: id})){
      //   setPlayers([...players, {name: name, id: id}])
      // }
    })
    socket.on('joined room', (room, id, name) => {
      console.log(name, " Successfully joined ", room);
      alert(`${name} Successfully joined to ${room}`);
      // if(!players.includes({name: name, id: id})){
      //   setPlayers([...players, {name: name, id: id}])
      // }
    })
    socket.on('room not found', (room, id) => {
      console.log(`${id} tried to join but room-${room} not found.`);
      alert(`${id} tried to join but room-${room} not found.`);
    })
    socket.on('room full', (room, id, name) => {
      console.log(`${name} tried to join but room-${room} full.`);
      alert(`${name} tried to join but room-${room} full.`);
    })
    socket.on('send players', (room, players) => {
      console.log("Players in room-", room, ":", players);
      localStorage.setItem('players', JSON.stringify(players));
      let isStart = confirm("4 players joined the room", players.map((p) => p.name).join(", "), "Do you want to start the game?");
      navigate(`/game2/${room}`);
    })
    socket.on('user disconnected', (name) => {
      console.log("User disconnected", name);
      alert(`User disconnected ${name}`);
    })
    socket.on('room closed', (room) =>{
      alert("Room closed");
      socket.emit('room close req', room);
    })
    socket.on('game started client', (room) => {
      console.log("Game started in room-", room);
      navigate(`/game2/${room}`);
    })
  }, [])

  useEffect(() => {
    console.log(players)
  }, [players])

  const handleCreateRoom = () => {
    socket.emit('create room', room, user.name);
  }

  const handleRoomChange = (e) => {
    setRoom(e.target.value)
  }

  const handleRoomJoin = () => {
    socket.emit('join room', room, user.name);
  }

  return (
    <>
      <Navbar />
      <div className='flex flex-col justify-center items-center py-6 gap-8'>
        <img src="https://i.pinimg.com/originals/7c/ad/df/7caddfbf0dc2bd9277ae33da116c3f2e.png" alt="" />
        <div className='text-white text-6xl font-serif text-center'>Play, Learn and Enjoy Business with Your Friends...</div>
      </div>
      <div>Here</div>

      {user && <div className='flex gap-8 items-center justify-center'>
        <input onChange={(e) => { handleRoomChange(e) }} type="text" name="" id="" />
        <Button onClick={handleRoomJoin} gradientDuoTone="tealToLime" className='h-20 w-20 text-[1.5rem] font-serif font-bold items-center' >
          <div className='flex flex-col justify-center items-center'>
            Join Room <IoIosAddCircle className='text-3xl' />
          </div></Button>
        <Button onClick={handleCreateRoom} gradientDuoTone="tealToLime" className='h-20 w-20 text-[1.5rem] font-serif font-bold items-center'><div className='flex flex-col justify-center items-center'>
          Create Room <IoIosAddCircle className='text-3xl' />
        </div></Button>
      </div>}
      <div className='flex justify-center items-center gap-2'>
        <img src="/1.png" className='invert' alt="" />
        <img src="/2.png" className='invert' alt="" />
        <img src="/3.png" className='invert' alt="" />
        <img src="/4.png" className='invert' alt="" />
        <img src="/5.png" className='invert' alt="" />
        <img src="/6.png" className='invert' alt="" />
      </div>
      <Footer/>
    </>
  )
}

export default App
