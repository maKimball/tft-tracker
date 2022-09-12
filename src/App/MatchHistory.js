import {userIDS, userStats} from "./User"
import {space, riotBase, riotBaseMatchHistory, riotKey} from './Variables'

export const MatchHistoryIDS = []
export var Matches = {
    
}

export async function updateMatchHistory(){
    let matchIDsLink = `${riotBaseMatchHistory}/tft/match/v1/matches/by-puuid/${userIDS.puuid}/ids?api_key=${riotKey}`
    let response = await fetch(matchIDsLink);
    response = await response.json()
    for(let i = 0; i < response.length; i++){
        MatchHistoryIDS[i] = response[i]
    }

    for(let i = 0; i < MatchHistoryIDS.length; i++){
        let matchLink = `${riotBaseMatchHistory}/tft/match/v1/matches/${MatchHistoryIDS[i]}?api_key=${riotKey}`
        
        response = await fetch(matchLink);
        response = await response.json()
        if(response.info.tft_set_core_name === "TFTSet7_2")
            Matches[`Match${(Object.keys(Matches).length) + 1}`] = response
    }
    console.log(Matches)
    
}

export function getMatchData(matchInfo){
    console.log(matchInfo)
    
    // let newSummonerLink = `${riotBase}/tft/summoner/v1/summoners/by-puuid/${test}?api_key=${riotKey}`
}

