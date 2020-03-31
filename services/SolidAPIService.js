export default class SolidAPIService {
    constructor(userToken) {
        this.token = userToken
        this.ROOT = global.SERVER_URL
    }

    // USER RELATED
    userExists = async (id) => {
        try {
            const req = await fetch(`${this.ROOT}/user/exists/${id}`, {
                // method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
            })

            const res = await req.json()
            return !res.error ? res[id] : false
        } catch(err) {
            console.error(err)
            return false
        }
    }

    userUsernameAvailable = async (username) => {
        try {
            const req = await fetch(`${this.ROOT}/check/username/${username}`, {
                // method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            const res = await req.json()

            return !res.error ? res : false
        } catch(err) {
            console.error(err)
            return false
        }
    }

    userSignUp = async (data) => {
        try {
            const req = await fetch(`${this.ROOT}/user`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            })

            const res = await req.json()

            return !!res.error // TODO: Return saved data instead of true/false || return error
        } catch(err) {
            console.error(err)
            return false
        }
    }

    user = async (id = null) => {
        try {
            const req = await fetch(`${this.ROOT}/user/` + (id ? id : `me`), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            })
            const res = await req.json()
            console.log(res)

            return res
        } catch(err) {
            console.error(err)
            return false
        }
    }

    userFriends = async () => {
        try {
            const req = await fetch(`${this.ROOT}/user/me/friends`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            })
            const res = await req.json()

            return res
        } catch(err) {
            console.error(err)
            return false
        }
    }

    userFind = async (username) => {
        try {
            const req = await fetch(`${this.ROOT}/user/find`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ username: username })
            })
            const res = await req.json()

            return res
        } catch(err) {
            console.error(err)
            return false
        }
    }

    userFriendRequest = async (user_id, type = "new") => {
        try {
            const req = await fetch(`${this.ROOT}/user/friendrequest`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({user_id: user_id, type: type})
            })
            const res = await req.json()
            console.log(res)

            return res
        } catch(err) {
            console.error(err)
            return false
        }
    }

}