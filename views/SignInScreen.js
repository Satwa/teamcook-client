import React from 'react'
import {
    View,
    Text,
    Button,
    FlatList,
    Dimensions,
    TextInput,
    Picker,
    Alert,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import RadioSelector from '../components/RadioSelector'
import MultiSelector from '../components/MultiSelector'
import ImagePicker from 'react-native-image-picker'

class SignInScreen extends React.Component {
    static navigationOptions = {
        header: null,
    }

    // TODO: Afficher les points de suivi d'écran

    state = {
        step: 0,
        screen_width: Dimensions.get('window').width,
        birthdate: Date.now()
    }

    constructor(props) {
        super(props)

        this.fields = [
            {
                name: "Username",
                fieldtype: "textinput",
                label: "What username would you like?",
                allowMultilines: false,
                slug: "username"
            },
            {
                name: "Name",
                fieldtype: "textinput",
                label: "What's your nickname?",
                allowMultilines: false,
                slug: "display_name"
            },
            {
                name: "Age",
                fieldtype: "datetimepicker",
                label: "What's your birthdate? (must be over 13 years old)",
                slug: "birthdate"
            },
            {
                name: "Availability",
                fieldtype: "radio",
                label: "How would you like to appear on your first connection?", // WIP
                values: [{label: "Disponible", slug: "available"}, {label: "Absent", slug: "absent"}, {label: "Occupé (ne pas déranger)", slug: "do-not-disturb"}, {label: "Invisible", slug: "ghost"}],
                slug: "availability"
            },
            {
                name: "Statut",
                fieldtype: "textinput",
                label: "How's your mood?", // WIP
                allowMultilines: false,
                slug: "status"
            },
            {
                name: "Selfie",
                fieldtype: "fileupload",
                label: "Pick a profile picture!",
                slug: "profile_picture"
            }
        ]
    }

    render() {
        return (
            <View style={{flex: 1, paddingBottom: 120, alignItems: ''}}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    data={this.fields}
                    ref={ref => this.stepsRef = ref}
                    keyExtractor={item => item.slug}
                    style={{flex: 1}}
                    renderItem={({item, index}) => (
                        <View style={{width: this.state.screen_width, justifyContent: 'space-evenly'}}>
                            <View>
                                <Text style={{color: '#000000', fontSize: 25, textAlign: 'center', marginBottom: 30}} >{item.label}</Text>
                                {this._renderField(item)}
                            </View>
                            {/* <Text>{ this.state[item.slug] }</Text> */}
                        </View>
                    )

                    }
                />
                <TouchableOpacity
                    onPress={this._validateInput.bind(this)}
                    style={{backgroundColor: '#F70505', borderRadius: 30, height: 50, width: 170, justifyContent: "center", alignSelf: 'center'}}
                >
                    <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}} >Suivant</Text>
                </TouchableOpacity>
            </View>
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

                        }}
                        autoCorrect={false}
                        multiline={item.allowMultilines}
                        placeholder={item.name}
                        style={{alignSelf: 'center', backgroundColor: 'white', borderWidth: 2, borderColor: '#F70505', borderRadius: 20, width: 200, height: 60, textAlign: 'center', fontSize: 20}}
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
                if(item.allowMultipleValues) {
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
                    return (
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
            case 'fileupload':
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
                return <Text>Unhandled yet.</Text>
        }
    }

    _validateInput() {
        // TODO: validate input at each step to be sure

        let currentField = this.fields[this.state.step].slug

        console.log(`Current state of slug ${currentField}: ${this.state[currentField]}`)

        if(currentField == "idCard") {
            currentField = "idCardRecto"
        }
        if(this.state[currentField] === undefined) { // TODO: OR NULL (or invalid)
            Alert.alert(
                'Erreur',
                "L'information saisie est invalide. Vérifies que tu n'as pas fait d'erreur !",
                [
                    {text: 'OK', onPress: null},
                ],
                {cancelable: false},
            )
            return
        }

        if(this.state.step + 1 >= this.fields.length) {
            this.props.navigation.navigate("PhoneAuth", {
                shouldAccountExist: false,
                data: {
                    ...this.state,
                    profile_picture: this.state.profile_picture ? this.state.profile_picture.uri : null,
                }
            })
        } else {
            this.stepsRef.scrollToIndex({
                animated: true,
                index: this.state.step + 1
            })
            this.setState({
                step: (this.state.step + 1)
            })
        }
    }

    _openImagePicker(item) {
        ImagePicker.showImagePicker({title: item.label}, (response) => {
            if(response.didCancel) {
                console.log("Action annulée par l'utilisateur")
            } else if(response.error) {
                console.log('Erreur ImagePicker : ', response.error)
            } else if(response.customButton) {
                console.log('Custom button: ', response.customButton)
            } else {
                const source = {uri: response.uri}

                const update = {}
                update[item.slug] = source
                this.setState(update)
            }
        })
    }
}

export default SignInScreen