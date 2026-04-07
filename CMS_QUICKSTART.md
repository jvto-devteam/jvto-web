# CMS Dashboard - Quick Start Guide

## 🚀 Getting Started

Your CMS dashboard is now ready to use! Here's how to access and start managing content.

### Access the Dashboard

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   ```
   http://localhost:3000/cms
   ```

3. **You should see:**
   - A modern dark-themed dashboard
   - Statistics cards showing content counts
   - Quick action cards for each content type
   - Navigation sidebar with all management modules

## 📚 Available Features

### 1. Content Pages (`/cms/collections/content-pages`)
Manage static pages on your website.

**What you can do:**
- Create new pages with custom routes
- Support for multiple languages
- Set pages as active/inactive
- Add SEO metadata
- Edit and delete pages

**Example:**
- Route: `/about`
- Title: "About Our Company"
- Language: English

### 2. Blog Posts (`/cms/collections/blog-manager`)
Create and publish blog articles.

**What you can do:**
- Write blog posts with titles and slugs
- Add excerpts and full content
- Organize with categories
- Save as draft or publish
- Support for multiple languages

**Example:**
- Title: "10 Amazing Travel Destinations"
- Slug: "10-amazing-travel-destinations"
- Status: Published

### 3. FAQ Management (`/cms/collections/faq-manager`)
Organize frequently asked questions.

**What you can do:**
- Add questions and answers
- Set display order
- Publish/unpublish FAQ items
- Organize by categories
- Easy search functionality

**Example:**
- Question: "What is your cancellation policy?"
- Answer: "Detailed cancellation terms..."

## 🎯 Common Tasks

### Create a New Blog Post

```
1. Navigate to Blog Posts
2. Click "New Post"
3. Fill in:
   - Title: "My First Blog Post"
   - Slug: "my-first-blog-post" (auto-generated)
   - Excerpt: "A brief summary"
   - Language: English
4. Click "Save"
```

### Add a FAQ

```
1. Go to FAQ Manager
2. Click "New FAQ"
3. Enter:
   - Question: "How does shipping work?"
   - Answer: "Full details about shipping"
   - Order: 1 (display order)
4. Toggle "Publish" to make it live
5. Click "Save"
```

### Create a Content Page

```
1. Open Content Pages
2. Click "New Page"
3. Add:
   - Title: "Policies"
   - Route: "/policies"
   - Language: English
   - Content: Page description
4. Toggle "Active"
5. Click "Save"
```

## 🎨 UI Features

### Dashboard
- **Live Statistics**: Real-time counts of all content
- **Quick Actions**: One-click access to content managers
- **Tips Section**: Best practices and recommendations

### Data Tables
- **Pagination**: Navigate through large content lists
- **Edit/Delete**: Quick action buttons
- **Status Indicators**: Visual status badges
- **Search**: Filter content by keywords

### Forms
- **Modal Dialogs**: Clean editing experience
- **Required Fields**: Clear validation
- **Language Support**: Select content language
- **Status Toggle**: Publish/unpublish with one click

## 🔧 Technical Details

### API Endpoints
All operations use RESTful API endpoints:

```
GET    /api/cms/content?page=1&limit=10    # List pages
POST   /api/cms/content                     # Create page
PUT    /api/cms/content                     # Update page
DELETE /api/cms/content?id={id}            # Delete page

GET    /api/cms/blogs?page=1&limit=10      # List blogs
POST   /api/cms/blogs                       # Create blog
PUT    /api/cms/blogs                       # Update blog
DELETE /api/cms/blogs?id={id}              # Delete blog

GET    /api/cms/faqs?page=1&limit=10       # List FAQs
POST   /api/cms/faqs                        # Create FAQ
PUT    /api/cms/faqs                        # Update FAQ
DELETE /api/cms/faqs?id={id}               # Delete FAQ
```

### Data Models

**Content Page:**
```json
{
  "id": "string",
  "route": "/about",
  "lang": "en",
  "title": "About Us",
  "is_active": true,
  "seo": {},
  "content": {},
  "updated_at": "2026-04-06T22:09:55Z"
}
```

**Blog Post:**
```json
{
  "id": 1,
  "title": "My Post",
  "slug": "my-post",
  "excerpt": "Summary",
  "content": {},
  "is_published": true,
  "lang": "en",
  "created_at": "2026-04-06T22:09:55Z"
}
```

**FAQ:**
```json
{
  "id": 1,
  "question": "Q?",
  "answer": "A",
  "sort_order": 1,
  "is_published": true,
  "category_id": null
}
```

## 🎯 Best Practices

1. **Use Consistent Naming**
   - Slugs should be lowercase with hyphens
   - Use descriptive titles
   - Keep routes simple: `/about`, `/contact`

2. **Multi-Language Support**
   - Create separate entries for different languages
   - Use language codes: `en`, `id`, `es`

3. **Content Organization**
   - Use categories for blogs and FAQs
   - Set proper sort orders
   - Regularly update timestamps

4. **Publishing Workflow**
   - Save as draft first
   - Preview before publishing
   - Use publish toggle for scheduled content

5. **SEO Optimization**
   - Add meaningful titles
   - Fill in meta descriptions
   - Use appropriate keywords

## 🐛 Troubleshooting

### "Failed to fetch data"
- Check if the development server is running
- Verify `/api/cms/*` endpoints are accessible
- Check browser console for detailed errors

### Form won't submit
- Ensure required fields are filled
- Check that inputs have valid values
- Look for validation errors in the modal

### Changes not showing
- Refresh the page (F5)
- Check network tab for failed requests
- Verify data was actually saved

### Database connection issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` environment variable
- Run `npm run dev` again to reconnect

## 📝 Customization

### Adding a New Content Type

1. Create API route: `src/app/(api)/api/cms/{type}/route.ts`
2. Implement CRUD operations
3. Create manager component
4. Add sidebar navigation
5. Deploy and test

### Styling

All components use Tailwind CSS. Modify colors in:
- `DataTable.tsx` - Table styling
- `CmsForm.tsx` - Form modal styling
- Manager pages - Page-specific styles

### Extending with Plugins

Add features like:
- Rich text editor (TipTap already configured)
- File upload (S3/CloudFlare integration)
- Scheduling (Agenda/node-schedule)
- Webhooks (for external services)

## 📚 Next Steps

1. **Create Your First Post**: Write a blog post
2. **Add FAQs**: Organize frequently asked questions
3. **Setup Pages**: Create important pages
4. **Configure Settings**: Update global settings
5. **Test Publishing**: Verify content appears on site

## 🆘 Support

For issues or questions:
- Check `/docs/CMS_DASHBOARD.md` for full documentation
- Review source code in `/src/app/(cms)/cms/`
- Check API implementations in `/src/app/(api)/api/cms/`

## 🎉 You're All Set!

Your CMS dashboard is ready to use. Start creating content and managing your website with ease!

Happy content creation! 🚀
