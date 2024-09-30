import { Text, View } from "react-native";
import { styled } from "nativewind";
import { Link } from "expo-router";

const StyledText = styled(Text);
const StyledView = styled(View);

export default function Index() {
    return (
        <StyledView className="flex-1 justify-center items-center bg-white px-6">
            <StyledText className="text-3xl">Area!</StyledText>
            <Link href="/login" className="text-blue-500">
                Login
            </Link>
            <Link href="/sign-up" className="text-blue-500">
                Sign up
            </Link>
        </StyledView>
    );
}
