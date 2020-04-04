import React from "react"
import { View, Button } from 'react-native'
import { colors } from '../../style'

export default class SecondaryButton extends React.Component {
    constructor(props) {
        super(props)
        props.style = props.style ? props.style : {}
        this.props = props
    }

    render() {
        return (
            <View style={this.props.style}>
                <Button color={colors.secondary.color} title={this.props.text} onPress={this.props.onPress} />
            </View>
        )
    }
}