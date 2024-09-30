import RandomDog from "./components/RandomDog.tsx"; 
import styled from "styled-components";
import { useEffect, useState } from "react";
import { DogImage } from "./interfaces/DogImage.ts";

const ParentDiv = styled.div`
    width: 80vw;
    margin: auto;
    text-align: center;
    font: calc(2px + 1vw) "Georgia", serif; 
 
    h1 {
        color: darkblue;
    }
`;


export default function App() {
    
    const [data, setData] = useState<DogImage[]>([]);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            try {
                const rawData = await fetch("https://dog.ceo/api/breeds/image/random/10");
                const result = await rawData.json();
                
                // Initialize a Set to track unique image URLs
                const uniqueImages = new Set<string>();

                // Mapping the image URLs to include breed
               // Filter the images to ensure no duplicates

                const images = result.message
                .filter((url: string) => {
                    if (uniqueImages.has(url)) {
                        return false; // Skip duplicate images
                    }
                    uniqueImages.add(url);
                    return true;
                })
                .map((url: string) => {
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

    // Function to extract and format the breed name from the image URL
// Function to extract and format the breed name from the image URL
const extractBreedFromUrl = (url: string): string => {
    // Define a regular expression to find the breed name in the URL.
    const regex = /breeds\/([a-zA-Z0-9-]+)\//;

    // Use the regex to match against the provided URL and capture the breed name.
    const match = url.match(regex);

    // List of breeds where the order should not be reversed
    // I noticed some exceptions when I kept calling the API
    const exceptionBreeds = ["australian-shepherd"];

    // Check if a match was found:
    if (match) {
        const breed = match[1]; // Get the breed part of the URL

        // If the breed is in the exception list, return it as-is with proper formatting
        if (exceptionBreeds.includes(breed)) {
            return breed
                .split('-') // Split the breed name by the hyphen
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
                .join(' '); // Join the words back into a single string 
        }

        // Otherwise, reverse the breed name and return it
        return breed
            .split('-') // Split the breed name by the hyphen
            .reverse()  // Reverse the order of the split parts
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
            .join(' '); 
    }

    return "Unknown Breed"; // Return "Unknown Breed" if the URL does not contain a valid breed.
};

    return (
        <ParentDiv>
            <h1> Random Dog Generator</h1>
            <RandomDog data={data} />
        </ParentDiv>
    );
}