import React from 'react'
import {
    Text,
    View,
    ScrollView,
    Button,
    SafeAreaView
} from 'react-native'
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
} from 'react-native-webrtc'
import {styles, colors} from '../style'
import {withSocketContext} from '../providers/SocketProvider'
import PrimaryButton from './components/PrimaryButton'
import SecondaryButton from './components/SecondaryButton'

class LiveKitchenScreen extends React.Component{

    state = {
        user: {},
        friend: {},
        recipe: {}
    }


    componentDidMount() {
        this.setState({
            user: this.props.navigation.getParam("user"),
            friend: this.props.navigation.getParam("friend"),
            recipe: this.props.navigation.getParam("recipe")
        })

        // TODO: Check si recipe contient ou pas .ingredients & .steps
        // TODO: Loading modal qui affiche un msg d'avancement (Downloading recipe, Waiting for @user to connect, Waiting for @user to join the kitchen, Connecting...)

    }

}


export default withSocketContext(FriendsScreen)