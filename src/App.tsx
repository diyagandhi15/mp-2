import RandomDog from "./components/RandomDog.tsx"; 
import styled from "styled-components";
import { useEffect, useState } from "react";
import { DogImage } from "./interfaces/DogImage.ts";

const ParentDiv = styled.div`
    width: 80vw;
    margin: auto;
    text-align: center;
`;

const TitleText = styled.h2`
    font-family: 'Your Desired Font Family', sans-serif; // Specify your font family
    font-size: 1.5rem; // Change the font size as needed
    color: darkblue; // Change the text color as needed
    // Add other styles as needed
`;

export default function App() {
    
    const [data, setData] = useState<DogImage[]>([]);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            try {
                const rawData = await fetch("https://dog.ceo/api/breeds/image/random/10");
                const result = await rawData.json();
                
                // Mapping the image URLs to include breed
                const images = result.message.map((url: string) => {
                    const breed = extractBreedFromUrl(url);
                    return { id: url.split("/").pop() || `${Math.random()}`, breed, image: url };
                });
                
                setData(images);
            } catch (error) {
                console.error("Error fetching dog images:", error);
            }
        }

        fetchData();
    }, []);

    // Function to extract breed from image URL
    // Used to derive the breed from the image URL, 
    // The api used doesn't extract the breedn name automatically to display, 
    // so it will have to be done manually
    const extractBreedFromUrl = (url: string): string => {
        // Define a regular expression to find the breed name in the URL.
        const regex = /breeds\/([a-zA-Z0-9-]+)\//;
    
        // Use the regex to match against the provided URL and capture the breed name.
        const match = url.match(regex);
    
        // Check if a match was found:
        return match 
            // If a match is found, process the captured breed name:
            ? match[1]                  // Get the first captured group, which is the breed name.
                .replace('-', ' ')      // Replace hyphens in the breed name with spaces.
                .toUpperCase()          // Convert the breed name to uppercase.
            // If no match was found, return a default value:
            : "Unknown Breed";          // Return "Unknown Breed" if the URL does not contain a valid breed.
    };

    return (
        <ParentDiv>
            <TitleText> Random Dog Generator</TitleText>
            <RandomDog data={data} />
        </ParentDiv>
    );
}