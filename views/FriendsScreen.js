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
    Alert,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage'
import SegmentedControlTab from "react-native-segmented-control-tab"
import {withSocketContext} from '../providers/SocketProvider'
import SecondaryButton from './components/SecondaryButton';
import { colors, styles } from '../style';
import UserCard from './components/UserCard'
import {Icon} from 'react-native-eva-icons'

class FriendsScreen extends React.Component {
    static navigationOptions = {
        header: null,
        headerMode: 'none'
    }

    state = {
        user: {},
        isRefreshing: false,
        friends: [],
        selectedIndex: 0
    }

    constructor(props){
        super(props)
    }

    componentDidMount() {
        AsyncStorage.getItem("user")
           .then((data) => {
                const user = JSON.parse(data)
                this.setState({
                    user: user
                })
            }) 
        AsyncStorage.getItem("friends")
            .then((data) => {
                const friends = JSON.parse(data)
                this.setState({
                    friends: friends === null ? [] : friends
                }, () => {
                        console.log(friends) // TODO: in use here to fix because it causes "Tried to get frame for out of range index NaN"
                    if(friends.length == 0){
                        this._refreshFriendList()
                    }
                })
            })

        this._handleSockets()
    }

    _handleSockets(){
        this.props.socket
            .on("connect", (data) => console.log("connected to socket server"))
            .on("requestForKitchen", (data) => {
                // TODO: Ask before
                console.log("req4kitchen")
                this.props.navigation.navigate("LiveKitchen", {
                    user: this.state.user,
                    recipe: data.recipe,
                    room_id: data.room_id,
                    call_data: data.call_data,
                })
            })
    }

    render() {
        return (
            <SafeAreaView style={[styles.container]}>
                <Text style={[styles.text, styles.textCenter]}>{this.props.socket.id} |{this.state.user.displayname} ({this.state.user.username})</Text>
                <View style={{flex: 1}}>
                    <SegmentedControlTab
                        values={["My friends", "Pending requests"/*, "Search"*/]}
                        selectedIndex={this.state.selectedIndex}
                        onTabPress={this._onTabPress.bind(this)}
                        tabsContainerStyle={{ padding: 10 }}
                        tabStyle={{ color: colors.title.color, borderColor: colors.secondary.color, height: 35 }}
                        tabTextStyle={{ color: colors.title.color }}
                        activeTabStyle={{ backgroundColor: colors.secondary.color }}
                        activeTabTextStyle={{ color: colors.title.color }}
                    />

                    { this.state.selectedIndex == 1 && (
                        <SecondaryButton text="Add friend" onPress={() => {
                            this.props.navigation.navigate("AddFriend", { friends: this.state.friends })
                        }} />
                    )}

                    <FlatList
                        data={ this.state.friends }
                        keyExtractor={item => item.createdAt}
                        onRefresh={this._refreshFriendList.bind(this)}
                        refreshing={this.state.isRefreshing}
                        style={{padding: 10}}
                        renderItem={({item, index}) => {
                            if(item.user1 === this.state.user.uid && item.status == 0) return // Don't show pending request I sent
                            let icon
                            if(this.state.selectedIndex == 0){
                                icon = "chevron-right-outline"
                                if(item.status == 0) return // Don't show pending request in My friends
                            }else if(this.state.selectedIndex == 1){
                                icon = "clock-outline"
                                if(item.status == 1) return
                                if(item.user1 === this.state.user.uid) return
                            }


                            const friends = [item.friend_1, item.friend_2]
                            const friend  = friends.find($0 => $0.authID !== this.state.user.uid)

                            return (
                                <UserCard onPress={() => {
                                    if(item.status == 0){
                                        // Accept or decline friendship request
                                        Alert.alert(
                                            'Friendship request',
                                            `Would you like to have ${item.friend_2.displayname} (${item.friend_2.username}) as a friend?`,
                                            [
                                                {text: 'Yes', onPress: () => {this._acceptDeclineFriendship(friend.authID, "accept")} },
                                                {text: 'Cancel', style: 'cancel'},
                                                {text: 'No', onPress: () => {this._acceptDeclineFriendship(friend.authID, "decline")} },
                                            ],
                                            { cancelable: false }
                                        )
                                    }else{
                                        this.props.navigation.navigate("RecipesList", {
                                            user: this.state.user,
                                            friend: friend
                                        })
                                    }
                                }}>
                                    <View>
                                        <Text style={[styles.cardText, styles.bold]}>{friend.displayname}</Text>
                                        <Text style={[styles.cardText, styles.cardTextDescription]}>{friend.username}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.cardText, styles.bold]}>
                                            <Icon name={icon} width={28} height={28} fill={colors.secondary.color} />
                                        </Text>
                                    </View>
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

    async _refreshFriendList(){
        this.setState({
            isRefreshing: true
        })
        try{
            const friends = await global.SolidAPI.userFriends()

            AsyncStorage.setItem("friends", JSON.stringify(friends))
    
            this.setState({
                isRefreshing: false,
                friends: friends
            })
        }catch(err){
            Alert.alert(
                'Error',
                'Something wrong is happening on our side, please try again!',
                [
                    { text: 'OK', onPress: () => this.setState({isRefreshing: false}) },
                ],
                {cancelable: false}
            )
        }
    }

    async _acceptDeclineFriendship(user_id, type){
        try {
            const query = await global.SolidAPI.userFriendRequest(user_id, type)

            const _friends = this.state.friends.slice()

            const _index = _friends.findIndex($0 => $0.user2 == user_id)
            if(type == "decline"){
                _friends.splice(_index, 1)
            }else{
                _friends[_index].status = 1
            }

            this.setState({
                isRefreshing: false,
                friends: _friends
            })
        } catch(err) {
            console.log(err)
            Alert.alert(
                'Error',
                'Something wrong is happening on our side, please try again!',
                [
                    {text: 'OK', onPress: () => this.setState({isRefreshing: false})},
                ],
                {cancelable: false}
            )
        }
    }

    _onTabPress(tab){
        this.setState({
            selectedIndex: tab
        })
    }

    // _openImagePicker() {
    //     ImagePicker.showImagePicker({title: "Changer ma photo de profil"}, (response) => {
    //         if(response.didCancel) {
    //             console.log("Action annulée par l'utilisateur")
    //         } else if(response.error) {
    //             console.log('Erreur ImagePicker : ', response.error)
    //         } else if(response.customButton) {
    //             console.log('Custom button: ', response.customButton)
    //         } else {
    //             const update = {user: this.state.user}
    //             update.user.picture = response.uri
    //             this.setState(update)

    //             firebase
    //                 .storage()
    //                 .ref(`profile_pictures/${this.state.user.uid}`)
    //                 .putFile(response.uri)
    //         }
    //     })
    // }
}

export default withSocketContext(FriendsScreen)
// TODO: Handle socket here (huggy: when changing mood || hugger: subscribe to every huggy changing their mood)