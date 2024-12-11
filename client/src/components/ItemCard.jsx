import "./ItemCard.css";
import "./SingleItem";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  console.log(item);
  return (
    <div className="item-card">
      <h3 className="item-name">{item.item_name}</h3>
      <img src={item.item_imgurl} alt={item.item_name} />
      <p>{item.item_category_primary}</p>
      <p>{item.item_category_secondary}</p>
      <p>{item.item_average_rating}</p>
      <p>{item.item_id}</p>
      <Link to={`/item/${item.item_id}`}>View Item</Link>
    </div>
  );
};

export default ItemCard;
