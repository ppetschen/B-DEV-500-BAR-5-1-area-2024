/*
** EPITECH PROJECT, 2024
** mobile
** File description:
** IconButton
*/


import React from "react";
import {
    View,
    TouchableOpacity,
    GestureResponderEvent,
    Text,
} from "react-native";
import { styled } from "nativewind";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IconProps } from "react-native-vector-icons/Icon";

const StyledView = styled(View);
const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);

interface Props {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    iconName: IconProps["name"];
    iconColor?: IconProps["color"];
}

export const BasicButtonWithIcon: React.FC<Props> = ({
    title,
    onPress,
    ...props
}) => {
    return (
        <StyledView className="flex p-1 w-fit">
            <StyledButton
                onPress={onPress}
                className="w-auto rounded items-center p-3"
            >
                <FontAwesome name={props.iconName} size={20} color="white" />
                <StyledText className="px-2 min-w-fit text-white">
                    {title}
                </StyledText>
            </StyledButton>
        </StyledView>
    );
};
