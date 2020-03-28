import React from 'react'

import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    Text
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import firebase from 'react-native-firebase'
import {withSocketContext} from '../providers/SocketProvider'

//TODO: Test when two active chats at once, does it route correctly?

// Get more info on GiftedChat from: https://github.com/FaridSafi/react-native-gifted-chat
class ChatScreen extends React.Component {
    static navigationOptions = {
        title: 'Discussion',
    }

    state = {
        user: {},
        conversations: [{id: null, messages: []}]
    }

    constructor(props) {
        super(props)
    }

    // findUserAvatar = url => url.includes("http") ? {uri: url} : this.moods[url]

    componentDidMount() {
        const {socket} = this.props

        this.init = async () => {
            const userInMemory = await AsyncStorage.getItem("user")
            const user = JSON.parse(userInMemory)

            try {
                // TODO: add cache
                let conversations = []
                if(!this.props.navigation.getParam("conversations")) { // If hugger but no chat selected, redirect
                    this.props.navigation.replace("ChatListScreen")
                    return false
                } else if(this.props.navigation.getParam("conversations")) { // if param then update state
                    conversations = this.props.navigation.getParam("conversations")

                    let i = 0, j = 0
                    for(const conversation of conversations) {
                        for(const message of conversation.messages) {
                            conversations[j].messages[i]._id = message.id
                            conversations[j].messages[i].text = message.message
                            conversations[j].messages[i].createdAt = (new Date(message.createdAt)).getTime()
                            conversations[j].messages[i].user = {
                                _id: message.sender_id,
                                name: message.sender_id == user.uid ? conversation.hugger.name : conversation.huggy.name, // TODO: we do this like that because we are in a if-huggy statement
                                avatar: this.findUserAvatar(message.sender_id == user.uid ? conversation.hugger.picture : conversation.huggy.picture)
                            }
                            i++
                        }
                        j++
                    }

                    user.chatroom = conversations[0].id
                    this.setState({
                        conversations: this.props.navigation.getParam("conversations"),
                        user: user
                    })
                    return
                }
            } catch(error) {
                console.log(error)
            }
        }

        this.init()
            .then(() => {
                if(!!socket) { // global message handling
                    if(socket.connected) {
                        socket.on("newMessage", (data) => {
                            console.log(data)

                            const update = this.state.conversations
                            const otherUser = this.state.user.type == "huggy" ? this.state.conversations[0].hugger : this.state.conversations[0].huggy

                            if(update[0].id != data.room.replace("chatroom", "")) return

                            GiftedChat.append(update[0].messages, [{
                                _id: data.id,
                                text: data.message,
                                createdAt: new Date(),
                                user: {
                                    _id: otherUser.authID,
                                    name: otherUser.name,
                                    avatar: this.findUserAvatar(otherUser.picture)
                                }
                            }])
                            this.setState({conversation: update})
                        })

                        // socket.on("moodUpdated", (data) => {
                        //     console.log("Mood update")
                        //     let update = this.state.conversations
                        //     if(update[0].id !== null) {
                        //         update.find($0 => $0.id == data.room.replace("chatroom", "")).huggy.picture = data.picture

                        //         if(update[0].id !== data.room.replace("chatroom")) return

                        //         this.setState({
                        //             conversations: update
                        //         })
                        //     }
                        // })
                    }
                }
            })
    }

    onSend(messages = []) {
        for(const message of messages) {
            this.props.socket.emit("sendMessage", {
                room: "chatroom" + this.state.conversations[0].id,
                message: message.text
            })
        }

        const update = this.state.conversations
        update[0].messages = GiftedChat.append(update[0].messages, messages),
            this.setState({conversations: update})
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.conversations[0].messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: this.state.user.uid,
                }}
                renderBubble={this.renderBubble.bind(this)}
            />
        )
    }
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#9223F3',
                    },
                }}
            />
        );
    }
}

export default withSocketContext(ChatScreen)