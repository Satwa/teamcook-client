import React from 'react'
import {
    View,
    Text,
    Button,
    FlatList,
    SafeAreaView,
    Dimensions,
    TextInput,
    Picker,
    Alert,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import ImagePicker from 'react-native-image-picker'
import RadioSelector from '../components/RadioSelector'
import MultiSelector from '../components/MultiSelector'
import PrimaryButton from './components/PrimaryButton'
import {styles, buttons, colors} from '../style'

class SignInScreen extends React.Component {
    static navigationOptions = {
        header: null,
    }

    // TODO: Afficher les points de suivi d'écran

    state = {
        screen_width: Dimensions.get('window').width,
        birthdate: Date.now()
    }

    constructor(props) {
        super(props)

        this.fields = [
            {
                name: "John",
                fieldtype: "textinput",
                label: "Name",
                allowMultilines: false,
                slug: "display_name",
                validated: false
            },
            {
                name: "@john",
                fieldtype: "textinput",
                label: "Username",
                allowMultilines: false,
                slug: "username",
                validated: false,
                onChangeText: (text) => {
                    if(text.length === 0 || text.length == 1 && text[0] !== "@"){
                        this.setState({
                            username: "@" + text
                        })
                    }
                }
            },
            // {
            //     name: "Birthdate",
            //     fieldtype: "datetimepicker",
            //     label: "Birthdate", // must be over 13
            //     slug: "birthdate"
            // },
            // {
            //     name: "Selfie",
            //     fieldtype: "fileupload",
            //     label: "Pick a profile picture!",
            //     slug: "profile_picture"
            // }
        ]
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={[styles.title, colors.title, { padding: 10}]}>Sign up</Text>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={this.fields}
                    keyExtractor={item => item.slug}
                    style={{ padding: 10 }}
                    renderItem={({item, index}) => (
                        <View>
                            <Text style={[styles.text, colors.text, !item.validated ? styles.invalid : null ]}>{item.label}</Text>
                            {this._renderField(item)}
                        </View>
                    )}
                />
                <PrimaryButton onPress={this._validateInput.bind(this)} text="Next" />
            </SafeAreaView>
        );
    }

    _renderField(item) {
        switch(item.fieldtype) {
            case 'textinput':
                return (
                    <TextInput
                        onChangeText={text => {
                            const update = {}
                            update[item.slug] = text
                            this.setState(update)
                            if(item.onChangeText !== undefined){
                                item.onChangeText(text)
                            }
                        }}
                        autoCorrect={false}
                        multiline={item.allowMultilines}
                        placeholder={item.name}
                        placeholderTextColor={colors.text.color}
                        style={styles.inputfield}
                        value={this.state[item.slug]}
                        onSubmitEditing={this._validateInput.bind(this)}
                        returnKeyType="next"
                    />
                )
            case 'datetimepicker':
                return (
                    <DateTimePicker
                        value={new Date(this.state[item.slug])}
                        maximumDate={new Date()}
                        minimumDate={new Date((new Date()).getFullYear() - 80, 0, 1)}
                        onChange={(e, date) => {
                            const update = {}
                            update[item.slug] = date.getTime()
                            this.setState(update)
                        }}
                        style={{marginTop: 60}}
                    />
                )
            case 'radio':
                return <RadioSelector
                    values={item.values}
                    onChange={(value) => {
                        const update = {}
                        update[item.slug] = value
                        this.setState(update)
                    }}
                    style={{}}
                />
            case 'picker':
                if(item.allowMultipleValues) { // style not updated from Hugger
                    return (
                        <MultiSelector
                            values={item.values}
                            rowStyle={{margin: 10, padding: 10, height: 50, borderRadius: 40, borderWidth: 2, borderColor: "#000", textAlign: 'center', alignItems: 'center'}}
                            rowSelectedStyle={{borderRadius: 40, borderWidth: 2, borderColor: '#ff0000', margin: 10, padding: 10, height: 50, textAlign: 'center', alignItems: 'center'}}
                            onChange={(value) => {
                                const update = {}
                                update[item.slug] = value
                                this.setState(update)
                            }}
                        />
                    )
                } else {
                    return ( // Style not updated from Hugger
                        <Picker
                            selectedValue={this.state[item.slug]}
                            onValueChange={(value, index) => {
                                const update = {}
                                update[item.slug] = item.values[index].slug
                                this.setState(update)
                            }}
                            style={{color: '#00000', fontSize: 20, textAlign: 'center'}}
                            rowStyle={{}}
                        >

                            {item.values.map(value => {
                                return <Picker.Item label={value.label} value={value.slug} key={value.slug} />
                            })}


                        </Picker>
                    )
                }
            case 'fileupload': // Style not updated from Hugger
                if(item.multiplicator && item.multiplicator > 1) {
                    return (
                        <View style={{

                        }}>
                            <Text style={{fontSize: 17, marginBottom: 40, alignSelf: 'center', textAlign: 'center'}}>{item.values[0].label}</Text>
                            <View>
                                {
                                    item.values.map(value => {
                                        return (
                                            <View key={value.slug}>
                                                <Image source={this.state[value.slug]} style={{height: 100, width: 100}} />
                                                <TouchableOpacity
                                                    onPress={() => this._openImagePicker(value)}

                                                    style={{marginBottom: 40, alignSelf: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#000000', borderRadius: 15, width: 160, height: 37, justifyContent: 'center'}}>
                                                    <Text style={{color: '#000000', fontSize: 15, textAlign: 'center', alignSelf: 'center'}} >Ajouter une image</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    )
                } else {
                    return (
                        <View key={item.slug}>
                            <Image source={this.state[item.slug]} style={{height: 100, width: 100}} />
                            <TouchableOpacity
                                onPress={() => this._openImagePicker(item)}
                                style={{marginBottom: 40, alignSelf: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#000000', borderRadius: 15, width: 160, height: 37, justifyContent: 'center'}}>
                                <Text style={{color: '#000000', fontSize: 15, textAlign: 'center', alignSelf: 'center'}} >Ajouter une image</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            default:
                return <Text>Not handled yet.</Text>
        }
    }

    _validateInput() {
        let isCompleted = true
        this.fields.forEach((field) => {
            const fieldExists = this.state[field.slug] !== undefined
            if(fieldExists){
                const fieldNotEmpty = field.slug === "username" ? this.state[field.slug].replace(/\s+/g, ' ').length > 2 : this.state[field.slug].replace(/\s+/g, ' ').length > 1
                const fieldConformsToRegex = field.slug === "username" ? /^[A-Za-z0-9_]{3,10}$/.test(this.state[field.slug].substr(1)) : /^[a-zA-Z\u00C0-\u00FF ]*$/.test(this.state[field.slug].replace(/\s+/g, ' ').trim())
                if(!fieldNotEmpty && !fieldConformsToRegex){
                    isCompleted = false
                }
            }else{
                isCompleted = false
            }
        })
        if(!isCompleted){
            Alert.alert(
                'Error',
                "Please fill all fields before submitting",
                [
                    {text: 'OK', onPress: null},
                ],
                {cancelable: false},
            )
        }else{
            // All fields are completed, go ahead
            console.log("go ahead")

            // TODO: Check if username is available on server

            // this.props.navigation.navigate("PhoneAuth", {
            //     shouldAccountExist: false,
            //     data: {
            //         ...this.state,
            //         profile_picture: this.state.profile_picture ? this.state.profile_picture.uri : null,
            //     }
            // })
        }



        console.log(this.state)
        // if(this.state)

        // if(this.state.step + 1 >= this.fields.length) {
        //     this.props.navigation.navigate("PhoneAuth", {
        //         shouldAccountExist: false,
        //         data: {
        //             ...this.state,
        //             profile_picture: this.state.profile_picture ? this.state.profile_picture.uri : null,
        //         }
        //     })
        // } else {
        //     this.stepsRef.scrollToIndex({
        //         animated: true,
        //         index: this.state.step + 1
        //     })
        //     this.setState({
        //         step: (this.state.step + 1)
        //     })
        // }
    }

    // _openImagePicker(item) {
    //     ImagePicker.showImagePicker({title: item.label}, (response) => {
    //         if(response.didCancel) {
    //             console.log("Action annulée par l'utilisateur")
    //         } else if(response.error) {
    //             console.log('Erreur ImagePicker : ', response.error)
    //         } else if(response.customButton) {
    //             console.log('Custom button: ', response.customButton)
    //         } else {
    //             const source = {uri: response.uri}

    //             const update = {}
    //             update[item.slug] = source
    //             this.setState(update)
    //         }
    //     })
    // }
}

export default SignInScreen