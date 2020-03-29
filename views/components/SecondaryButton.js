import React from "react"
import { Button } from 'react-native'
import { colors } from '../../style'

export default class SecondaryButton extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        return (
            <Button color={colors.secondary.color} title={this.props.text} onPress={this.props.onPress} />
        )
    }
}