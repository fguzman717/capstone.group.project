require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(process.env.key);
const bcrypt = require("bcrypt");

const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS review_comments;
        DROP TABLE IF EXISTS item_reviews;
        DROP TABLE IF EXISTS capstone_users;
        DROP TABLE IF EXISTS capstone_items;

        CREATE TABLE capstone_users (
	        user_id INT PRIMARY KEY,
	        username VARCHAR(50) UNIQUE NOT NULL,
	        password VARCHAR(50),
	        email VARCHAR(50) NOT NULL,
	        is_admin BOOLEAN,
	        created_at TIMESTAMP DEFAULT now(),
	        updated_at TIMESTAMP DEFAULT now()
	        );

        CREATE TABLE capstone_items (
            item_id SERIAL PRIMARY KEY,
            item_name VARCHAR(100) UNIQUE NOT NULL,
            item_imgurl VARCHAR(100) NOT NULL,
            item_category_primary VARCHAR(50) NOT NULL,
            item_category_secondary VARCHAR(50) NOT NULL,
            item_average_rating NUMERIC(2, 2)
            );

        CREATE TABLE item_reviews (
            review_id INT PRIMARY KEY,
            review_title varchar(50),
            review_text varchar(500),
            review_rating INT CHECK (review_rating > 0),
            CHECK (review_rating <= 10),
            item_id INT REFERENCES capstone_items(item_id),
            user_id INT REFERENCES capstone_users(user_id),
            CONSTRAINT item_user_combo UNIQUE (item_id, user_id)
        );

        CREATE TABLE review_comments (
	        comment_id INTEGER PRIMARY KEY,
            comment_text VARCHAR(200),
            review_id INTEGER REFERENCES item_reviews NOT NULL,
            user_id INTEGER REFERENCES capstone_users NOT NULL
            );
            `;
  await client.query(SQL);
};

// create a function that authenticates a user
const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [username]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return { token };
};

// USER TABLE FUNCTION 
// create a function that fetches all users from the users table
const fetchUsers = async () => {
  try {
    const SQL = `
    SELECT * FROM capstone_users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error("there was an error fetching all users", error);
  }
};

