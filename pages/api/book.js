import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "You are not authorized to access this page." })
    }

    switch(req.method) {
    // TODO: On a POST request, add a book using db.book.add with request body 
    case 'POST':
      try {
        const book = req.body
        const addBook = await db.book.add(req.session.user.id, book)

        if (addBook === null) {
          req.session.destroy()
          return res.status(401).json({ error: "User not found." })
        } else {
          return res.status(200).json("Book added to favorites.")
        }
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }
      
    // TODO: On a DELETE request, remove a book using db.book.remove with request body 
    case 'DELETE':
      try {
        const removeBook = await db.book.remove(req.session.user.id, req.body.id)

        if (removeBook === null) {
          req.session.destroy()
          return res.status(401).json({ error: "User not found." })
        } else {
          return res.status(200).json("Book removed from favorites.")
        }
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }

    // TODO: Respond with 404 for all other requests
    default:
      return res.status(404).end()    
    }
  },
  sessionOptions
)

    // User info can be accessed with req.session
    // No user info on the session means the user is not logged in