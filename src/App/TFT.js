import './index.css';
import { useState, useEffect } from "react";
import React from "react";
import {userIDS, userStats} from "./User"
import { MatchHistoryIDS } from "./MatchHistory"

function Main(){
    const space = "%20"
    const riotKey = 'RGAPI-3f833e0f-6a35-4a4f-9fa2-6be22e71c3e1'
    const riotBase = 'https://na1.api.riotgames.com'
    const riotBaseMatchHistory = 'https://americas.api.riotgames.com'

    let response = null
    const [query, setQuery] = useState('')

    

    async function submit(){
        const newQuery = query.replace(/ /, space)
        let IDLink = `${riotBase}/tft/summoner/v1/summoners/by-name/${newQuery}?api_key=${riotKey}`
        console.log(IDLink)
        response = await fetch(IDLink)
        response = await response.json()
        console.log(response)
        
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

    }

    async function updateMatchHistory(){

        let matchIDsLink = `${riotBaseMatchHistory}/tft/match/v1/matches/by-puuid/${userIDS.puuid}/ids?api_key=${riotKey}`
        response = await fetch(matchIDsLink);
        response = await response.json()
        for(let i = 0; i < response.length; i++){
            MatchHistoryIDS[i] = response[i]
        }

        for(let i = 0; i < MatchHistoryIDS.length; i++){
            let matchLink = `${riotBaseMatchHistory}/tft/match/v1/matches/${MatchHistoryIDS[i]}?api_key=${riotKey}`
            console.log(matchLink)
        }
    }

    // useEffect(() => {

    // })

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
            </div>
            <button
                onClick={() => submit() } >
                Submit
            </button>

            <div>
                {}
            </div>

        </main>
    )
}

export default Main;