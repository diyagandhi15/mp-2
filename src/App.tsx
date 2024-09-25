import RandomDog from "./components/RandomDog.tsx"; 
import styled from "styled-components";
import { useEffect, useState } from "react";
import { DogImage } from "./interfaces/DogImage.ts";

const ParentDiv = styled.div`
    width: 80vw;
    margin: auto;
    text-align: center;
`;

export default function App() {
    
    // useState Hook to store Data.
    const [data, setData] = useState<DogImage[]>([]);

    // useEffect Hook for error handling and re-rendering.
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
    const extractBreedFromUrl = (url: string): string => {
        const regex = /breeds\/([a-zA-Z0-9-]+)\//;
        const match = url.match(regex);
        return match ? match[1].replace('-', ' ').toUpperCase() : "Unknown Breed";
    };

    return (
        <ParentDiv>
            <h1> Random Dog Generator</h1>
            <RandomDog data={data} />
        </ParentDiv>
    );
}