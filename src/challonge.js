const https = require("https")
class Challonge 
{
	constructor(auth)
	{
		let {username, apiKey, tournamentID} = auth
		this.username = username
		this.apiKey = apiKey
		this.tournamentID = tournamentID
		this.auth = `${username}:${apiKey}`
		this.host = "api.challonge.com"
		this.href = `https://${username}:${apiKey}@${this.host}`
		this.tournamentUrl = `https://challonge.com/${tournamentID}/`
	}

	pruneMap(map)
	{
		if (!map.toString()) return ""
		let newMap = map
		map.forEach((value, key) => {
			!value ? newMap.delete(key) : null
		});
		
		return "?" + newMap.toString()
	}

	request(path, method, urlParams, postData)
	{
		return new Promise((resolve, reject) =>{
			let req = https.request(this.options(method, path, urlParams), (res) => {
				let data = "" 
				res.on('data', (d) => {
					data += d
				});  
				res.on('end', () => {
					resolve(JSON.parse(data))
				});
			})
			postData ? req.write(postData) : null
			req.end()
			req.on('error', (e) => {
				reject(e)
			})}

		)
	}

	options(method, path, urlParams)
	{
		return {
			host:this.host,
			auth: this.auth,
			method: method,
			path: path + `${this.pruneMap(new URLSearchParams(urlParams))}`
		}
	}

	matches = {
		match : {
			scores_csv : String,
			winner_id : Number
		},
		index: (participant_id, state) => {
			let path = `/v1/tournaments/${this.tournamentID}/matches.json`
			let params = {
				participant_id : participant_id || "",
				state : state || ""
			}
			return this.request(path,"GET",params)
		},
		show: (match_id) => {
			let path = `/v1/tournaments/${this.tournamentID}/matches/${match_id}.json`
			return this.request(path,"GET")
		},
		update: (match_id, match_info) => {
			let path = `/v1/tournaments/${this.tournamentID}/matches/${match_id}.json`
			let params = {
				match_info : match_info || ""
			}
			return this.request(path,"PUT",params)
		},
		reopen: (match_id) => {
			let path = `/v1/tournaments/${this.tournamentID}/matches/${match_id}/reopen.json`
			return this.request(path,"POST")
		},
		mark_underway: () => {
			let path = `/v1/tournaments/${this.tournamentID}/matches/${match_id}/mark_as_underway.json`
			return this.request(path,"POST")
		},
		unmark_underway: () => {
			let path = `/v1/tournaments/${this.tournamentID}/matches/${match_id}/unmark_as_underway.json`
			return this.request(path,"POST")
		},
	}

