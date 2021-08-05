const express = require('express')
const app = express()
const {Pool} = require('pg')
const PORT = 3006
// Middle to get body data -- HAVE TO HAVE THIS
app.use(express.json())


// Hook up to database 
const pool = new Pool({
    user: 'garrettross',
    port: 5432,
    host: 'localhost',
    database: 'todo',
    password: ''
})

// make routes

// Get all
app.get('/api/todos', async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM todos')
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})
// Get one
app.get('/api/todos/:id', async (req, res) => {
    try {
        const {id} = req.params
        const {rows} = await pool.query('SELECT * FROM todos WHERE todo_id = $1', [id])
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

// Create one
app.post('/api/todos', async (req, res) => {
    try {
        const {todo_body} = req.body
        const {rows} = await pool.query('INSERT INTO todos (todo_body) VALUES ($1) RETURNING *', [todo_body])
        res.status(301).json(rows)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})
// Edit one
app.patch('/api/todos/:id', async (req, res) => {
    try {
        const {todo_body}  = req.body
        const {id} = req.params
        await pool.query('UPDATE todos SET todo_body = $1 WHERE todo_id = $2 RETURNING *', [todo_body, id])
        res.status(200).json({message: "Todo Updated"})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

// delete one
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const {id} = req.params
        await pool.query('DELETE from todos WHERE todo_id = $1 RETURNING *', [id])
        res.status(200).json({message: 'Todo deleted'})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})




app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})
