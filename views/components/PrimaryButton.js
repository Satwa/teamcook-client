import React from "react"
import {
    Text,
    TouchableOpacity,
} from 'react-native'
import {buttons, colors} from '../../style'

export default class PrimaryButton extends React.Component {
    constructor(props){
        super(props)
        this.props = props
    }

    render(){
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={[buttons.primary, this.props.style]}>
                <Text style={[colors.title, {fontSize: 20, textAlign: 'center'}, this.props.textStyle]} >{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}