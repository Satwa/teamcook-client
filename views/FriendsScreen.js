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
// import Slider from '@react-native-community/slider'
// import ImagePicker from 'react-native-image-picker'
// import SpriteSheet from 'rn-sprite-sheet'
// import firebase from 'react-native-firebase'
import {withSocketContext} from '../providers/SocketProvider'
import SecondaryButton from './components/SecondaryButton';
import { colors, styles } from '../style';
import {TouchableOpacity} from 'react-native-gesture-handler';
import UserCard from './components/UserCard';

class FriendsScreen extends React.Component {
    static navigationOptions = {
        header: null,
    }

    state = {
        user: {},
        isRefreshing: false,
        friends: []
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
        AsyncStorage.getItem("friends")
            .then((data) => {
                const friends = JSON.parse(data)
                this.setState({
                    friends: friends === null ? [] : friends
                })
            })
    }

    render() {
        console.log(typeof this.state.friends)
        return (
            <SafeAreaView style={[styles.container]}>
                <Text style={[styles.text, styles.textCenter]}>{this.state.user.displayname} ({this.state.user.username})</Text>

                <FlatList
                    data={ this.state.friends }
                    keyExtractor={item => item.createdAt}
                    onRefresh={this._refreshFriendList.bind(this)}
                    refreshing={this.state.isRefreshing}
                    style={{padding: 10}}
                    renderItem={({item, index}) => {
                        // if(item.user1 === this.state.user.uid && item.status == 0) return // Don't show pending request I sent

                        const friends = [item.friend_1, item.friend_2]
                        const friend  = friends.find($0 => $0.authID !== this.state.user.uid)

                        return (
                            <UserCard onPress={() => console.log("Pressed user card")}>
                                <View>
                                    <Text style={[styles.cardText, styles.bold]}>{friend.displayname}</Text>
                                    <Text style={[styles.cardText, styles.cardTextDescription]}>{friend.username}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.cardText, styles.bold]}>[{item.status}]</Text>
                                </View>
                            </UserCard>
                        )
                    }}
                />

                {/* <Image source={{uri: this.state.user.picture}} style={{height: 300, width: 300, borderRadius: 150, marginBottom: 30}} /> */}
                {/* <Button color='#000000' title="Changer ma photo de profil" onPress={() => this._openImagePicker()} /> */}
                <SecondaryButton text="Déconnexion" onPress={() => {AsyncStorage.clear(); this.props.navigation.navigate("Auth")}} />
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
            console.log("refreshing")
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