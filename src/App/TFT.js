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
                        name: playerNames[i],
                        placement: currentMatch.info.participants[i].placement,
                        level: currentMatch.info.participants[i].level,
                        augments: currentMatch.info.participants[i].augments,
                        units: currentMatch.info.participants[i].units,
                        traits: currentMatch.info.participants[i].traits,
                        lastRound: currentMatch.info.participants[i].last_round
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
            <div className="input-group">
                <input type="text" placeholder="Summoner Name" className="form-control"
                onChange={e => {
                    setQuery(e.target.value)
                }} />

                <span className="input-group-btn">
                        <Button style = {{width: 200}}className="btn btn-default" type="button" onClick={() => submit()}> Search </Button>
                </span>
            </div>
                    <div style ={{backgroundColor: 'orange', padding: '50px'}}>
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
                <h1> Match History </h1>
                {MatchHistory.gameLength}
                {/* {MatchHistory.map(function(index, key) {
                    return(
                        <div key={key}> {MatchHistory[index]} </div>
                    )
                })} */}
            </div>

                    </tbody> </Table>
            <button onClick={() => {
                console.log(userIDS)
                console.log(MatchHistory)
            }}/>

        </main>
    )
}

export default Main;