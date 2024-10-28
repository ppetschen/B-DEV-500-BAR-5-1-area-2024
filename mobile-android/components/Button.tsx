/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** Button component
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
import Icon from "react-native-vector-icons/MaterialIcons";


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
                className="flex-row w-auto h-auto py-2 px-2 rounded align-middle items-center bg-button-basic text-white"
            >
                <Icon name={props.iconName} size={20} color="white" />
                <StyledText className="px-2 min-w-fit text-white">
                    {title}
                </StyledText>
            </StyledButton>
        </StyledView>
    );
};
