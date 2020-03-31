import React from 'react'
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    FlatList,
    Button,
    Image,
    Text,
    TextInput,
    Alert,
    Keyboard,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage'
import {withSocketContext} from '../providers/SocketProvider'
import SecondaryButton from './components/SecondaryButton'
import {colors, styles} from '../style'
import {TouchableOpacity} from 'react-native-gesture-handler'
import UserCard from './components/UserCard'
import { Icon } from 'react-native-eva-icons'
import Loader from './components/Loader'

class AddFriendScreen extends React.Component {
    state = {
        user: {},
        friends: [],
        username: "",
        usersFound: [],
        searchTimeout: 0,
        loading: false
    }

    componentDidMount() {
        const {socket} = this.props
        if(!!socket) {
            if(socket.connected) {
                // socket.emit('bbb')
                // socket.on('aaa', () => { })
            }
            // TODO: Handle socket not being connected
        }

        AsyncStorage.getItem("user")
            .then((data) => {
                const user = JSON.parse(data)
                this.setState({
                    user: user
                })
            })
        this.setState({
            friends: this.props.navigation.getParam("friends")
        })
    }

    render() {
        return (
            <SafeAreaView style={[styles.container]}>
                <Loader loading={this.state.loading} />
                <Text style={[styles.title, colors.title, {paddingBottom: 10}]}>Add friend</Text>
                <View style={{flex: 1}}>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <TextInput
                            onChangeText={text => {
                                this.setState({
                                    username: text
                                })
                                this._searchFriend()
                            }}
                            autoCorrect={false}
                            placeholder="john"
                            placeholderTextColor={colors.text.color}
                            style={[styles.inputfield, { flex: 1, flexGrow: 4, alignSelf: 'flex-start' }]}
                            value={this.state.username}
                            autoCapitalize="none"
                            onSubmitEditing={this._searchFriend.bind(this)}
                            returnKeyType="search"
                        />
                        <TouchableOpacity 
                            onPress={ () => { this._searchFriend(); Keyboard.dismiss() } }
                            style={{ flex: 1, flexGrow: 2, justifyContent: 'center', alignItem: 'center', paddingLeft: 10, paddingRight: 5 }}
                        >
                            <Icon name='search' width={28} height={28} fill={colors.secondary.color} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={this.state.usersFound}
                        keyExtractor={item => item.authID}
                        style={{padding: 10}}
                        renderItem={({item, index}) => {
                            let icon = null

                            if(item.authID == this.state.user.authID) return

                            if(this.state.friends.find($0 => $0["friend_1"].authID == item.authID || $0["friend_2"].authID == item.authID)){
                                const friendship_status = this.state.friends.find($0 => $0["friend_1"].authID == item.authID || $0["friend_2"].authID == item.authID).status
                                if(friendship_status == 0){
                                    // waiting
                                    icon = "clock-outline"
                                }else{
                                    // valid
                                    icon = "person-done"
                                }
                            }else{
                                icon = "person-add"
                            }

                            return (
                                <UserCard onPress={() => console.log("Pressed user card")} disabled>
                                    <View>
                                        <Text style={[styles.cardText, styles.bold]}>{item.displayname}</Text>
                                        <Text style={[styles.cardText, styles.cardTextDescription]}>{item.username}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this._sendFriendRequest(item, icon)}
                                        style={{flex: 1, flexGrow: 2, justifyContent: 'center', alignItem: 'center', paddingLeft: 10, paddingRight: 5}}
                                    >
                                        <Icon name={icon} width={28} height={28} fill={colors.secondary.color} />
                                    </TouchableOpacity>
                                </UserCard>
                            )
                        }}
                    />
                </View>

                {/* <Image source={{uri: this.state.user.picture}} style={{height: 300, width: 300, borderRadius: 150, marginBottom: 30}} /> */}
                {/* <Button color='#000000' title="Changer ma photo de profil" onPress={() => this._openImagePicker()} /> */}

                {/* <SecondaryButton text="Déconnexion" onPress={() => {AsyncStorage.clear(); this.props.navigation.navigate("Auth")}} /> */}
            </SafeAreaView>
        )
    }

    async _searchFriend() {
        clearTimeout(this.state.searchTimeout)
        if(this.state.username.length < 2) return // min 3 char

        this.setState({
            searchTimeout: setTimeout(async () => {
                try {
                    const query = await global.SolidAPI.userFind(this.state.username)

                    this.setState({
                        usersFound: query
                    })
                } catch(err) {
                    Alert.alert(
                        'Error',
                        'Something wrong is happening on our side, please try again!',
                        [
                            {text: 'OK', onPress: () => this.setState({isRefreshing: false})},
                        ],
                        {cancelable: false}
                    )
                }
            }, 400) // Search when inactive for 400ms
        })
    }

    async _sendFriendRequest(user, icon){
        let type = null
        if(icon == "clock-outline"){
            return
        }else if(icon == "person-done"){
            return
        }else if(icon == "person-add"){
            type = "new"
            this.setState({
                loading: true
            })
        }

        try {
            const query = await global.SolidAPI.userFriendRequest(user.authID, type)

            const _friends = this.state.friends.slice()

            _friends.push({
                user1: this.state.user.authID,
                user2: user.authID,
                friend_1: this.state.user,
                friend_2: user,
                status: 0
            })

            this.setState({
                loading: false,
                friends: _friends
            })
        } catch(err) {
            console.log(err)
            Alert.alert(
                'Error',
                'Something wrong is happening on our side, please try again!',
                [
                    {text: 'OK', onPress: () => this.setState({loading: false})},
                ],
                {cancelable: false}
            )
        }
    }
}

export default AddFriendScreen