	tournaments = {
		tournament : {
			name : String,
			tournament_type : String, //Single elimination (default), double elimination, round robin, swiss
			url : String,
			subdomain : String,
			description : String,
			open_signup : Boolean,
			hold_third_place_match: Boolean,
			pts_for_match_win : Number,
			pts_for_match_tie : Number,
			pts_for_game_win : Number,
			pts_for_game_tie : Number,
			pts_for_bye : Number,
			swiss_rounds : Number, 
			ranked_by : String, //'match wins', 'game wins', 'points scored', 'points difference'
			rr_pts_for_match_win : Number,
			rr_pts_for_match_tie : Number,
			rr_pts_for_game_win : Number,
			rr_pts_for_game_tie : Number,
			accept_attachments : Boolean,
			hide_forum : Boolean,
			show_rounds : Boolean,
			private : Boolean,
			notify_users_when_matches_open : Boolean,
			notify_users_when_the_tournament_ends : Boolean,
			sequential_pairings : Boolean,
			signup_cap : Number,
			start_at : Date,
			check_in_duration : Number,
			grand_finals_modifier : String
		},
		create: (tournament) => {
			let path = `/v1/tournaments.json`
			let params = {
				tournament : tournament || ""
			}
			return this.request(path,"POST", params)
		},
		index: (state, type, created_after,	created_before, subdomain) => {
			let path = `/v1/tournaments.json`
			let params = {
				state : state || "",
				type : type || "",
				created_after : created_after || "",
				created_before : created_before || "",
				subdomain : subdomain || "",
			}
			return this.request(path,"GET",params)
		},
		index: (tournament_id, include_participants, include_matches) => {
			let path = `/v1/tournaments/${tournament_id}.json`
			let params = {
				include_participants : include_participants || "",
				include_matches : include_matches || "",
			}
			return this.request(path,"GET",params)
		},
		update: (tournament_id, tournament) => {
			let path = `/v1/tournaments/${tournament_id}.json`
			let params = {
				tournament : tournament			
			}
			return this.request(path,"POST", params)
		},
		delete: (tournament_id) => {
			let path = `/v1/tournaments/${tournament_id}.json`
			return this.request(path,"DELETE")
		},
		process_check_ins: (tournament_id, include_participants, include_matches) => {
			let path = `/v1/tournaments/${tournament_id}/process_check_ins.json`
			let params = {
				include_participants : include_participants || "",
				include_matches : include_matches || "",
			}
			return this.request(path,"POST",params)
		},
		process_check_ins: (tournament_id, include_participants, include_matches) => {
			let path = `/v1/tournaments/${tournament_id}/abort_check_in.json`
			let params = {
				include_participants : include_participants || "",
				include_matches : include_matches || "",
			}
			return this.request(path,"POST",params)
		},
		start: (tournament_id, include_participants, include_matches) => {
			let path = `/v1/tournaments/${tournament_id}/start.json`
			let params = {
				include_participants : include_participants || "",
				include_matches : include_matches || "",
			}
			return this.request(path,"POST",params)
		},
		finalize: (tournament_id, include_participants, include_matches) => {
			let path = `/v1/tournaments/${tournament_id}/finalize.json`
			let params = {
				include_participants : include_participants || "",
				include_matches : include_matches || "",
			}
			return this.request(path,"POST",params)
		},
		reset: (tournament_id, include_participants, include_matches) => {
			let path = `/v1/tournaments/${tournament_id}/reset.json`
			let params = {
				include_participants : include_participants || "",
				include_matches : include_matches || "",
			}
			return this.request(path,"POST",params)
		},
		open_predictions: (tournament_id, include_participants, include_matches) => {
			let path = `/v1/tournaments/${tournament_id}/open_for_predictions.json`
			let params = {
				include_participants : include_participants || "",
				include_matches : include_matches || "",
			}
			return this.request(path,"POST",params)
		},
	}

	participants = {
		participant : {
			name : String,
			challonge_username : String,
			email : String,
			seed : Number
		},
		index: () => {
			let path = `/v1/tournaments/${this.tournamentID}/participants.json`
			return this.request(path,"GET")
		},
		create: (participant) => {
			let path = `/v1/tournaments/${this.tournamentID}/participants.json`
			let params = {
				participant : participant || ""
			}
			return this.request(path,"POST", params)
		},
		create_bulk: (participant) => {
			let path = `/v1/tournaments/${this.tournamentID}/participants/bulk_add.json`
			let params = {
				participant : participant || ""
			}
			return this.request(path,"POST", params)
		},
		show: (participant_id, include_matches) => {
			let path = `/v1/tournaments/${this.tournamentID}/participants/${participant_id}.json`
			let params = {
				include_matches : include_matches || 0
			}
			return this.request(path,"GET")
		},
		update: (participant_id, participant) => {
			let path = `/v1/tournaments/${this.tournamentID}/participants/${participant_id}.json`
			let params = {
				participant : participant || ""
			}
			return this.request(path,"PUT", params)
		},
		check_in: (participant_id) => {
			let path = `/v1/tournaments/${this.tournamentID}/participants/${participant_id}/check_in.json`
			return this.request(path,"POST")
		},
		undo_check_in: (participant_id) => {
			let path = `/v1/tournaments/${this.tournamentID}/participants/${participant_id}/undo_check_in.json`
			return this.request(path,"POST")
		},
		remove: (participant_id) => {
			let path = `/v1/tournaments/${this.tournamentID}/participants/${participant_id}.json`
			return this.request(path,"DELETE")
		},
		clear_all: (participant_id) => {
			let path = `/v1/tournaments/${this.tournamentID}/participants/${participant_id}/clear.json`
			return this.request(path,"DELETE")
		},
		randomize: () => {
			let path = `/v1/tournaments/${this.tournamentID}/participants/${participant_id}/randomize.json`
			return this.request(path,"POST")
		}
	}
}
module.exports = Challonge