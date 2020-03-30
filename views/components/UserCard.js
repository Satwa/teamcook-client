import React from "react"
import {
    Text,
    TouchableOpacity,
} from 'react-native'
import {styles, buttons, colors} from '../../style'

export default class UserCard extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={[styles.card, this.props.cardStyle]}
            >
                { this.props.children }
            </TouchableOpacity>
        )
    }
}