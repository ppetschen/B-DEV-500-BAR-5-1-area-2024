import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaTwitch,
} from "react-icons/fa";
import {
  SiGmail,
  SiGooglecalendar,
  SiGoogledrive,
  SiMicrosoftoutlook,
  SiNotion,
} from "react-icons/si";

export const services = [
  {
    name: "Google",
    description: "Google is a search engine",
    icon: FaGoogle,
    category: "Productivity",
  },
  {
    name: "GitHub",
    description: "GitHub is a code hosting platform",
    icon: FaGithub,
    category: "Developer Tools",
  },
  {
    name: "Facebook",
    description: "Facebook is a social media platform",
    icon: FaFacebook,
    category: "Advertising",
  },
  {
    name: "Outlook",
    description: "Outlook is an email service",
    icon: SiMicrosoftoutlook,
    category: "Productivity",
  },
  {
    name: "Discord",
    description: "Discord is a communication platform",
    icon: FaDiscord,
    category: "Communication",
  },
  {
    name: "Twitch",
    description: "Twitch is a live-stream platform",
    icon: FaTwitch,
    category: "Live-streaming",
  },
  {
    name: "Google-Mail",
    description: "Google mail is an email service",
    icon: SiGmail,
    category: "Productivity",
  },
  {
    name: "Google-Drive",
    description: "Google drive is a cloud storage service",
    icon: SiGoogledrive,
    category: "Productivity",
  },
  {
    name: "Google-Calendar",
    description: "Google calendar is a calendar service",
    icon: SiGooglecalendar,
    category: "Productivity",
  },
  {
    name: "Notion",
    description: "Notion is a versatile workspace tool",
    icon: SiNotion,
    category: "Productivity",
  },
];
