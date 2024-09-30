import styled from "styled-components";
import { DogImage } from "../interfaces/DogImage.ts";

const AllDogsDiv = styled.div`
    display: flex;
    flex-flow: row wrap;    
    justify-content: space-evenly;
    background-color: lightblue;
    border-radius: 20px;
`;

const SingleDogDiv = styled.div`
    display: flex;
    flex-direction: column;   
    justify-content: center;
    max-width: 40%;
    padding: 2%;
    margin: 1%;
    background-color: white;
    border-radius: 20px;
    text-align: center;
    font: italic small-caps bold calc(2px + 1vw) "Georgia", serif;

    img {
        max-width: 100%;
        height: auto;
        border-radius: 10px;
    }
`;

const BreedName = styled.h2`
    font-family: 'Your Desired Font Family', sans-serif; // Specify your font family
    font-size: 1.5rem; // Change the font size as needed
    color: darkblue; // Change the text color as needed
    // Add other styles as needed
`;


export default function RandomDog(props: {data: DogImage[]}) {
    return (
        <AllDogsDiv>
            {
                props.data.map((char: DogImage) => (
                    <SingleDogDiv key={char.id}>
                        <BreedName>{char.breed}</BreedName>
                        <img
                            src={char.image}
                            alt={`${char.breed}`}
                        />
                    </SingleDogDiv>
                ))
            }
        </AllDogsDiv>
    );
}