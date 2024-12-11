import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./ItemCard.css";

const SingleItemView = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/item/${id}`);
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
    fetchItem();
  }, []);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="single-item">
      <h1 className="single-name">{item.item_name}</h1>
      <img src={item.item_imgurl} alt={item.item_name} />
      <p>Primary Category: {item.item_category_primary}</p>
      <p>Secondary Category: {item.item_category_secondary}</p>
      <Link to={"/"}>go back</Link>
    </div>
  );
};

export default SingleItemView;
