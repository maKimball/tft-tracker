import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';


import './index.css';
import { useState } from "react";
import React from "react";

import { space, riotBase, riotKey, riotBaseMatchHistory} from './Variables'


function Main(){
    let response = null
    const [query, setQuery] = useState('')
    const userIDS = {
        accountId: '',
        id: '',
        name: '',
        profileIconId: 0,
        puuid: '',
        revisionDate: 0,
        summonerLevel: 0,
    }

    const [userData, setUserData] = useState({

    })

    async function submit(){
        updateMatchHistory(false)
        for (let i in Matches) {
            delete Matches[i];
        }

        const newQuery = query.replace(/ /, space)
        let IDLink = `${riotBase}/tft/summoner/v1/summoners/by-name/${newQuery}?api_key=${riotKey}`
        response = await fetch(IDLink)
        response = await response.json()
        
        for(let i = 0; i < Object.keys(response).length; i++){
            userIDS[`${Object.keys(response)[i]}`] = Object.values(response)[i]
        }

        let summonerStatsLink = `${riotBase}/tft/league/v1/entries/by-summoner/${response.id}?api_key=${riotKey}`
        response = await fetch(summonerStatsLink)
        response = await response.json()

        for(let i = 0; i < Object.keys(response[0]).length; i++){
            let newEntry = {}
            newEntry[`${Object.keys(response[0])[i]}`] = Object.values(response[0])[i]

            setUserData(oldData => ({
                ...oldData,
                ...newEntry
            }))
        }
        updateMatchHistory()
    }


    var MatchHistoryIDS = []
    var Matches = {}
    const [MatchHistory, setMatchHistory] = useState([])

    const [isMatchHistory, setIsMatchHistory] = useState(false)

    async function updateMatchHistory(){
        let matchIDsLink = `${riotBaseMatchHistory}/tft/match/v1/matches/by-puuid/${userIDS.puuid}/ids?api_key=${riotKey}`
        let response = await fetch(matchIDsLink);
        response = await response.json()
        for(let i = 0; i < 10; i++){
            MatchHistoryIDS[i] = response[i]
        }
    
        for(let i = 0; i < MatchHistoryIDS.length; i++){
            let matchLink = `${riotBaseMatchHistory}/tft/match/v1/matches/${MatchHistoryIDS[i]}?api_key=${riotKey}`
            
            response = await fetch(matchLink);
            response = await response.json()
            if(response.info.tft_set_core_name === "TFTSet7_2")
                Matches[`Match${(Object.keys(Matches).length) + 1}`] = response
        }

        for(let i = 0; i < Object.keys(Matches).length; i++){
            let playerNames = []
            let currentMatch = Matches[`Match${i + 1}`]   
            
            for(let j = 0; j < 8; j++){
                //get the player names
                let playerNameLink = (`${riotBase}/lol/summoner/v4/summoners/by-puuid/${currentMatch.info.participants[j].puuid}?api_key=${riotKey}`)    
                response = await fetch(playerNameLink);
                response = await response.json()
                playerNames.push(response.name)
            }
            var playerData = []

            for(let i = 0; i < 8; i++){
                playerData.push(
                    {
                        placement: currentMatch.info.participants[i].placement,
                        name: playerNames[i],
                        lastRound: currentMatch.info.participants[i].last_round,
                        level: currentMatch.info.participants[i].level,
                        augments: currentMatch.info.participants[i].augments,
                        traits: currentMatch.info.participants[i].traits,
                        units: currentMatch.info.participants[i].units,
                        
                        
                    }
                )
            }

            setMatchHistory(oldMatchHistory => [...oldMatchHistory,
                {
                    gameType: currentMatch.info.tft_game_type,
                    gameLength: currentMatch.info.game_length,
                    players: playerData
                } 
            ])
        }
        console.log(MatchHistory)
        setIsMatchHistory(true)
    }

    return(
        <main>
            <div>
            <div className="input-group">
                <input type="text" placeholder="Summoner Name" className="form-control"
                onChange={e => {
                    setQuery(e.target.value)
                }} />

                <span className="input-group-btn">
                        <Button style = {{width: 200}}className="btn btn-default" type="button" onClick={() => submit()}> Search </Button>
                </span>
            </div>
                    <div style ={{backgroundColor: '#fe938c', padding: '50px'}}>
                    {isMatchHistory?
                    <Card> 
                        <Card.Body>
                            <Card.Title> Summoner Name: {userData.summonerName} </Card.Title>
                            <Card.Text> Rank: {userData.tier} {userData.rank} {userData.leaguePoints}LP </Card.Text>
                            <Card.Text> Total Games: {userData.wins + userData.losses} </Card.Text>
                            <Card.Text> Top4: {userData.wins}</Card.Text>
                            <Card.Text> Top4 Rate: {(((userData.wins) / (userData.wins + userData.losses))*100).toFixed(1)}%</Card.Text>
                            <Card.Text> Bottom 4s: {userData.losses}</Card.Text>
                            <Card.Text> </Card.Text>
                        </Card.Body> 
                    </Card>: 
                            ""
                        }
                </div>
                
                <div>
                    {isMatchHistory?<h1>  </h1>: ""}
                </div>
            </div>


            <div className='matchhistory'>
                {MatchHistory.map(function(index, key) {
                    // console.log(Object.values(index)[2])
                    return (
                        <div key={key}>
                            <div className='heading'> 
                                <h1 key={key+1}>Game {key +1}  </h1>
                                <h4 key={key+2}>{index.gameType = "standard"? "ranked" : "other"} {Math.round(index.gameLength/60)}:
                                {Math.round(index.gameLength%60)<10 ? `0${Math.round(index.gameLength%60)}`: Math.round(index.gameLength%60) }</h4>
                            </div>
                            
                                <Table key={key+3}><tbody key={key+4}> 
                                    <tr key={key+5}>
                                        <th key={key+6}>Placement </th>
                                        <th key={key +7}>Summoner Name </th>
                                        <th key={key +8}>Last Round </th>
                                        <th key={key +9}>Level </th>
                                        <th key={key +10}>Augments </th>
                                        <th key={key +11}>Traits </th>
                                        <th key={key +12}>Units </th>
                                    </tr>
                                    {Object.values(index)[2].map(function(index,key){
                                        return(
                                            <tr key={key}>
                                                {Object.values(index).map(function(index,key){
                                                    if(key < 4){
                                                        return(
                                                            <td key={key}> {index} </td>
                                                        )
                                                    } else if(key === 4){
                                                        //augments
                                                        return(
                                                            <td key={key}> 
                                                                <Table key={key}>
                                                                    <tbody key={key}>
                                                                        {Object.keys(index).map(function(newIndex, key){
                                                                            return(
                                                                                <tr key={key}> {index[key]} </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </Table> 
                                                            </td>
                                                        )
                                                    } else if(key === 5){
                                                        //traits
                                                        return(
                                                            <td key={key}>  
                                                                <Table key={key}>
                                                                    <tbody key={key}>
                                                                        <th key={key}> Trait Name</th>
                                                                        <th key={key+1}> # </th>
                                                                        {index.map(function(index, key){
                                                                            return(
                                                                                <tr key={key}> 
                                                                                    <td key={key}> {Object.values(index)[0]} </td>
                                                                                    <td key={`key${key}`}> {Object.values(index)[1]} </td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </Table> 
                                                            </td>
                                                            
                                                        )
                                                    } else {
                                                        //units
                                                        return(
                                                            <td key={key}>  
                                                                <Table key={key}>
                                                                    <tbody key={key}>
                                                                        <th key={key}> Unit </th>
                                                                        <th key={key+1}> Star Level </th>
                                                                        {index.map(function(index, key){
                                                                            return(
                                                                                <tr key={key}> 
                                                                                    <td key={key}> {Object.values(index)[0]} </td>
                                                                                    <td key={`key${key}`}> {Object.values(index)[5]} </td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </Table> 
                                                            </td>
                                                            
                                                        )
                                                    }
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody> </Table>
                        </div>
                    )
                })}       
            </div>
        </main>
    )
}

export default Main;