const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Student = require('../models/student')
const Course = require('../models/course')
const { initialBlogs, nonExistingId, blogsInDb, usersInDb } = require('./test_helper')

    describe('when there is initially some blogs saved', async () => {
        beforeAll(async () => {
        await Blog.remove({})
    
        const blogObjects = initialBlogs.map(n => new Blog(n))
        await Promise.all(blogObjects.map(n => n.save()))
        })
    
        test('all blogs are returned as json by GET /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()
    
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(response.body.length).toBe(blogsInDatabase.length)
    
        const returnedContents = response.body.map(n => n.author)
        blogsInDatabase.forEach(blog => {
            expect(returnedContents).toContain(blog.author)
        })
      })
    })
  
    describe('addition of a new blog', async () => {

        test('POST /api/blogs succeeds with valid data', async () => {
          const blogsAtStart = await blogsInDb()
    
          const newBlog = {
            title: "Imurointi opas",
            author: "Siivooja",
            url: "www.siivous.fi",
            likes: 5
          }
    
          await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
          const blogsAfterOperation = await blogsInDb()
    
          expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
    
          const contents = blogsAfterOperation.map(r => r.author)
          expect(contents).toContain('Michael Chan')
        })
    
        test('POST /api/blogs fails with proper statuscode if title is missing', async () => {
          const newBlog = {
            author: "guy",
            url : "www.guyspace.com"
          }
    
          const blogsAtStart = await blogsInDb()
    
          await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
          const blogsAfterOperation = await blogsInDb()
    
          const contents = blogsAfterOperation.map(r => r.title)
    
          expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
        })

        test('POST /api/blogs fails with proper statuscode if url is missing', async () => {
            const newBlog = {
              author: "guy",
              title : "Guy stuff"
            }
      
            const blogsAtStart = await blogsInDb()
      
            await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(400)
      
            const blogsAfterOperation = await blogsInDb()
      
            const contents = blogsAfterOperation.map(r => r.url)
      
            expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
          })

        test('POST /api/blogs sets likes to 0 if undefined', async () => {
            const blogsAtStart = await blogsInDb()
      
            const newBlog = {
              title: "Imurointi opas",
              author: "Siivooja",
              url: "www.siivous.fi"
            }
      
            await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(200)
              .expect('Content-Type', /application\/json/)
      
            const blogsAfterOperation = await blogsInDb()

            const contents = blogsAfterOperation.map(r => r.likes)
            expect(contents).toContain(0)
          })
    })

  describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
      addedBlog = new Blog({
        title: "Kamaa",
        author: "Siivooja",
        url: "www.siivous.fi"
      })
      await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(204)

      const blogsAfterOperation = await blogsInDb()

      const contents = blogsAfterOperation.map(r => r.title)

      expect(contents).not.toContain(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
  })

  describe('updating a blog', async () => {
    let addedBlog

    beforeAll(async () => {
      addedBlog = new Blog({
        title: "Tavaraa",
        author: "Siivous",
        url: "www.siivooja.fi",
        likes: 500
      })
      await addedBlog.save()
    })

    test('PUT /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsAtStart = await blogsInDb()

      updatedBlog = new Blog({
        title: "Tavaraa",
        author: "Siivous",
        url: "www.siivooja.fi",
        likes: 501
      })

      await api
        .put(`/api/blogs/${addedBlog._id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAfterOperation = await blogsInDb()

      const contents = blogsAfterOperation.map(r => r.likes)

      expect(contents).not.toContain(addedBlog.likes)
      expect(contents).toContain(updatedBlog.likes)
    })
  })
  
  describe('when there is initially one user at db', async () => {
    beforeAll(async () => {
      await User.remove({})
      const user = new User({ username: 'root', password: 'sekret' })
      await user.save()
    })
  
    test('POST /api/users succeeds with a fresh username', async () => {
      const usersBeforeOperation = await usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
      const usernames = usersAfterOperation.map(u=>u.username)
      expect(usernames).toContain(newUser.username)
    })
  
    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
      const usersBeforeOperation = await usersInDb()
    
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }
    
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body).toEqual({ error: 'username must be unique'})
    
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users fails with proper statuscode and message if username is too short', async () => {
      const usersBeforeOperation = await usersInDb()
    
      const newUser = {
        username: 'xD',
        name: 'Superuser',
        password: 'salainen'
      }
    
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body).toEqual({ error: 'username must be at least 3 symbols long'})
    
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

  afterAll(() => {
      server.close()
    })
  })
