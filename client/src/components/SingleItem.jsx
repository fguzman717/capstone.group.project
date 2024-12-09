import React, { useState, useEffect } from "react";

const SingleItemView = ({ itemId }) => {
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/item/${itemId}`);
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
    fetchItem();
  }, [itemId]);

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item.item_name}</h1>
      <img src={item.item_imgurl} alt={item.item_name} />
      <p>Primary Category: {item.item_category_primary}</p>
      <p>Secondary Category: {item.item_category_secondary}</p>
    </div>
  );
};

export default SingleItemView;
