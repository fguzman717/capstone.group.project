import { useState, useEffect } from "react";

const DeleteReview = ({ user }) => {
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      const response = await fetch(`/api/users/${user}/reviews`);
      const result = await response.json();
      setUserReviews(result);
    };

    fetchUserReviews();
  }, [user]);

  const removeUserReviews = async (id) => {
    try {
      const response = await fetch(`/api/users/${user}/reviews/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review!");
      }

      setUserReviews((previousReviews) =>
        previousReviews.filter((review) => review.id !== id)
      );
    } catch (error) {
      console.error("Error deleting review!", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      {userReviews.map((review) => (
        <div key={review.review_id}>
          <p>{review.review_text}</p>
          {review.user_id === user.id && (
            <button onClick={() => removeUserReviews(review.review_id)}>
              Remove Review
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default deleteReview;
