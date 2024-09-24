import RandomDog from "./components/RandomDog.tsx"; // Assuming the RandomDog component is saved in components
import styled from "styled-components";
import { useEffect, useState } from "react";


const ParentDiv = styled.div`
    width: 80vw;
    margin: auto;
`;

export default function App() {
    const [dogImage, setDogImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchDogImage();
    }, []);

    const fetchDogImage = async () => {
        setLoading(true); // Set loading to true while fetching
        try {
            const response = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await response.json();
            setDogImage(data.message); // Set the dog image URL
        } catch (error) {
            console.error("Error fetching dog image:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ParentDiv>
            {
                <RandomDog />
            }
        </ParentDiv>
    );
}