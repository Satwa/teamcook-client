import React from 'react'
import {
    Text,
    View,
    ScrollView,
    Button,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native'
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc'
import {styles, colors} from '../style'
import {withSocketContext} from '../providers/SocketProvider'
import PrimaryButton from './components/PrimaryButton'
import SecondaryButton from './components/SecondaryButton'
import {Icon} from 'react-native-eva-icons'
import 'react-native-get-random-values'
import {v4 as uuidv4} from 'uuid'

class LiveKitchenScreen extends React.Component{

    state = {
        user: {},
        friend: {},
        recipe: {},
        stream: null,
        localStream: null
    }

    constructor(props){
        super(props)

        this.peerConnection = new RTCPeerConnection({
            iceServers: [
                {urls: 'stun:stun.services.mozilla.com'},
                {urls: 'stun:stun.l.google.com:19302'}
            ]
        })
    }


    componentDidMount() {
        // TODO: Handle socket not being connected
        // TODO: Handle user contacting me socket

        this.setState({
            user: this.props.navigation.getParam("user"),
            friend: this.props.navigation.getParam("friend"),
            recipe: this.props.navigation.getParam("recipe")
        })
        // si la navigation est vide, c'est qu'on vient depuis une notification et donc il faut deeplink

        // TODO: Check si recipe contient ou pas .ingredients & .steps
        // TODO: Loading modal qui affiche un msg d'avancement (Downloading recipe, Waiting for @user to connect, Waiting for @user to join the kitchen, Connecting...)

        if(!!this.props.socket){
            if(this.props.socket.connected){
                this.props.socket.on("newUserInKitchen", (data) => {
                    console.log("new user in kitchen")
                    this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.call_data)).catch((err) => console.log(err))
                })
                this.props.socket.on("kitchenNewCandidate", (data) => {
                    this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).catch((err) => console.log(err))
                })
            }
        }


        const room_id = uuidv4()

        this._startLocalStream().then(() => {
            if(!this.props.navigation.getParam("call_data")){ // There is not call_id param, this is the host
                console.log("Host")
                this.peerConnection.createOffer().then(description => {
                    this.peerConnection.setLocalDescription(description).then(() => {
                        this.props.socket.emit("joinKitchen", {
                            call_data: description, 
                            room_id: room_id, 
                            user_id: this.state.friend.authID, 
                            recipe: this.state.recipe
                        })
                    })
                })
            }else{ // Nothing is defined, this is an "invitee"
                console.log("Invitee")
                // Fetch from room
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.props.navigation.getParam("call_data"))).then(() => {
                    if(this.peerConnection.remoteDescription.type == "offer"){
                        this.peerConnection.createAnswer().then((description) => {
                            this.peerConnection.setLocalDescription(description).then(() => {
                                this.props.socket.emit("joinKitchen", {
                                    call_data: description,
                                    room_id: this.props.navigation.getParam("room_id")
                                })
                            }).catch((err) => console.log(err))
                        }).catch((err) => console.log(err))
                    }  
                }).catch((err) => console.log(err))
            }
    
            this.peerConnection.onicecandidate = (_event) => {
                console.log("ice candidate")
                socket.emit("kitchenNewCandidate", { 
                    candidate: _event.candidate, 
                    room_id: this.props.navigation.getParam("room_id") !== undefined ? this.props.navigation.getParam("room_id") : room_id
                })
                // _event.candidate
            }
            this.peerConnection.onaddstream = (_event) => {
                console.log("adding stream")
                if(_event.stream) {
                    this.setState({
                        remoteStream: _event.stream
                    })
                }
            }
        }).catch((err) => console.error(err))
    }

    componentWillUnmount() {

    }


    render(){
        return(
            <SafeAreaView style={[styles.container]}>
                <View style={{flex: 1, position: 'relative'}}>
                    {this.state.remoteStream && (
                        <RTCView 
                            streamURL={this.state.remoteStream.toURL()} 
                            mirror
                            objectFit='cover'
                            style={{flex: 1}}
                        /> 
                    )}
                    {this.state.localStream && (
                        <RTCView 
                            streamURL={this.state.localStream.toURL()} 
                            mirror
                            objectFit='cover'
                            style={[
                                {shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: .3, shadowRadius: 3.84, elevation: 5},
                                {flex: 1, position: 'absolute', width: '30%', height: '30%', minHeight: 100, minWidth: 160, bottom: 10, right: 10, borderRadius: 10},
                            ]}
                        /> 
                    )}
                </View>
                <View style={{flex: 1}}>
                    <FlatList
                        // horizontal
                        showsHorizontalScrollIndicator={false}
                        // scrollEnabled={false}
                        data={this.state.recipe.steps}
                        // ref={ref => this.stepsRef = ref}
                        keyExtractor={item => uuidv4()}
                        style={{flex: 1}}
                        renderItem={({item, index}) => (
                            <View style={{ marginTop: '25%', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => console.log(this.peerConnection)}
                                    style={[styles.card, styles.recipeCard, {height: null, width: '95%'}]}
                                    // disabled
                                >
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <Text style={[styles.cardText, styles.cardTextDescription]}>{item}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {index + 1 < this.state.recipe.steps.length && (
                                    <Icon name="arrowhead-down-outline" width={28} height={28} fill={colors.secondary.color} />
                                )}
                            </View>
                        )}
                    />
                </View>
            </SafeAreaView>
        )
    }

    async _startLocalStream(){
        mediaDevices.enumerateDevices().then(sourceInfos => {
            let videoSourceId;
            for(let i = 0;i < sourceInfos.length;i++) {
                const sourceInfo = sourceInfos[i]
                if(sourceInfo.kind == "videoinput" && sourceInfo.facing == "front") { //(isFront ? "front" : "environment")) {
                    videoSourceId = sourceInfo.deviceId
                }
            }

            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500, // Provide your own width, height and frame rate here
                        minHeight: 300,
                        minFrameRate: 60
                    },
                    facingMode: "user", //(isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
                }
            })
                .then(stream => {
                    this.setState({
                        localStream: stream
                    })
                    this.peerConnection.addStream(stream)
                    console.log("local stream ready")
                    // Got stream!
                })
                .catch(error => {
                    console.log(error)
                    // Log error
                })
        })
    }
}


export default withSocketContext(LiveKitchenScreen)