// USER TABLE FUNCTION 
const fetchSingleUser = async ({ user_id }) => {
  try {
    const SQL = `
    SELECT * FROM capstone_users
    WHERE user_id = $1;
    `;
    const response = await client.query(SQL, [user_id]);

    if (response.rows.length === 0) {
      throw new Error(`User Not Found`);
    }

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

// ITEMS TABLE FUNCTION 
// ADMIN ONLY FUNCTION 
// create a function that adds an item to the items table
const createItem = async ({
  item_name,
  item_imgurl,
  item_category_primary,
  item_category_secondary,
}) => {
  try {
    const SQL = `
    INSERT INTO capstone_items (item_name, item_imgurl, item_category_primary,
    item_category_secondary)
    VALUES ($1,$2,$3,$4)
    RETURNING *`;
    const response = await client.query(SQL, [
      item_name,
      item_imgurl,
      item_category_primary,
      item_category_secondary,
    ]);
  } catch (error) {
    console.error("there was an error creating that item", error);
  }
};

// ITEMS TABLE FUNCTION 
// create a function that fetches all items from the users items 
// What do we mean by users items? it's just fetching all the restaurants.
const fetchItems = async () => {
  try {
    const SQL = `
    SELECT * FROM capstone_items;
    `;
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error("there was an error fetching all items", error);
  }
};

// ITEMS TABLE FUNCTION
// create a function to fetch a single item from the items table
const fetchSingleItem = async ({ item_id }) => {
  try {
    const SQL = `
    SELECT * FROM capstone_items
    WHERE item_id = $1;
    `;
    const response = await client.query(SQL, [item_id]);

    if (response.rows.length === 0) {
      throw new Error(`Item, ${item_id}, does not exist`);
    }

    return response.rows[0];
  } catch (error) {
    console.error(error.message);
  }
};

// ITEMS TABLE FUNCTION
// ADMIN ONLY FUNCTION 
// create a function to delete an item by its ID from the items table
const deleteItems = async ({ item_id }) => {
  try {
    const itemCheckSQL = `
    SELECT item_id FROM capstone_items
    WHERE item_id = $1;
    `;
    const response = await client.query(itemCheckSQL, [item_id]);

    if (response.rows.length === 0) {
      throw new Error(`Item, ${item_id}, does not exist`);
    }

    const SQL = `
    DELETE FROM capstone_items
    WHERE item_id = $1;
    `;
    await client.query(SQL, [item_id]);
    console.log(`${item_id} has been deleted successfully`);
  } catch (error) {
    console.error(error.message);
  }
};

// ITEMS TABLE FUNCTION 
// create a function to display restaurants by category
const fetchItemsByCategory = async () => {
  try {
    const SQL = `
    SELECT * FROM capstone_items GROUP BY item_category_primary;
    `;
    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error("there was an error getting restaurants by category", error);
  }
};

// REVIEWS TABLE FUNCTION 
// create a function that adds a review to the reviews table
async function createReview({ comment_text, review_id, user_id }) {
  try {
    const results = await client.query(
      `
    INSERT INTO item_reviews(item_id, review_title, review_text, review_rating, user_id)
    VALUES ($1,$2,$3,$4,$5) RETURNING *
    `,
      [item_id, review_title, review_text, review_rating, user_id]
    );
    return results.rows[0];
  } catch (error) {
    console.error("there was an error creating a review", error);
  }
}

// REVIEWS TABLE FUNCTION 
// create a function that fetches all reviews from the user's reviews
const fetchReviews = async (user_id) => {
  try {
    const SQL = `
    SELECT * FROM item_reviews
    WHERE user_id = $1;
    `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
  } catch (error) {
    console.error(
      `there was an error fetching reviews for user: ${user_id}`,
      error
    );
  }
};

// REVIEWS TABLE FUNCTION 
// create a function that deletes a review from the user's reviews
async function deleteReview({ review_id }) {
  try {
    await client.query(`DELETE FROM item_reviews WHERE id = $1`, [review_id]);
    console.log(`record ${review_id} has been removed`);
  } catch (error) {
    console.error(
      "there was an error deleting a record in the reviews table",
      error
    );
  }
}

// COMMENTS TABLE FUNCTION 
// create a function that adds an comment to the comments table
async function createComment({ comment_text, review_id, user_id }) {
  try {
    const results = await client.query(
      `
    INSERT INTO review_comments(comment_text,review_id,user_id)
    VALUES ($1,$2,$3) RETURNING *
    `,
      [comment_text, review_id, user_id]
    );
    return results.rows[0];
  } catch (error) {
    console.error("there was an error creating a comment", error);
  }
}

// COMMENTS TABLE FUNCTION 
// create a function that fetches all comments from the user's comments
const fetchComments = async (user_id) => {
  try {
    const SQL = `
    SELECT * FROM review_comments
    WHERE user_id = $1;
    `;
    const response = await client.query(SQL, [user.id]);
    return response.rows;
  } catch (error) {
    console.error(
      `there was an error fetching comments for user: ${user_id}`,
      error
    );
  }
};

// COMMENTS TABLE FUNCTION 
// create a function that deletes a comment from the user's comments
async function deleteComment({ comment_id }) {
  try {
    await client.query(`DELETE FROM review_comments WHERE id = $1`, [
      comment_id,
    ]);
    console.log(`record ${comment_id} has been removed`);
  } catch (error) {
    console.error(
      "There was an error deleting a record in the comments table",
      error
    );
  }
}

// COMMENTS TABLE FUNCTION
// create a function for users to update their own comments
const updateComment = async ( comment_id ) => {
  try {
  //  const affectedComment = 
    const SQL = `
    UPDATE review_comments SET comment_text = userText;
    `
  } catch () {
    
  }
}


module.exports = {
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
  fetchSingleUser
};
