import { Text, View } from "react-native";
import { styled } from "nativewind";
import { TextInput } from "@/components/TextInput";
import LoginScreen from "@/components/LoginScreen";
const StyledText = styled(Text);
const StyledView = styled(View);
// import { TextInput as RNTextInput, TextInputProps } from 'react-native';

export default function Index() {
    return (
        <StyledView className="flex-1 justify-center items-center bg-white px-6">
            <StyledText className="text-3xl">Area!</StyledText>
            <LoginScreen />
        </StyledView>
    );
}
