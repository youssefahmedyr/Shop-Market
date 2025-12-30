# E-Shop - Modern E-commerce Platform

A full-featured e-commerce application built with Next.js 16, TypeScript, and Tailwind CSS. This platform provides a complete shopping experience with product browsing, cart management, user authentication, and address management.

## 🚀 Features

### Core Features

- **Product Catalog**: Browse products with detailed information, images, and pricing
- **Advanced Search**: Real-time product search with autocomplete suggestions
- **Category & Brand Filtering**: Filter products by categories and brands
- **Shopping Cart**: Add, remove, and update cart items with real-time updates
- **User Authentication**: Secure login and signup system
- **Address Management**: Add, edit, and delete shipping addresses
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **API Integration**: RESTful API integration with proper error handling
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Boundaries**: Graceful error handling and recovery
- **Toast Notifications**: User-friendly feedback system
- **SEO Optimized**: Meta tags and semantic HTML
- **Performance Optimized**: Code splitting and lazy loading

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons & Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Image Slider**: Swiper.js
- **State Management**: React Hooks & Zustand

## 📁 Project Structure

```
app/
├── (user)/                 # Protected routes (authentication required)
│   ├── brands/            # Brand pages
│   ├── cart/              # Shopping cart
│   ├── categories/        # Category pages
│   ├── login/             # Login page
│   ├── products/          # Product pages
│   ├── profile/           # User profile & addresses
│   ├── signup/            # Registration page
│   ├── subcategories/     # Subcategory pages
│   └── layout.tsx         # User layout with navigation
├── _api/                  # API functions and types
│   ├── api.ts            # API client configuration
│   ├── addresses.ts      # Address management
│   ├── brands.ts         # Brand API
│   ├── cart.ts           # Cart API
│   ├── categories.ts     # Category API
│   ├── products.ts       # Product API
│   ├── subcategories.ts  # Subcategory API
│   └── signup.ts         # Authentication API
├── _components/          # Reusable components
│   ├── ErrorBoundary.tsx # Error handling
│   ├── Footer.tsx        # Site footer
│   ├── LoadingSkeleton.tsx # Loading states
│   ├── Navigation.tsx    # Main navigation
│   ├── SearchBar.tsx     # Product search
│   └── ui/               # UI components
├── _component/           # Legacy components
└── layout.tsx           # Root layout
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd first-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Routes

### Public Routes

- `/` - Home page with featured products
- `/login` - User login
- `/signup` - User registration

### Protected Routes (Authentication Required)

- `/products` - Product listing with filters
- `/products/[id]` - Product details
- `/categories` - All categories
- `/categories/[id]` - Products by category
- `/brands` - All brands
- `/brands/[id]` - Products by brand
- `/cart` - Shopping cart
- `/profile` - User profile
- `/profile/addresses` - Address management
- `/profile/addresses/new` - Add new address
- `/profile/addresses/edit/[id]` - Edit address

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://ecommerce.routemisr.com/api/v1
```

### API Integration

The application uses the [E-commerce API](https://ecommerce.routemisr.com/api/v1) for:

- Products and categories
- User authentication
- Cart management
- Address management

## 🎨 Design System

### Colors

- Primary: Rose (rose-500)
- Secondary: Slate (slate-600, slate-900)
- Success: Green (emerald-500)
- Error: Red (red-500)
- Warning: Yellow (amber-500)

### Typography

- Font: Geist (optimized for web)
- Sizes: Responsive scaling from text-xs to text-5xl
- Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components

- Consistent spacing using Tailwind classes
- Rounded corners (rounded-lg, rounded-xl, rounded-2xl)
- Subtle shadows and borders
- Hover states and transitions

## 🔐 Authentication

The application uses JWT tokens for authentication:

- Tokens are managed by NextAuth session
- Automatic token refresh on API calls
- Protected routes with redirect logic
- Logout functionality

## 🛒 Shopping Cart Features

- Add products to cart with quantity selection
- Real-time cart updates
- Item quantity adjustment
- Remove items from cart
- Clear entire cart
- Cart persistence across sessions

## 📍 Address Management

- Multiple address support
- Add new addresses with validation
- Edit existing addresses
- Delete addresses with confirmation
- Default address selection

## 📱 Responsive Design

The application is fully responsive:

- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large Desktop**: 1280px and up

## 🚀 Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting for pages
- Lazy loading for components
- API request debouncing
- Skeleton loading states
- Error boundaries for graceful degradation

## 🧪 Testing

The application includes:

- TypeScript for compile-time error checking
- Error boundaries for runtime error handling
- API error handling with user feedback
- Form validation
- Loading states for better UX

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
npm start
```

### Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or issues, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🔄 Updates

The project is actively maintained with regular updates for:

- Security patches
- Performance improvements
- New features
- Bug fixes

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
