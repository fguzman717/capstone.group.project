import React, { useState } from "react";

const CreateReviewForm = ({ userInfo, token }) => {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { item_id, review_title, review_text, review_rating } = formData;

    // Validate form inputs
    if (!item_id || !review_title || !review_text || !review_rating) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id,
          review_title,
          review_text,
          review_rating: Number(review_rating),
          user_id: userInfo.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Review submitted successfully!");
        setFormData({});
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div>
      <h2>Submit a Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Item ID:
            <input
              type="text"
              name="item_id"
              value={formData.item_id || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Review Title:
            <input
              type="text"
              name="review_title"
              value={formData.review_title || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Review Text:
            <textarea
              name="review_text"
              value={formData.review_text || ""}
              onChange={handleChange}
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            Review Rating (1-5):
            <input
              type="number"
              name="review_rating"
              min="1"
              max="5"
              value={formData.review_rating || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateReviewForm;
