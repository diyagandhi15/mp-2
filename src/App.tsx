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
                // Was testing and saw that sometimes when the page was refreshed 
                // there would be multiple of the same dog image
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
// Upon running the API in Postman I found that the interface returned was just the text, and a status
// Had to create an interface and extract the breed from the URL where it is visible in order to display the text
const extractBreedFromUrl = (url: string): string => {
    // Split the URL into parts based on the '/' delimiter
    const parts = url.split('/');

    // Find the index of 'breeds'
    // URL contains 'breeds' and after / the actual breed name of the dog is provided
    const breedIndex = parts.indexOf('breeds');

    // Check if 'breeds' is found and has a next part
    if (breedIndex !== -1 && breedIndex + 1 < parts.length) {
        const breed = parts[breedIndex + 1]; // Get the breed part of the URL

    // List of breeds where the order should not be reversed
    // I noticed some exceptions when I kept calling the API, 
    // not sure if there are any more but this exception was getting reversed 
    // Shepherd Australian
    const exceptionBreeds = ["australian-shepherd"];

    // If the breed is in the exception list, return it with proper formatting
    if (exceptionBreeds.includes(breed)) {
        return breed
            .split('-') // Split the breed name by the hyphen
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
            .join(' '); // Join the words back into a single string 
    }

    // Otherwise, reverse the breed name and return it
    // In most of the URLs, the breed name is displayed as retriever-golden
    // Reverse the breed name so it displays Golden Retriever
    return breed
        .split('-') // Split the breed name by the hyphen
        .reverse() // Reverse the order of the split parts
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join(' '); // Join the words back into a single string
    }

    return "Unknown Breed"; // Return null if no breed is found
};

    return (
        <ParentDiv>
            <h1> Random Dog Generator</h1>
            <RandomDog data={data} />
        </ParentDiv>
    );
}