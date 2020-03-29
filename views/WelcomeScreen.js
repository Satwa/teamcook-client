import React from 'react'
import {
    Text,
    View,
    ScrollView,
    Button,
    SafeAreaView
} from 'react-native'
import { styles, colors } from '../style'
import PrimaryButton from './components/PrimaryButton'
import SecondaryButton from './components/SecondaryButton'
// import ActionSheet from 'react-native-actionsheet';

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null,

    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{justifyContent: 'space-evenly', flexGrow: 1}}> 
                {/*
                    Add video sample in background
                */}
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <Text style={[colors.title, styles.title, styles.textCenter]}>teamcook</Text>
                        <Text style={[styles.text, styles.textCenter]}>Learn cooking with friends</Text>
                    </View>
                    <View style={{justifyContent: 'flex-end', flex: 1}}>
                        <PrimaryButton
                            onPress={this._goToSignIn}
                            text="Sign up"
                        />
                        <SecondaryButton 
                            onPress={this._goToPhoneAuth}
                            text="Already signed up? Sign in!"
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    _goToSignIn = /*async */() => {
        this.props.navigation.navigate('SignIn')
    };

	/*_showActionSheet */ _goToPhoneAuth = () => {
        // this.ActionSheet.show()
        this.props.navigation.navigate("PhoneAuth", {shouldAccountExist: true}) // TODO: Handle if account not found
    }
}

export default WelcomeScreen