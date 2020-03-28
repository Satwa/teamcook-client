import React from "react";
import { View, Image, Text } from "react-native";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";

export default class MultiSelector extends React.Component {
    constructor(props) {
        super(props)

        // console.log(props)
        props.values.forEach(value => value.selected = false)
        this.state = {
            values: props.values
        }
    }

    render() {
        return (
            <FlatList
                style={[this.props.style, { flexGrow: 0 }]}
                data={this.state.values}
                keyExtractor={(item, index) => item.slug}
                extraData={this.state}
                renderItem={(item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => this._onPress(item.item.slug)}
                            style={ [this.props.rowStyle, item.item.selected ? this.props.rowSelectedStyle : {}] }
                        >
                            <Text>{item.item.label}</Text>
                        </TouchableOpacity>
                    )
                }}
            >

            </FlatList>
        )
    }

    _onPress(selectedSlug) { // selected = slug of selected value
        let updatedState = { ...this.state }
        updatedState.values.find($0 => $0.slug === selectedSlug).selected = !updatedState.values.find($0 => $0.slug === selectedSlug).selected

        this.props.onChange(updatedState.values.filter($0 => $0.selected))
    }
}
