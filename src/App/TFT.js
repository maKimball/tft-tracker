import './index.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from "react";
import React from "react";

import {userIDS, userStats} from "./User"
import { updateMatchHistory, Matches } from "./MatchHistory"
import { space, riotBase, riotKey} from './Variables'


function Main(){
    let response = null
    const [query, setQuery] = useState('')
    const [userData, setUserData] = useState({
    })

    // newData = {"item1":"juice"};
    // setShopCart(oldData => ({
    //     ...oldData,
    //     ...newData
    // }));


    async function submit(){
        for (let i in Matches) {
            delete Matches[i];
          }
        const newQuery = query.replace(/ /, space)
        let IDLink = `${riotBase}/tft/summoner/v1/summoners/by-name/${newQuery}?api_key=${riotKey}`
        console.log(IDLink)
        response = await fetch(IDLink)
        response = await response.json()
        
        for(let i = 0; i < Object.keys(response).length; i++){
            userIDS[`${Object.keys(response)[i]}`] = Object.values(response)[i]
        }

        let summonerStatsLink = `${riotBase}/tft/league/v1/entries/by-summoner/${response.id}?api_key=${riotKey}`
        response = await fetch(summonerStatsLink)
        response = await response.json()

        for(let i = 0; i < Object.keys(response[0]).length; i++){
            userStats[`${Object.keys(response[0])[i]}`] = Object.values(response[0])[i]
        }
        updateMatchHistory()
        // updateUserData()
    }

    // function updateUserData(){
        // console.log(Matches["Match1"])
        // let currentMatch = Matches[`Match${1}`]
        // console.log(currentMatch)
        // let playerNames = []
        // for(let j = 0; j < 8; j++){
        //     playerNames += (`${riotBase}/lol/summoner/v4/summoners/by-puuid/${currentMatch.participants[j]}?api_key=${riotKey}`)    
        // }
        // console.log(playerNames) 

        // for(let i = 0; i < Object.keys(Matches); i++){
        //     let currentMatch = Matches[`Match${i}`]
            
        //     let playerNames = []
        //     for(let j = 0; j < 8; j++){
        //         playerNames += (`${riotBase}/lol/summoner/v4/summoners/by-puuid/${currentMatch.participants[i]}?api_key=${riotKey}`)    
        //     }
        //     console.log(playerNames)    
        // }
    // }

    return(
        <main>
            <div>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    onChange={e => {
                        setQuery(e.target.value)
                    }}
                />
                <Button
                    variant="primary"
                    onClick={() => submit() } >
                    Submit
                </Button>
            </div>

            

        </main>
    )
}

export default Main;