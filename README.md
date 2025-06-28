# 🎓 GitLab-integrated Internship Tracker (Next.js)                    
          
A comprehensive platform for managing internships with GitLab OAuth integration, built with Next.js, NextAuth.js, and MongoDB.  
      
## 🚀 Features

### ✅ Implemented Features      
   
#### 🔐 Authentication & Onboarding
- **GitLab OAuth Integration**: Secure login with GitLab accounts using NextAuth.js
- **Role-based Access**: Separate flows for Mentors and Interns
- **Guided Onboarding**: Step-by-step setup process with progress indicators
- **Demo Mode**: Test functionality without GitLab OAuth setup

#### 🎓 For Mentors
- Create and manage colleges with detailed information
- Set up cohorts with customizable parameters (dates, max interns, etc.)
- Review and approve/reject intern join requests
- Dashboard with overview statistics and recent activity
- Real-time join request notifications

#### 👨‍🎓 For Interns
- Browse and join available colleges
- Request to join specific cohorts with personal messages
- Track application status (pending, approved, rejected)
- Personal dashboard with progress overview
- GitLab account integration display

#### 🔗 GitLab Integration
- OAuth authentication with comprehensive profile data
- Access token management for API calls
- User profile synchronization
- Ready for repository and commit tracking

#### 🗄️ Database Integration
- MongoDB with NextAuth.js adapter
- Comprehensive data models for users, colleges, cohorts, and join requests
- Demo data seeding for testing
- Automatic user creation and updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js with GitLab provider
- **Database**: MongoDB with official adapter
- **Styling**: Tailwind CSS
- **API**: Next.js API routes
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- MongoDB database (local or cloud)
- GitLab account for OAuth setup

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd nextjs-app
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
# GitLab OAuth Configuration
GITLAB_CLIENT_ID=your_gitlab_application_id
GITLAB_CLIENT_SECRET=your_gitlab_application_secret
GITLAB_ISSUER=https://gitlab.com

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Application Configuration
DEMO_MODE=true
```

### 3. GitLab OAuth Setup

1. **Create GitLab Application:**
   - Go to [GitLab Applications](https://gitlab.com/-/profile/applications)
   - Click "New Application"

2. **Application Settings:**
   - **Name:** Internship Tracker
   - **Redirect URI:** `http://localhost:3000/api/auth/callback/gitlab`
   - **Scopes:** Select `read_user`, `read_api`, `read_repository`

3. **Update Environment:**
   - Copy Application ID to `GITLAB_CLIENT_ID`
   - Copy Secret to `GITLAB_CLIENT_SECRET`

### 4. Database Setup

```bash
# Seed demo data
npm run setup
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  gitlabId: "123456",
  gitlabUsername: "johndoe",
  role: "mentor|intern",
  avatarUrl: "https://...",
  collegeId: ObjectId,
  cohortId: ObjectId,
  onboardingComplete: true,
  createdAt: Date,
  updatedAt: Date,
  isActive: true
}
```

### Colleges Collection
```javascript
{
  _id: ObjectId,
  name: "Sreenidhi Institute",
  description: "Premier engineering college",
  location: "Hyderabad, India",
  website: "https://sreenidhi.edu.in",
  createdBy: "mentor_id",
  createdAt: Date,
  updatedAt: Date,
  isActive: true
}
```

### Cohorts Collection
```javascript
{
  _id: ObjectId,
  name: "Summer 2025",
  description: "Summer internship program",
  collegeId: ObjectId,
  createdBy: "mentor_id",
  startDate: Date,
  endDate: Date,
  maxInterns: 20,
  currentInterns: 5,
  createdAt: Date,
  updatedAt: Date,
  isActive: true
}
```

### Join Requests Collection
```javascript
{
  _id: ObjectId,
  internId: "intern_id",
  collegeId: ObjectId,
  cohortId: ObjectId,
  mentorId: "mentor_id",
  status: "pending|approved|rejected",
  message: "Personal message from intern",
  internName: "John Smith",
  internEmail: "john@example.com",
  collegeName: "College Name",
  cohortName: "Cohort Name",
  createdAt: Date,
  updatedAt: Date,
  reviewedAt: Date
}
```

