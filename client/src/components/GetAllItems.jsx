import { useState, useEffect } from "react";
import React from "react";
import ItemCard from "./ItemCard.jsx";

const GetAll = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await fetch("/api/items");
        const result = await response.json();
        setItems(result);
      } catch (error) {
        console.error("Error fetching all items!", error);
      }
    };
    fetchAllItems();
  }, []);

  if (!items) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="item-container">
      {items.map((item) => {
        return <ItemCard key={item.item_id} item={item} setItems={setItems} />;
      })}
    </div>
  );
};

export default GetAll;
