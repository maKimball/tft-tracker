import './index.css';
import { useState, useEffect } from "react";
import React from "react";

function Main(){
    const space = "%20"
    const riotKey = 'RGAPI-0087df1a-e82b-4267-92e5-20d7dabf042f'

    const riotBase = 'https://na1.api.riotgames.com'
    //matches
    const getMatchID = '/tft/match/v1/matches/by-puuid/{puuid}/ids'
    const getMatch =  '/tft/match/v1/matches/{matchId}'

    var response = null
    const [query, setQuery] = useState('')

    const [IDLink, setIDLink] = useState('')
    const [user, updateUser] = useState({
        accountId: '',
        id: '',
        name: '',
        profileIconId: 0,
        puuid: '',
        revisionDate: 0,
        summonerLevel: 0,
    })

    const [MatchIDLink, setMatchIDLink] = useState('')
    const [Match, setMatch] = useState('')

    

    async function submit(){
        response = await fetch(IDLink)
        response = await response.json()
        updateUser({
            accountId: response.accountId,
            id: response.id,
            name: response.name,
            profileIconId: response.profileIconId,
            puuid: response.puuid,
            revisionDate: response.revisionDate,
            summonerLevel: response.summonerLevel,
        })        

    }

    useEffect(() => {
        console.log('test')
        const newQuery = query.replace(/ /, space)
        setIDLink(`${riotBase}/tft/summoner/v1/summoners/by-name/${newQuery}?api_key=${riotKey}`)

        if(response != null){
            console.log('yes')
            updateUser({
                accountId: response.accountId,
                id: response.id,
                name: response.name,
                profileIconId: response.profileIconId,
                puuid: response.puuid,
                revisionDate: response.revisionDate,
                summonerLevel: response.summonerLevel,
            })
        if(user.puuid != null){
            setMatchIDLink(`${riotBase}/tft/match/v1/matches/by-puuid/${user.puuid}/ids?api_key=${riotKey}`)
        }
        }


    })

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
            {/* Fix this lol */}
            {/* User Info */}
            <div>
               <button onClick={() => {
                console.log(user)
               }}> print </button> 
            </div>
            <div>
                {MatchIDLink}
            </div>

        </main>
    )
}

export default Main;