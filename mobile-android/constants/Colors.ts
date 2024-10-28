/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: {
      navBar: {
        inactive: "#273240",
        active: "#5A6ACF",
      },
      title: "#5A6ACF",
    } ,
    // '#11181C',
    bg: {
      // navBar: "#F1F2F7",
      // "#E4E7F5"
      active: "#E4E7F4",
      navBar: "#F1F2F7",
      inputBox: "#F6F6FB",
      button: {
        basic: "#A4B3FF",
        hover: "#E4RE7F5",
      }
    },
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
