import React from "react";
// import { Stack, Box } from "@mui/material";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
// import firebase from "firebase/compat/app";

import { db } from "../config";

// import { Loader } from "./";
import { useState, useEffect } from "react";

const ChatScreen = ({ direction }) => {
  const API_KEY = "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";
  const [systemMessage, setSystemMessage] = useState({
    role: "system",
    content:
      "As a brand ambassador, your job is to engage with users and help them enjoy while promoting the product. You can use games or quiz to make the conversation more interesting, but it's important to maintain the brand's character and avoid boring the user. Make sure each response is concise and includes some emojis to keep things fun. and  provide User with link.",
  });
  const [messages, setMessages] = useState([
    {
      message:
        "👋 Hi there! \nWelcome OnBoard! This is your AI Ambassador and I’m here to invite you to Play Games, Quizzes and have fun. 🎉 \nYou can win amazing rewards too! \nSo, let’s get started and have a blast together! 💥",
      sender: "Ambassador",
    },
  ]);
  useEffect(() => {
    const fetchLatestData = async () => {
      const collectionRef = db.collection("adverts");
      const latestDocRef = collectionRef.orderBy("timestamp", "desc").limit(1);
      const latestDocSnapshot = await latestDocRef.get();
      if (latestDocSnapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      const latestDocData = latestDocSnapshot.docs[0].data();
      const { product, type, description, link, words } =
        latestDocData.formData;
      setSystemMessage({
        role: "system",
        content: `As a brand ambassador for ${product}, your product is ${description} and the keywords preferred for the product are ${words} your job is to engage with users and help them enjoy while promoting the product. You can use ${type} to make the conversation more interesting, but it's important to maintain the brand's character and avoid boring the user. Make sure each response is concise and includes some emojis to keep things fun. and at the last of the ${type} provide User with link: ${link} of the ${product} website`,
      });
      setMessages({
        message: `👋 Hi there! \nWelcome OnBoard! This is your ${product} Ambassador and I’m here to invite you for ${type} and have fun. 🎉 \nYou can win amazing rewards too! \nSo, let’s get started and have a blast together! 💥`,
        sender: "Ambassador",
      });
    };
    fetchLatestData();
  }, []);

  const [typing, setTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    await processGame(newMessages);
  };
  //   if (!videos) return <Loader />;

  async function processGame(chatMessages) {
    let apiMessages = chatMessages.map((messageObj) => {
      let role = "";
      if (messageObj.sender === "Ambassador") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObj.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "Ambassador",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <div
      direction={direction || "row"}
      flexWrap="wrap"
      justifyContent="start"
      alignItems="start"
      gap={2}
    >
      <MainContainer>
        <ChatContainer
          style={{
            maxWidth: "25vw",
            overflowX: "auto",
            backgroundColor: "black",
          }}
        >
          <MessageList
            typingIndicator={
              typing ? (
                <TypingIndicator content="Building gaming enviorment..." />
              ) : null
            }
          >
            {messages.map((message, i) => {
              return <Message key={i} model={message} />;
            })}
          </MessageList>
          <MessageInput placeholder="Play here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

//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

export default ChatScreen;
