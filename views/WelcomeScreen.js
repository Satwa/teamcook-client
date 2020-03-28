import React from 'react'
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Button,
    TouchableHighlight,
    TouchableOpacity

} from 'react-native'
// import ActionSheet from 'react-native-actionsheet';

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null,

    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
                {/* <Image
                    source={require("../assets/onboard-hand.png")}
                    style={{width: '100%', height: 200}}
                    resizeMode="contain"
                    marginTop={170}
                /> */}
                <Text style={{color: '#F70505', fontSize: 37, fontWeight: 'bold', textAlign: 'center', marginTop: 20}}>Shrug</Text>
                <Text style={{color: '#000000', fontSize: 22, textAlign: 'center', marginTop: 20, marginBottom: 80}}>The good ol' messaging way</Text>
                <TouchableOpacity
                    onPress={this._goToSignIn}
                    style={{backgroundColor: '#F70505', borderRadius: 30, height: 50, width: 170, justifyContent: "center", marginBottom: 10, alignSelf: 'center'}}>
                    <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}} >Sign up</Text>
                </TouchableOpacity>
                <Button color="#F70505" title="Back to the future? Sign in!" onPress={this._goToPhoneAuth} />

                {/* <ActionSheet
					ref={o => this.ActionSheet = o}
					title={'Quel est ton moyen de connexion ?'}
					options={['Numéro de téléphone', 'Adresse mail', 'cancel']}
					cancelButtonIndex={2}
					// destructiveButtonIndex={1}
					onPress={this._handleAction}
				/> */}
            </ScrollView>
        )
    }

    _goToSignIn = /*async */() => {
        this.props.navigation.navigate('SignIn')
    };

	/*_showActionSheet */ _goToPhoneAuth = () => {
        // this.ActionSheet.show()
        this.props.navigation.navigate("PhoneAuth", {shouldAccountExist: true}) // TODO: Handle if account not found
    }
    $
    // _handleAction = (index) => {
    // 	if(index === 0){
    // 		// Phone Auth
    // 		this.props.navigation.navigate("PhoneAuth")
    // 	}else if(index === 1){
    // 		// Email Auth
    // 	}else{
    // 		return
    // 	}
    // }
}

export default WelcomeScreen;
