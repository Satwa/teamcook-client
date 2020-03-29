import { StyleSheet } from 'react-native'

const colors = {
    background: {backgroundColor: '#333333'},
    title: {color: '#666A86'},
    text: {color: '#C6C5B9'},
    secondary: {color: '#69EBD0'}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: colors.background.backgroundColor,
        padding: 10,
        // flexWrap: 'wrap'
    },
    title: {
        fontSize: 37,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 22,
        color: colors.text.color,
        marginTop: 20,
        marginBottom: 20,
    },
    textCenter: {
        textAlign: 'center'
    },
    inputfield: {
        alignSelf: 'center', 
        borderBottomWidth: 2, 
        borderBottomColor: colors.secondary.color, 
        backgroundColor: '#4f4f4f', // background color to rgb
        width: '100%', 
        height: 40, 
        textAlign: 'left', 
        color: colors.text.color,
        fontSize: 18,
        padding: 5
    }
})
  
const buttons = StyleSheet.create({
    primary: {
        backgroundColor: '#69EBD0', 
        borderRadius: 10, 
        height: 50, 
        width: 170, 
        justifyContent: "center", 
        marginBottom: 10, 
        alignSelf: 'center'
    }
})

export { styles, buttons, colors }
  