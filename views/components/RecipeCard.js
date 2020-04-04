import React from "react"
import {
    Text,
    TouchableOpacity,
    LayoutAnimation,
    Image,
    View
} from 'react-native'
import {styles, buttons, colors} from '../../style'
import { Icon } from 'react-native-eva-icons'
import SecondaryButton from "./SecondaryButton"

export default class RecipeCard extends React.Component {
    
    state = {
        unfolded: false
    }

    constructor(props) {
        super(props)
        this.props = props
    }

    _onPress(){
        this.setState({
            unfolded: !this.state.unfolded
        })
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this._onPress.bind(this)}
                style={[styles.card, styles.recipeCard, this.props.cardStyle, this.state.unfolded ? {height: null} : {}]}
                disabled={this.props.disabled ? true : false}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: this.props.recipe.image }} style={{ height: 60, width: 60, borderRadius: 10, flex: 1, marginRight: 10 }} />
                    <View style={{flex: 3}}>
                        <Text style={[styles.cardText, styles.bold]}>{ this.props.recipe.name }</Text>
                    </View>
                    <View style={[styles.cardText, {flex: 1, alignContent: 'flex-end', alignSelf: 'center', alignItems: 'flex-end', justifyContent: 'flex-end'}]}>
                        <Icon 
                            name={this.state.unfolded ? "chevron-up" : "chevron-down"} 
                            width={28} 
                            height={28} 
                            fill={colors.secondary.color}
                        />
                    </View>
                </View>
                {this.state.unfolded && (
                    <>
                        <Text style={[styles.cardText, styles.cardTextDescription, styles.recipeCardTextDescription]}>{this.props.recipe.description}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <SecondaryButton text="Get details"  onPress={this.props.onDetails} style={{ flex: 1, borderRightWidth: 1, borderRightColor: colors.text.color }}/>
                            <SecondaryButton text="Go to the kitchen" onPress={this.props.onPress} style={{ flex: 1 }}/>
                        </View>
                    </>
                )}
            </TouchableOpacity>
        )
    }
}