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
    bold: {
        fontWeight: 'bold'
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
        color: "#fff",
        fontSize: 18,
        padding: 5
    },
    card: {
        width: '100%',
        color: colors.text.color,
        backgroundColor: '#fff', // background color to rgb
        borderRadius: 10,
        padding: 10,
        marginBottom: 40,
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    recipeCard: {
        height: 100,
        justifyContent: 'space-evenly',
        flexDirection: 'column'
    },
    cardText: {
        color: "#333",
        // color: colors.text.color,
        fontSize: 20,
        // marginTop: 20,
        // marginBottom: 20,
    },
    cardTextDescription: {
        fontSize: 18,
    },
    recipeCardTextDescription: {
        marginTop: 20
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    scrollViewWrapper: {
        backgroundColor: '#FFFFFF',
        height: '80%',
        width: '90%',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-around'
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
  