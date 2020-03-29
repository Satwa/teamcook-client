import React from "react";
import { View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class RadioSelector extends React.Component{
    constructor(props){
        super(props)

        // console.log(props)
        props.values.forEach(value => value.selected = false)
        this.state = {
            values: props.values
        }
    }

    render(){
        return this.state.values.map((value) => {
            return (
                <TouchableOpacity
                    onPress={() => this._onPress(value.slug)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }, value.selected ? {
                        background: '#F70505',
                        borderRadius: 10,
                        height: 55,
                        width: 190,
                        justifyContent: "center",
                        alignSelf: 'center',
                        borderWidth: 2,
                        marginBottom: 25
                    } : {
                        borderColor: '#F70505',
                        borderRadius: 10,
                        height: 55,
                        width: 190,
                        justifyContent: "center",
                        alignSelf: 'center',
                        borderWidth: 2,
                        marginBottom: 25
                    }}
                    key={value.slug}
                >
                   
                    <Text style={{textAlign: 'center'}} >{ value.label }</Text>
                </TouchableOpacity>
            )
        })
    }

    _onPress(selected){ // selected = slug of selected value
        let updatedState = {...this.state}
        updatedState.values.forEach(value => {
            if(value.slug == selected){
                // This is the selected value, mark as selected
                updatedState.values.find($0 => $0.slug === value.slug).selected = true
            }else{
                // deselect every others
                updatedState.values.find($0 => $0.slug === value.slug).selected = false
            }
        })
        // this.setState(updatedState)
        this.props.onChange(selected)
    }
}
