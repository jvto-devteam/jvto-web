# 🎛️ CMS Dashboard - Complete Content Management System

A production-ready, feature-rich Content Management System dashboard built for the jvto-web project. Manage your website content, blog posts, FAQs, and media assets with an intuitive, modern interface.

## 🌟 Features

### ✨ Core Features
- 📄 **Content Pages Management** - Create and manage website pages
- 📰 **Blog Posts** - Publish and organize blog articles
- ❓ **FAQ Manager** - Organize frequently asked questions
- 📊 **Live Dashboard** - Real-time statistics and quick actions
- 🌍 **Multi-Language Support** - English, Indonesian, and more
- 🎨 **Modern Dark UI** - Sleek, professional interface
- ⚡ **Fast & Responsive** - Optimized performance on all devices

### 🎯 Management Capabilities
- **Full CRUD Operations** - Create, Read, Update, Delete content
- **Pagination** - Handle large content libraries efficiently
- **Search & Filter** - Find content quickly
- **Batch Operations** - Manage multiple items
- **Draft/Publish Workflow** - Control content visibility
- **Status Management** - Active/Inactive toggles
- **Rich Metadata** - SEO optimization for each item

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Environment variables configured

### Installation

1. **Ensure dependencies are installed:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the dashboard:**
   ```
   http://localhost:3000/cms
   ```

## 📍 Navigation

| Section | URL | Purpose |
|---------|-----|---------|
| Dashboard | `/cms` | Overview & quick actions |
| Content Pages | `/cms/collections/content-pages` | Manage website pages |
| Blog Posts | `/cms/collections/blog-manager` | Create & publish blogs |
| FAQ Manager | `/cms/collections/faq-manager` | Organize FAQs |
| Media Assets | `/cms/assets` | Upload & manage files |

## 🏗️ Architecture

### API Endpoints

**Content Pages:**
```
GET    /api/cms/content?page=1&limit=10
POST   /api/cms/content
PUT    /api/cms/content
DELETE /api/cms/content?id={id}
```

**Blog Posts:**
```
GET    /api/cms/blogs?page=1&limit=10
POST   /api/cms/blogs
PUT    /api/cms/blogs
DELETE /api/cms/blogs?id={id}
```

**FAQs:**
```
GET    /api/cms/faqs?page=1&limit=10
POST   /api/cms/faqs
PUT    /api/cms/faqs
DELETE /api/cms/faqs?id={id}
```

### Database Tables

- `content_pages` - Website content pages
- `blogs` - Blog articles
- `blog_categories` - Blog organization
- `faqs` - Frequently asked questions
- `category_faqs` - FAQ organization

## 📚 Documentation

- **[Quick Start Guide](./CMS_QUICKSTART.md)** - Get started in 5 minutes
- **[Full Documentation](./docs/CMS_DASHBOARD.md)** - Comprehensive technical guide
- **[Implementation Details](./CMS_IMPLEMENTATION.md)** - Architecture and features

## 🎯 Common Tasks

### Create a Blog Post

```
1. Navigate to /cms/collections/blog-manager
2. Click "New Post"
3. Fill in title, slug, excerpt
4. Select language and category
5. Toggle "Publish" to make it live
6. Click "Save"
```

### Add a FAQ

```
1. Go to /cms/collections/faq-manager
2. Click "New FAQ"
3. Enter question and answer
4. Set display order
5. Toggle "Publish"
6. Click "Save"
```

### Create a Content Page

```
1. Open /cms/collections/content-pages
2. Click "New Page"
3. Add title, route, and content
4. Select language
5. Toggle "Active"
6. Click "Save"
```

## 🧩 Component Architecture

### Reusable Components

**DataTable Component:**
```tsx
<DataTable<T>
  columns={columnsConfig}
  data={items}
  onEdit={handleEdit}
  onDelete={handleDelete}
  totalPages={pages}
  currentPage={currentPage}
  onPageChange={handlePageChange}
/>
```

**CmsForm Component:**
```tsx
<CmsForm
  title="Edit Item"
  onClose={handleClose}
  onSubmit={handleSave}
>
  <FormField label="Title" ... />
</CmsForm>
```

