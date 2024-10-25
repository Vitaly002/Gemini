import React, { useState, createContext } from "react";
import runChat from "../config/gemini"

export const Context = createContext();

const ContextProvider = (props) => {

    const[input, setInput] = useState("");
    const[recentPrompt, setRecentPrompt] = useState("");
    const[prevPrompts, setPrevPrompts] = useState([]);
    const[showResult, setShowResult] = useState(false);
    const[loading, setLoading] = useState(false);
    const[resultData, setResultData] = useState("");
    const [conversationHistory, setConversationHistory] = useState([]); // New state

    // const delayPara = (index,nextWord) => {
    //     setTimeout(function () {
    //         setResultData(prev=>prev+nextWord);
    //     }, 75*index);
    // }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setConversationHistory([]); // Clear history for a new chat session
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        const currentPrompt = prompt !== undefined ? prompt : input;
        setPrevPrompts(prev => [...prev, currentPrompt]);
        setRecentPrompt(currentPrompt);

        // Fetch the response for the prompt
        response = await runChat(currentPrompt);

        // Append to conversation history
        setConversationHistory(prevHistory => [
            ...prevHistory,
            { prompt: currentPrompt, response } // Store prompt and response together
        ]);

        setLoading(false);
        setInput("");
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        conversationHistory, // Provide the conversation history
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}

export default ContextProvider;