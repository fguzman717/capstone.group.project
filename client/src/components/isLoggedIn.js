// export const isLoggedIn = (req, res, next) => {
//   const token = req.headers["Authorization"];

//   if (!token) {
//   <Redirect to="/login" />}
//   else {
//   return
//   );
// } };

export function isLoggedIn() {
  // Check if we have a token stored
  if (localStorage.token !== undefined) {
    return true;
  }
  return false;
}
