import styled from "styled-components";
import { useEffect, useState } from "react";
import { DogImage } from "../interfaces/DogImage.ts";


const AllDogsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;    
    justify-content: space-evenly;
`;

const SingleDogDiv = styled.div`
    display: flex;
    flex-direction: column;   
    justify-content: center;
    max-width: 40%;
    padding: 2%;
    margin: 1%;
    background-color:lightblue;
    border: 3px lightblue solid;
    border-radius: 20px;
    text-align: center;
    font: italic small-caps bold calc(2px + 1vw) "Georgia", serif;
    

    img {
        max-width: 100%;
        height: auto;
        border-radius: 10px;
    }
`;

export default function RandomDog() {
    const [dogImages, setDogImages] = useState<DogImage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchDogImages();
    }, []);

    const fetchDogImages = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://dog.ceo/api/breeds/image/random/10");
            const data = await response.json();
            
            // Mapping the image URLs to include breed
            const images = data.message.map((url: string) => {
                const breed = extractBreedFromUrl(url);
                return { id: url.split("/").pop() || `${Math.random()}`, breed, image: url };
            });
            
            setDogImages(images);
        } catch (error) {
            console.error("Error fetching dog images:", error);
        } finally {
            setLoading(false);
        }
    };

    // Extract the breed name from the image URL
    const extractBreedFromUrl = (url: string): string => {
        const regex = /breeds\/([a-zA-Z0-9-]+)\//;
        const match = url.match(regex);
        return match ? match[1].replace('-', ' ').toUpperCase() : "Unknown Breed";
    };

    return (
        <AllDogsDiv>
            {
                dogImages.map((dog) => (
                    <SingleDogDiv key={dog.id}>
                        <h2>{dog.breed}</h2>
                        <img
                            src={dog.image}
                            alt={`Random ${dog.breed}`}
                            onError={(e) => {
                                e.currentTarget.src = 'path/to/fallback-image.png'; // Fallback image
                            }}
                        />
                    </SingleDogDiv>
                ))
            }
        </AllDogsDiv>
    );
}