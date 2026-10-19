import React, { useState, useEffect } from "react";
import "./App.css";
const ACCESS_KEY = import.meta.env.ACCESS_KEY;
function App() {
  const [catData, setCatData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.thecatapi.com/v1/breeds",
        {
          headers: { "x-api-key": "live_3oChAgK6U7mjH0z8FPFMSrRWaPaLcELWDANfOH8LuJiPtgM54v8AjrreCzOydfHO" },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      const validCats = data.filter((cat) => {
        const attributes = [
          cat.name,
          cat.life_span,
          cat.origin,
          cat.weight?.imperial,
        ];

        return (
          cat.reference_image_id &&
          !attributes.some((attribute) =>
            bannedAttributes.includes(attribute)
          )
        );
      });

      if (validCats.length === 0) {
        console.error("No available cats!");
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * validCats.length
      );

      const selectedCat = validCats[randomIndex];

      const imageUrl =
        selectedCat.image?.url ||
        `https://cdn2.thecatapi.com/images/${selectedCat.reference_image_id}.jpg`;

      const image = new Image();

      image.onload = () => {
        setCatData({
          ...selectedCat,
          weight: selectedCat.weight?.imperial,
          imageUrl,
          randomName: catNames[
            Math.floor(Math.random() * catNames.length)
          ],
        });
      };

      image.onerror = () => {
        console.error("Failed to load cat image.");
      };

      image.src = imageUrl;

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleBanAttribute = (attribute) => {
    if (!bannedAttributes.includes(attribute)) {
      setBannedAttributes([...bannedAttributes, attribute]);
    }
  };
  const handleRemoveBannedAttribute = (attribute) => {
    const updatedAttributes = bannedAttributes.filter((attr) => attr !== attribute);
    setBannedAttributes(updatedAttributes);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const catNames = [
    "Buddy",
    "Max",
    "Bailey",
    "Charlie",
    "Lucy",
    "Cooper",
    "Lola",
    "Daisy",
    "Rocky",
    "Molly",
    "Stella",
    "Coco",
    "Ruby",
    "Bear",
    "Lily",
    "Zoe",
    "Milo",
    "Leo",
    "Oliver",
    "Luna",
  ];
  return (
    <>
      <div className="center-page">
        <h1>Cat Junction!</h1>
        <h3>Look at some cool cats!</h3>
        <br></br>
        <br></br>
        <div className="discover-container">
          {buttonClicked && catData !== null && (
            <div className="listening-container">
              <h2 className="cat-name">{catData.randomName}</h2>
              <div className="buttons">
                <button type="attribute" className="attribute-buttons" onClick={() => handleBanAttribute(catData.life_span)}>
                  {catData.life_span}
                </button>
                <button type="attribute" className="attribute-buttons" onClick={() => handleBanAttribute(catData.name)}>
                  {catData.name}
                </button>
                <button type="attribute" className="attribute-buttons" onClick={() => handleBanAttribute(catData.weight)}>
                  {catData.weight}
                </button>
                <button type="attribute" className="attribute-buttons" onClick={() => handleBanAttribute(catData.origin)}>
                  {catData.origin}
                </button>
                <br></br>
              </div>

              <img
                className="cat-pic"
                src={`https://cdn2.thecatapi.com/images/${catData.reference_image_id}.jpg`}
                alt="random image from Cat API"
                height="250px"
                width="250px"
              />
            </div>
          )}
          <br></br>
          <button
            type="discover"
            className="discover-btn"
            onClick={() => {
              fetchData();
              setButtonClicked(true);
            }}
          >
            🔀 Discover!
          </button>
        </div>
      </div>
      <div className="right-section">
        <h2>Banned Attributes</h2>
        <div className="banned-attributes-container">
          {bannedAttributes.map((attribute) => (
            <button key={attribute} className="banned-attribute-buttons" onClick={() => handleRemoveBannedAttribute(attribute)}>
              {attribute}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
