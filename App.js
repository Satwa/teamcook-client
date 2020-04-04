import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View, 
  YellowBox
} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import io from 'socket.io-client'
import {SocketProvider} from './providers/SocketProvider'

import FriendsScreen from './views/FriendsScreen'
import SignInScreen from './views/SignInScreen'
import WelcomeScreen from './views/WelcomeScreen'
import PhoneAuthScreen from './views/PhoneAuthScreen';
import firebase from 'react-native-firebase';
import SolidAPIService from './services/SolidAPIService'
import AsyncStorage from '@react-native-community/async-storage';
import AddFriendScreen from './views/AddFriendScreen';
import {colors} from './style';
import RecipesListScreen from './views/RecipesListScreen';
import LiveKitchenScreen from './views/LiveKitchenScreen';

global.SERVER_URL = "http://192.168.1.13:3010"

YellowBox.ignoreWarnings(['Unrecognized WebSocket connection'])

const AuthStack = createStackNavigator({
  Welcome: WelcomeScreen, 
  SignIn: SignInScreen, 
  PhoneAuth: PhoneAuthScreen
})
const AppStack = createStackNavigator({
	FriendsScreen: {
		screen: FriendsScreen,
		navigationOptions: {
			header: null
		}
	},
	AddFriend: {
		screen: AddFriendScreen,
		navigationOptions: {
			headerTintColor: colors.title.color,
			headerStyle: {
				borderBottomColor: colors.background.backgroundColor,
				backgroundColor: colors.background.backgroundColor
			},
		}
	},
	RecipesList: {
		screen: RecipesListScreen,
		navigationOptions: {
			headerTintColor: colors.title.color,
			headerStyle: {
				borderBottomColor: colors.background.backgroundColor,
				backgroundColor: colors.background.backgroundColor
			},
		}
	},
	LiveKitchen: {
		screen: LiveKitchenScreen,
		navigationOptions: { // Hide? Make view as a fullscreen modal?
			mode: 'modal',
			headerTintColor: colors.title.color,
			headerStyle: {
				borderBottomColor: colors.background.backgroundColor,
				backgroundColor: colors.background.backgroundColor
			},
		}
	}
}, {
	navigationOptions: {
		mode: 'modal',
		// header: null,
		headerTintColor: colors.secondary.color,
		headerStyle: {
			backgroundColor: colors.background.backgroundColor
		}
	}
})


class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const user = await AsyncStorage.getItem("user")
    this.props.navigation.navigate(user ? 'App' : 'Auth')
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="light-content" />
      </View>
    )
  }
}

//

const App = createAppContainer(
	createSwitchNavigator({
    	AuthLoading: AuthLoadingScreen,
    	App: AppStack,
    	Auth: AuthStack,
  	}, {
    	initialRouteName: 'AuthLoading',
  	}
))


export default class AppRenderer extends React.Component {
  state = {
	token: null,
	socket: null
  }

  componentDidMount() {
	this._loadToken()
	this._connectSocket()
  }

  async _loadToken() { // TODO: Need a try/catch here for currentUser being null
    global.SolidAPI = new SolidAPIService(null)

	const firebaseToken = await firebase.auth().currentUser.getIdToken()

    global.SolidAPI = new SolidAPIService(firebaseToken)

    this.setState({
      token: firebaseToken
	})
  }

	_connectSocket() {
		// try {
		// 	this.setState({
		// 		socket: 
		// 	})
		// } catch(err) {
		// 	console.log(err)
		// }
	}

	render() {
    	return (
      		<SocketProvider socket={
				io.connect(global.SERVER_URL, {
					query: {token: this.state.token},
					transports: ['websocket'],
					reconnectionAttempts: 15
				})
			  }>
        		<App />
      		</SocketProvider>
    	)
  	}
}