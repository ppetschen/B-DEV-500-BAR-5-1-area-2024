/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** profile
 */
 import { Text, View } from "react-native";
 import React from "react";
 import { styled } from "nativewind";


 const StyledText = styled(Text);
 const StyledView = styled(View);

 export default function ServicesPage() {
     return (
         <StyledView className="flex-1 justify-center items-center bg-white px-6">
             <StyledText className="text-3xl">HELLO WORLD</StyledText>
         </StyledView>
     );
 }
