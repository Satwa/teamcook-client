import React from 'react'
import {
    View,
    FlatList,
    Text,
    TextInput,
    Alert,
    Keyboard,
    Modal,
    SectionList
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage'
import {colors, styles} from '../style'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {Icon} from 'react-native-eva-icons'
import Loader from './components/Loader'
import RecipeCard from './components/RecipeCard'
import SecondaryButton from './components/SecondaryButton';

class RecipesListScreen extends React.Component {
    state = {
        user: {},
        friend: {},
        recipes: [],
        keywords: "",
        searchTimeout: 0,
        loading: false,
        showDetails: null
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

                {this.state.showDetails !== null && (<Modal
                    animationType="none"
                    transparent
                    autoCorrect={false}
                    onRequestClose={() => {
                        this.setState({
                            showDetails: null
                        })
                    }}
                >
                    <SafeAreaView style={[styles.modalBackground]}>
                        <View style={styles.scrollViewWrapper}>

                            <SectionList
                                style={{flex: 1, flexGrow: 1, width: '90%'}}
                                sections={[
                                    {title: 'Ingredients', data: this.state.recipes[this.state.showDetails].ingredients},
                                    {title: 'Steps', data: this.state.recipes[this.state.showDetails].steps},
                                ]}
                                renderItem={({item}) => (
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <Text style={[styles.cardText, styles.bold]}>{'\u2022'}</Text>
                                        <Text style={[styles.cardText, styles.cardTextDescription, {flex: 1, paddingLeft: 5}]}>{item}</Text>
                                    </View>
                                )}
                                renderSectionHeader={({section}) => <Text style={[styles.cardText, styles.bold, { paddingBottom: 10, paddingTop: 10, backgroundColor: 'white' }]}>{section.title}</Text>}
                                keyExtractor={(item, index) => index}
                            />  
                            <SecondaryButton text="Close" onPress={() => this.setState({showDetails: null})} />
                        </View>
                    </SafeAreaView>
                </Modal>)}

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
                                    onPress={() => {
                                        // this.state.friend => user to contact
                                        if(!item.ingredients){
                                            this._getRecipe(item).then(() => {
                                                this.props.navigation.navigate("LiveKitchen", {
                                                    user: this.state.user,
                                                    friend: this.state.friend,
                                                    recipe: this.state.recipes[this.state.recipes.findIndex($0 => $0.url == item.url)]
                                                })
                                            })
                                        }else{
                                            this.props.navigation.navigate("LiveKitchen", {
                                                user: this.state.user,
                                                friend: this.state.friend,
                                                recipe: item
                                            })
                                        }
                                    }} 
                                    onDetails={() => {
                                        if(!item.ingredients){ // Get recipe data if not in state
                                            this._getRecipe(item).then(() => {
                                                this.setState({
                                                    showDetails: this.state.recipes.findIndex($0 => $0.url == item.url)
                                                })
                                            })

                                        }else{
                                            console.log("ITEM HAS")

                                            this.setState({
                                                showDetails: this.state.recipes.findIndex($0 => $0.url == item.url)
                                            })
                                        }
                                    }}
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

    async _getRecipe(item) {
        try {
            this.setState({
                loading: true
            })

            const query = await global.SolidAPI.recipeDetails(item.url)
    
            const _item = this.state.recipes.findIndex($0 => $0.url == item.url)
            const _recipes = this.state.recipes.slice(0)
    
            _recipes[_item] = {...item, ...query}
    
            this.setState({
                loading: false,
                recipes: _recipes
            })
            return query
        }catch(err){
            Alert.alert(
                'Error',
                'Something wrong is happening on our side, please try again!',
                [
                    {text: 'OK', onPress: () => this.setState({isRefreshing: false})},
                ],
                {cancelable: false}
            )
        }
    }
}

export default RecipesListScreen