require("dotenv").config();
const {
  client,
  createTables,
  authenticate,
  fetchUsers,
  createItem,
  fetchItems,
  fetchSingleItem,
  deleteItems,
  createReview,
  fetchReviews,
  deleteReview,
  createComment,
  fetchComments,
  deleteComment,
  fetchItemsByCategory,
  updateComment,
  fetchSingleUser,
} = require("./db");
const express = require("express");
const app = express();
app.use(express.json());

const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

// middleware login function
const isLoggedIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Token required");
    }
    const token = req.headers.authorization;
    req.user = await findUserByToken(token);
    console.log("Authenticated user:", req.user);
    next();
  } catch (ex) {
    next(ex);
  }
};

// connect a route to login a user
app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

// connect a route to fetch for users
app.get("/api/users", async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send(users);
});

// connect a route to fetch for items
app.get("/api/items", async (req, res) => {
  const items = await fetchItems();
  res.status(200).json(items);
});

// connect a route to fetch for a single item
app.get("/api/item/:id", async (req, res) => {
  const singleItem = await fetchSingleItem({ item_id: req.params.id });
  res.status(200).json(singleItem);
});

// connect a route to post items, admin only
app.post("/api/item", async (req, res) => {
  const {
    item_name,
    item_imgurl,
    item_category_primary,
    item_category_secondary,
  } = req.body;
  const createPlace = await createItem(
    item_name,
    item_imgurl,
    item_category_primary,
    item_category_secondary
  );
  res.status(200).json({ createPlace });
});

// connect a route to update items, admin only
app.put("/api/item", async (req, res) => {
  const id = req.params.id;
  const { item_name, item_category_primary, item_category_secondary } =
    req.body;
  const updateItems = await updateItem(
    item_name,
    item_category_primary,
    item_category_secondary,
    id
  );
  res.status(200).json({ updateItems });
});

// connect a route to delete an item
app.delete("/api/items/:id", async (req, res) => {
  await deleteItems({ item_id: req.params.id });
  res.sendStatus(204);
});

// connect a route to fetch for reviews
app.get("/api/users/:id/reviews", async (req, res) => {
  const reviews = await fetchReviews(req.params.id);
  res.status(200).send(reviews);
});

// connect a route to post reviews
app.post("/api/reviews", async (req, res) => {
  const [item_id, review_title, review_text, review_rating, user_id] = req.body;
  const makeReview = createReview(
    item_id,
    review_title,
    review_text,
    review_rating,
    user_id
  );
  res.status(200).json({ makeReview });
});

// // connect a route to delete a review
// app.delete("/api/reviews/:id", async (req, res) => {
//   await deleteReview({ review_id: req.params.id });
//   res.sendStatus(204);
// });

// this appears to be a route for users to delete their own reviews
// connect a route to delete reviews
app.delete("/api/users/:userId/reviews/:reviewId", async (req, res, next) => {
  try {
    // Check if the logged-in user is authorized to delete the review
    if (req.params.userId !== req.user.id) {
      const error = new Error("Not authorized");
      error.status = 401;
      throw error;
    }
    // Delete the review using the correct userId and reviewId - wm
    await deleteReview({ user_id: req.params.userId, id: req.params.reviewId });

    // Send status 204 (No Content) to indicate successful deletion - wm
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// connect a route to fetch for comments
app.get("/api/users/:id/comments", async (req, res) => {
  const comments = await fetchComments(req.params.id);
  res.status(200).send(comments);
});

// connect a route to post a comment
app.post("/api/comment", async (req, res) => {
  const { comment_text, review_id, user_id } = req.body;
  const makeComment = createComment(comment_text, review_id, user_id);
  res.status(200).json({ makeComment });
});

// connect a route to delete comments
app.delete("/api/comment", async (req, res) => {
  const commentId = req.body.comment_id;
  await deleteComment(commentId);
  res.status(200).json({ message: "record has been deleted successfully" });
});
// update review
app.put("/api/reviews/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const { review_title, review_text, review_rating } = req.body;
  const user_id = req.user.id;

  // review rating
  if (review_rating <= 0 || review_rating > 10) {
    return res
      .status(400)
      .json({ message: "Rating must be between 1 and 10." });
  }

  // Update the review in the database
  try {
    const result = await client.query(
      `
      UPDATE item_reviews
      SET review_title = $1, review_text = $2, review_rating = $3
      WHERE review_id = $4 AND user_id = $5
      RETURNING *;
      `,
      [review_title, review_text, review_rating, reviewId, user_id]
    );

    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Review updated successfully!",
        updatedReview: result.rows[0],
      });
    } else {
      res.status(404).json({
        message: "Review not found or you don't have permission to update it.",
      });
    }
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the review." });
  }
});
// connect a route to list restaurants by category
app.get("/api/items/:category-primary", async (req, res) => {
  const items = await fetchItems();
  res.status(200).send(items);
});

// connect a route to update a comment
app.put("/api/comments/:comment_id", async (req, res) => {
  const id = req.params.id;
  const { comment_text } = req.body;
  const updateComment = await reviseComment(id, comment_text);
  res.status(200).json({ updateComment });
});

const init = async () => {
  await client.connect();
  console.log("connected to database");
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });

  await createTables();
  console.log("tables created");

  // await createItem({
  //   item_name: "Pizza Hut",
  //   item_imgurl:
  //     "https://logos-world.net/wp-content/uploads/2021/10/Pizza-Hut-Logo.png",
  //   item_category_primary: "Pizza",
  //   item_category_secondary: "Dinner",
  // });

  // await createItem({
  //   item_name: "Starbucks",
  //   item_imgurl:
  //     "https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg",
  //   item_category_primary: "Coffee",
  //   item_category_secondary: "Breakfast",
  // });

  // await createItem({
  //   item_name: "Waffle House",
  //   item_imgurl:
  //     "https://logos-world.net/wp-content/uploads/2023/08/Waffle-House-Logo.png",
  //   item_category_primary: "Waffles",
  //   item_category_secondary: "Breakfast",
  // });

  // console.log("data seeded");
};

init();
