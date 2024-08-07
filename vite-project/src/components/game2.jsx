import React, { useEffect, useState } from 'react';
import Game from './Game.jsx';
import Left from './Left.jsx';
import Right from './Right.jsx';
import './gam2.css';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';


const socket = io("https://d5ttvtw2-3000.inc1.devtunnels.ms/");

const Game2 = () => {
    const [players, setPlayers] = useState([]);
    const [room, setRoom] = useState('defaultRoom'); // Initialize room with a default value
    const { roomId } = useParams();

    useEffect(() => {
        console.log("getting new players");
        let newPlayers = localStorage.getItem('players');
        if (newPlayers) {
            setPlayers(JSON.parse(newPlayers));
        }
        console.log(players);
    }, []);
    useEffect(() => {
        console.log("players", players);
    }, [players]);

    return (
        <>
           <div className='text-white'>
           Players:
            {players.map((player, i)=>{
                return <div className='text-white'  key={i}>{player.name}</div>
            })}
            <div className="frameset">
                <div className="frame top">
                    <Left />
                </div>
                <div className="frame business">
                    <Game />
                </div>
                <div className="frame bottom">
                    <Right />
                </div>
            </div>
           </div>
        </>
    );
};

export default Game2;
