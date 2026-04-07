# CMS Dashboard Documentation

## Overview

A comprehensive Content Management System (CMS) dashboard built with Next.js, Prisma, and PostgreSQL for managing website content, blog posts, FAQs, and media assets.

## Features

### 1. **Dashboard** (`/cms`)
- Live statistics for all content types
- Quick action cards for easy navigation
- Performance tips and recommendations
- Real-time content metrics

### 2. **Content Pages Manager** (`/cms/collections/content-pages`)
- Create, read, update, delete website pages
- Multi-language support (English, Indonesian)
- Route management and SEO metadata
- Active/inactive status toggle
- Pagination support

### 3. **Blog Posts Manager** (`/cms/collections/blog-manager`)
- Publish and manage blog articles
- Slug generation and management
- Rich text support for content
- Category organization
- Language support
- Published/Draft status

### 4. **FAQ Manager** (`/cms/collections/faq-manager`)
- Organize frequently asked questions
- Category support
- Sort order management
- Publish/unpublish individual items
- Quick search functionality

### 5. **Media Assets** (`/cms/assets`)
- File upload and management
- Image optimization
- Asset organization
- File type validation

## Technical Stack

- **Frontend**: Next.js 16.2.1 with React 19
- **Database**: PostgreSQL via Prisma ORM
- **UI Components**: Tailwind CSS 4 + Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Next.js API Routes

## File Structure

```
src/
├── app/
│   ├── (api)/api/cms/
│   │   ├── content/route.ts          # Content pages API
│   │   ├── blogs/route.ts            # Blog posts API
│   │   └── faqs/route.ts             # FAQ items API
│   └── (cms)/cms/
│       ├── page.tsx                  # Dashboard home
│       ├── layout.tsx                # CMS layout
│       ├── _components/
│       │   ├── CmsSidebar.tsx        # Navigation sidebar
│       │   └── CmsTopbar.tsx         # Header topbar
│       └── collections/
│           ├── content-pages/        # Content manager
│           ├── blog-manager/         # Blog manager
│           └── faq-manager/          # FAQ manager
├── components/cms/
│   ├── DataTable.tsx                 # Reusable table component
│   └── CmsForm.tsx                   # Reusable form component
└── utils/
    └── cms.ts                        # CMS utilities & helpers
```

## API Endpoints

### Content Pages
- `GET /api/cms/content?page=1&limit=10` - List pages
- `POST /api/cms/content` - Create page
- `PUT /api/cms/content` - Update page
- `DELETE /api/cms/content?id={id}` - Delete page

### Blog Posts
- `GET /api/cms/blogs?page=1&limit=10` - List blogs
- `POST /api/cms/blogs` - Create blog
- `PUT /api/cms/blogs` - Update blog
- `DELETE /api/cms/blogs?id={id}` - Delete blog

### FAQs
- `GET /api/cms/faqs?page=1&limit=10` - List FAQs
- `POST /api/cms/faqs` - Create FAQ
- `PUT /api/cms/faqs` - Update FAQ
- `DELETE /api/cms/faqs?id={id}` - Delete FAQ

## Component Reference

### DataTable Component

Reusable table component with pagination and actions.

```tsx
<DataTable<T>
  columns={[
    { key: "name", label: "Name", width: "40%" },
    { key: "status", label: "Status", render: (value) => ... }
  ]}
  data={items}
  loading={loading}
  rowKey="id"
  onEdit={handleEdit}
  onDelete={handleDelete}
  totalPages={pages}
  currentPage={page}
  onPageChange={handlePageChange}
/>
```

### CmsForm Component

Reusable form modal for creating/editing content.

```tsx
<CmsForm
  title="Create Page"
  onClose={handleClose}
  onSubmit={handleSubmit}
  loading={isLoading}
>
  <FormField
    label="Title"
    name="title"
    value={formData.title}
    onChange={setTitle}
    required
  />
</CmsForm>
```

## Usage Examples

### Creating a New Content Page

1. Navigate to `/cms/collections/content-pages`
2. Click "New Page" button
3. Fill in form fields:
   - Title: "About Us"
   - Route: "/about"
   - Language: "English"
   - Content: Page description
4. Toggle "Active" to publish
5. Click "Save"

### Managing Blog Posts

1. Go to `/cms/collections/blog-manager`
2. Click "New Post"
3. Enter title and slug (auto-generated)
4. Add excerpt and content
5. Select language and category
6. Toggle "Publish" to make it live
7. Save changes

### Organizing FAQs

1. Visit `/cms/collections/faq-manager`
2. Click "New FAQ"
3. Enter question and answer
4. Set display order
5. Toggle "Publish" status
6. Save

## Customization

### Adding New Content Types

1. Create new API route: `src/app/(api)/api/cms/{type}/route.ts`
2. Create manager component: `src/app/(cms)/cms/collections/{type}-manager/page.tsx`
3. Add navigation link in `CmsSidebar.tsx`
4. Update title mapping in `CmsTopbar.tsx`

### Styling

All components use Tailwind CSS with these color themes:
- Primary: Emerald (emerald-500)
- Background: Slate (slate-950/900)
- Accent: Blue, Purple, Orange for different sections

### Adding Search/Filter

DataTable component supports custom filtering via `onFilter` callback:

```tsx
const [searchTerm, setSearchTerm] = useState("");
const filtered = data.filter(item => 
  item.title.toLowerCase().includes(searchTerm.toLowerCase())
);
```

## Best Practices

1. **Content Organization**: Use consistent naming conventions for pages and slugs
2. **SEO**: Fill in metadata for better search engine visibility
3. **Language**: Specify language for multi-language support
4. **Publishing**: Always preview before publishing
5. **Images**: Optimize images before uploading
6. **Backups**: Regularly export important content

## Future Enhancements

- [ ] Rich text editor integration (TipTap)
- [ ] Drag-and-drop file upload
- [ ] Content scheduling/publishing workflow
- [ ] Revision history and rollback
- [ ] Advanced search and filtering
- [ ] Bulk operations
- [ ] Content versioning
- [ ] User roles and permissions

## Troubleshooting

### API Connection Issues
- Check `DATABASE_URL` environment variable
- Verify PostgreSQL connection
- Check Prisma schema for table definitions

### Form Not Submitting
- Check browser console for errors
- Verify API route is accessible
- Check request payload format

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Verify dark mode is enabled

## Support

For issues or questions, refer to:
- Prisma Documentation: https://www.prisma.io/docs/
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- Tailwind CSS: https://tailwindcss.com/docs