## 🔄 Application Flow

### 1. Authentication
- User visits landing page
- Clicks "Sign in with GitLab"
- Redirected to GitLab OAuth
- Returns with user profile data

### 2. Onboarding Check
- System checks if user completed onboarding
- If not, redirects to onboarding flow
- If yes, redirects to appropriate dashboard

### 3. Role Selection
- User chooses between Mentor or Intern
- System stores role preference

### 4. Role-specific Onboarding

#### Mentor Flow:
1. Create college with details
2. Set up first cohort
3. Complete profile setup
4. Redirect to mentor dashboard

#### Intern Flow:
1. Browse available colleges
2. Select desired cohort
3. Submit join request with message
4. Wait for mentor approval
5. Redirect to intern dashboard

### 5. Dashboard Access
- Role-specific dashboard with relevant features
- Real-time data updates
- GitLab integration ready

## 📱 API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Onboarding
- `POST /api/onboarding` - Complete user onboarding
- `GET /api/onboarding` - Check onboarding status

### Colleges
- `POST /api/colleges` - Create new college (mentors only)
- `GET /api/colleges` - Get all colleges or mentor's colleges

### Cohorts
- `POST /api/cohorts` - Create new cohort (mentors only)
- `GET /api/cohorts?collegeId=...` - Get cohorts for college

### Join Requests
- `POST /api/join-requests` - Submit join request (interns only)
- `GET /api/join-requests` - Get requests (role-specific)
- `PATCH /api/join-requests` - Update request status (mentors only)

## 🎭 Demo Mode

The application includes comprehensive demo functionality:

### Demo Features
- **Pre-seeded Data**: Colleges, cohorts, and demo users
- **Full Workflow**: Complete onboarding and dashboard experience
- **No OAuth Required**: Test without GitLab setup
- **Realistic Data**: Sample colleges and cohorts

### Demo Users
- **Mentor**: Dr. Sarah Wilson (mentor@demo.com)
- **Intern**: Various demo intern accounts

### Accessing Demo Mode
1. Start the application
2. Click "Show Demo Mode" on login page
3. Select demo user type
4. Experience full functionality

## 🔒 Security Features

- **OAuth 2.0**: Secure GitLab authentication
- **Session Management**: NextAuth.js secure sessions
- **API Protection**: Route-level authentication checks
- **Role-based Access**: Endpoint permissions by user role
- **Input Validation**: Form data validation and sanitization

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set Environment Variables**
4. **Deploy**

### Environment Variables for Production
```env
GITLAB_CLIENT_ID=your_production_client_id
GITLAB_CLIENT_SECRET=your_production_client_secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
MONGODB_URI=your_production_mongodb_uri
```

## 📈 Future Enhancements

### Planned Features
- [ ] Real-time notifications system
- [ ] Advanced analytics dashboard
- [ ] Task management system
- [ ] GitLab repository tracking
- [ ] Commit analysis and metrics
- [ ] Video conferencing integration
- [ ] Mobile app support
- [ ] Advanced progress tracking
- [ ] AI-powered insights
- [ ] Multi-language support

### Technical Improvements
- [ ] Real-time updates with WebSockets
- [ ] Advanced caching strategies
- [ ] Performance optimizations
- [ ] Comprehensive testing suite
- [ ] CI/CD pipeline
- [ ] Docker containerization

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**: Test GitLab OAuth and demo login
2. **Mentor Onboarding**: Create college and cohort
3. **Intern Onboarding**: Join college and submit request
4. **Dashboard Features**: Test all dashboard tabs
5. **Join Request Flow**: Approve/reject requests

### Test Scenarios
- New user registration
- Existing user login
- Role switching
- Data persistence
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure GitLab app redirect URI is: `http://localhost:3000/api/auth/callback/gitlab`
   - No trailing slash in the URI

2. **Database connection issues**
   - Check MongoDB URI in `.env.local`
   - Ensure database is accessible

3. **OAuth not working**
   - Verify GitLab client ID and secret
   - Check scopes are correctly set

### Getting Help
- Check the console for error messages
- Verify environment variables
- Use demo mode for testing
- Create GitHub issue for bugs

---

**Ready to revolutionize internship management! 🎓✨**
