import React from 'react'
import {
    View,
    FlatList,
    Text,
    TextInput,
    Alert,
    Keyboard,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage'
import {colors, styles} from '../style'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {Icon} from 'react-native-eva-icons'
import Loader from './components/Loader'
import RecipeCard from './components/RecipeCard'

class RecipesListScreen extends React.Component {
    state = {
        user: {},
        friend: {},
        recipes: [],
        keywords: "",
        searchTimeout: 0,
        loading: false
    }

    componentDidMount() {
        this.setState({
            user: this.props.navigation.getParam("user"),
            friend: this.props.navigation.getParam("friend")
        })
    }

    render() {
        return (
            <SafeAreaView style={[styles.container]}>
                <Loader loading={this.state.loading} />
                <View style={{flex: 1}}>
                    <View>
                        <Text style={[styles.title, colors.title, {padding: 10}]}>Cook with {this.state.friend.displayname}</Text>
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <TextInput
                                onChangeText={text => {
                                    this.setState({
                                        keywords: text
                                    })
                                    this._searchRecipe()
                                }}
                                autoCorrect
                                autoFocus
                                placeholder="Cookies"
                                placeholderTextColor={colors.text.color}
                                style={[styles.inputfield, {flex: 1, flexGrow: 4, alignSelf: 'flex-start'}]}
                                value={this.state.username}
                                onSubmitEditing={this._searchRecipe.bind(this)}
                                returnKeyType="search"
                            />
                            <TouchableOpacity
                                onPress={() => {this._searchFriend(); Keyboard.dismiss()}}
                                style={{flex: 1, flexGrow: 2, justifyContent: 'center', alignItem: 'center', paddingLeft: 10, paddingRight: 5}}
                            >
                                <Icon name='search' width={28} height={28} fill={colors.secondary.color} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                        data={this.state.recipes}
                        keyExtractor={item => item.url}
                        style={{padding: 10}}
                        renderItem={({item, index}) => {
                            return (
                                <RecipeCard 
                                    recipe={item}
                                    onPress={() => console.log("Pressed user card")} 
                                />
                            )
                        }}
                    />
                </View>
            </SafeAreaView>
        )
    }

    async _searchRecipe() {
        clearTimeout(this.state.searchTimeout)
        if(this.state.keywords.length < 2) return // min 3 char

        this.setState({
            searchTimeout: setTimeout(async () => {
                try {
                    this.setState({
                        loading: true
                    })
                    const query = await global.SolidAPI.recipeFind(this.state.keywords)

                    this.setState({
                        recipes: query,
                        loading: false
                    })
                } catch(err) {
                    Alert.alert(
                        'Error',
                        'Something wrong is happening on our side, please try again!',
                        [
                            {text: 'OK', onPress: () => this.setState({isRefreshing: false})},
                        ],
                        {cancelable: false}
                    )
                }
            }, 400) // Search when inactive for 400ms
        })
    }
}

export default RecipesListScreen