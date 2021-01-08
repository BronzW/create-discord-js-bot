import dotenv from 'dotenv'

/* If the process is not in production, then use .env file. */
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
