const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const header = page.getByRole('form')
    expect(header).toBeDefined()
  })

  describe('Login', () => {
    
    test('succeeds', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async({ page }) => {
        await loginWith(page, 'mluukkai', 'salaine')
        await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('when logged in', () => {
     beforeEach(async ({ page, request }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
     })

     test('a new blog can be created', async({ page }) => {
        await createBlog(page, 'Blogiotsikko', 'Hanski', 'example.com')
        await expect(page.getByText('Blogiotsikko', {exact: true})).toBeVisible()
        await expect(page.getByText('Blogiotsikko', {exact: true})).toBeVisible()
     })

     test('a blog can be liked', async({ page }) => {
        await createBlog(page, 'Blogiotsikko', 'Hanski', 'example.com')
        await expect(page.getByText('Blogiotsikko', {exact: true})).toBeVisible()
        
        await page.getByRole('button', {name: 'show'}).click()
        await page.getByRole('button', {name: 'like'}).click()
        await expect(page.getByText('1')).toBeVisible()
     })

     test('a blog can be removed by the user', async({ page }) => {
        await createBlog(page, 'Blogiotsikko', 'Hanski', 'example.com')
        await expect(page.getByText('Blogiotsikko', {exact: true})).toBeVisible()

        await page.getByRole('button', {name: 'show'}).click()
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', {name: 'remove'}).click()
        await expect(page.getByText('Blogiotsikko', {exact: true})).toBeHidden()
     })

     test('only the user can delete a blog', async({ page }) => {
        await createBlog(page, 'Blogiotsikko', 'Hanski', 'example.com')
        await expect(page.getByText('Blogiotsikko', {exact: true})).toBeVisible()

        await page.getByRole('button', {name: 'logout'}).click()
        await page.getByRole('button', {name: 'show'}).click()
        await expect(page.getByRole('button', {name: 'remove'})).toBeHidden()
     })
  })

  describe('Blogs', () => {
    beforeEach(async ({page, request}) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        await createBlog(page, 'Blogiotsikko', 'Hanski', 'example.com')
        await expect(page.getByText('Blogiotsikko', {exact: true})).toBeVisible()
        await createBlog(page, 'Blogiotsikko 2', 'Hanski', 'example.com')
        await expect(page.getByText('Blogiotsikko 2', {exact: true})).toBeVisible()
    })

    test('blog list is in order', async({ page }) => {
        await page.locator('div').filter({ hasText: /^Blogiotsikkoshowhide$/ }).getByRole('button').click()
        await page.locator('div').filter({ hasText: /^Blogiotsikko 2showhide$/ }).getByRole('button').click()
        const likes = await page.getByTestId('likes').all()
        await page.getByRole('button', {name: 'like'}).first().click()
        await expect (likes[0]).toHaveText("1")

        await page.getByRole('button', {name: 'like'}).nth(1).click()
        await expect (likes[1]).toHaveText("1")
        await page.getByRole('button', {name: 'like'}).nth(1).click()
        await expect (page.getByText("2", {exact: true})).toBeVisible()

        const newLike = await page.getByTestId('likes').first().textContent()

        expect(parseInt(newLike)).toBe(2)
    })
  })
})