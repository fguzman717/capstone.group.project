import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const baseURL = "APIURLGOESHERE";




function Account({ token, setToken, baseURL, getUserReview }) {


  const [account, setAccount] = useState(null); // Initially null to show loading state
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();


  // Fetch account details
  useEffect(() => {
    async function fetchAccount() {
      try {
        const response = await fetch(`${baseURL}/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setAccount(result);
      } catch (error) {
        console.error("Error fetching account details:", error);
        setAccount(null);
      }
    }


    fetchAccount();
  }, [token, baseURL]); // Dependency array includes token and baseURL


  // Fetch reviews for the user
  useEffect(() => {
    async function fetchReviews() {
      try {
        const userReviews = await getUserReview(token);
        setReviews(userReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }


    fetchReviews();
  }, [token, getUserReview]);


  // Handle review deletion
  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${baseURL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.ok) {
        setReviews(reviews.filter((review) => review.review_id !== reviewId));
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };


  // If account details are still loading
  if (!account) {
    return <div>Loading account details...</div>;
  }


  // If no token is provided, navigate to login
  if (!token) {
    navigate("/login");
    return null;
  }


  return (
    <div>
      <h2>Account Details</h2>
      <p>Username: {account?.username}</p>
      <p>Email: {account?.email}</p>


      <h2>Reviews</h2>
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review.review_id}>
              <strong>{review.review_title}</strong>: {review.review_text}
              <button onClick={() => deleteReview(review.review_id)}>Delete Review</button>
            </li>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </ul>
    </div>
  );
}


export default Account;