### Custom Hooks

**useCmsData Hook:**
```tsx
const { data, loading, fetch, create, update, delete: remove } = useCmsData({
  endpoint: '/api/cms/blogs',
  limit: 10
});
```

## 🎨 Styling & Design

### Color Scheme
- **Primary**: Emerald (Emerald-500)
- **Background**: Slate (Slate-950/900)
- **Text**: Slate (Slate-100/300/500)
- **Accents**: Blue, Purple, Orange

### Design Features
- Dark theme optimized for night work
- High contrast for accessibility
- Smooth transitions and animations
- Responsive layout (mobile, tablet, desktop)
- Consistent spacing and typography

## 🔒 Security

- API validation on all inputs
- Error handling for database operations
- Prepared statements via Prisma ORM
- Secure request/response handling
- Environment-based configuration

## ⚙️ Configuration

### Environment Variables
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=development
NEXTAUTH_SECRET=your-secret-key
```

### Customization
Edit these files to customize:
- `src/app/(cms)/cms/_components/CmsSidebar.tsx` - Navigation
- `src/components/cms/DataTable.tsx` - Table styling
- `src/components/cms/CmsForm.tsx` - Form styling

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📊 Performance

- **Pagination**: 10 items per page (configurable)
- **Database**: Optimized Prisma queries
- **Frontend**: React hooks and memoization
- **Caching**: Browser cache for static assets
- **Compression**: Gzip compression enabled

## 🐛 Troubleshooting

### "Failed to fetch data"
- Verify development server is running
- Check `/api/cms/*` endpoints are accessible
- Look at browser console for errors

### Form validation errors
- Ensure required fields are filled
- Check for duplicate slugs/routes
- Verify language is selected

### Database connection issues
- Confirm PostgreSQL is running
- Check `DATABASE_URL` variable
- Verify database tables exist

## 📈 Monitoring

### Health Checks
```bash
# Test API endpoints
curl http://localhost:3000/api/cms/content
curl http://localhost:3000/api/cms/blogs
curl http://localhost:3000/api/cms/faqs
```

### Logs
- Check browser console for frontend errors
- Review server logs for API errors
- Check database for connectivity issues

## 🔄 Maintenance

### Regular Tasks
- Backup database regularly
- Monitor API response times
- Clean up old draft content
- Update dependencies quarterly

### Database Maintenance
```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## 📦 Dependencies

- **Next.js**: 16.2.1 - React framework
- **Prisma**: 6.18.0 - Database ORM
- **React**: 19.2.4 - UI library
- **Tailwind CSS**: 4 - Styling
- **Lucide React**: Icons library
- **TypeScript**: Type safety

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 🤝 Contributing

To extend the CMS:

1. Create new API route in `/api/cms/`
2. Build manager component in `/collections/`
3. Add sidebar navigation link
4. Update topbar titles
5. Write documentation

## 📝 License

This CMS dashboard is part of the jvto-web project.

## ✨ Version History

### v1.0.0 (Current)
- ✅ Content Pages Manager
- ✅ Blog Posts Manager
- ✅ FAQ Manager
- ✅ Dashboard with statistics
- ✅ Multi-language support
- ✅ Full CRUD operations
- ✅ Comprehensive documentation

### v1.1.0 (Planned)
- 📋 Rich text editor integration
- 📸 Image upload & optimization
- 📅 Content scheduling
- 🔄 Revision history
- 🔐 User roles & permissions

## 🆘 Support

For issues or questions:
1. Check the [Quick Start Guide](./CMS_QUICKSTART.md)
2. Review [Full Documentation](./docs/CMS_DASHBOARD.md)
3. Check [Implementation Details](./CMS_IMPLEMENTATION.md)
4. Review source code comments

## 🎉 Credits

Built with ❤️ for jvto-web using modern web technologies.

---

**Status**: ✅ Production Ready
**Last Updated**: April 6, 2026
**Maintained By**: Development Team

🚀 **Ready to manage content?** Start with [Quick Start Guide](./CMS_QUICKSTART.md)!
