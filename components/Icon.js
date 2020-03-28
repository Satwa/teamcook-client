import React from "react";
import { Image, Text } from "react-native";

const iconMap =  {
  chat: require('../assets/chaticon.png'),
  profile: require('../assets/profileicon.png')
};

const Icon = ({ name, color, style, ...props }) => {
  const icon = iconMap[name]

  return <Image source={icon} style={[{ height: 30, width: 30 }, style]} resizeMode="contain" color={{ tintColor: color }}/>
}

export default Icon
