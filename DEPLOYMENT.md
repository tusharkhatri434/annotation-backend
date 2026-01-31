# Backend Deployment Guide

## Deploy to Vercel via GitHub

### Prerequisites
1. MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
2. GitHub account
3. Vercel account (sign up at https://vercel.com)

### Step 1: Set up MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/annotation-app?retryWrites=true&w=majority`)
5. Whitelist all IPs (0.0.0.0/0) for Vercel to connect

### Step 2: Push Code to GitHub
```bash
cd backend
git init
git config user.name "tusharkhatri434"
git config user.email "tusharkhatri8193@gmail.com"
git add .
git commit -m "Backend ready for Vercel deployment"
git branch -M main
git remote add origin git@github.com:tusharkhatri434/annotation-backend.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to https://vercel.com and log in
2. Click "Add New Project"
3. Import your `annotation-backend` repository from GitHub
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

5. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (e.g., `your_super_secret_jwt_key_change_this_in_production_12345`)
   - `NODE_ENV`: `production`

6. Click "Deploy"

### Step 4: Get Your Backend URL
After deployment, you'll get a URL like:
```
https://annotation-backend-xxx.vercel.app
```

### Step 5: Update Frontend Environment Variable
Update your frontend `.env` file:
```
REACT_APP_API_URL=https://annotation-backend-xxx.vercel.app/api
```

Then redeploy your frontend.

### Step 6: Add Collaborator to Repository
1. Go to your GitHub repository settings
2. Navigate to "Manage access"
3. Click "Invite a collaborator"
4. Add: `anees_ahmad@vecros.com`

## Testing the Deployment

Test your backend API:
```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Register a user
curl -X POST https://your-backend-url.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure your MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Verify your connection string includes the correct username, password, and database name
- Check that your database user has read/write permissions

### CORS Issues
The backend is configured to allow all origins. If you need to restrict:
```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

### Environment Variables Not Working
- Double-check spelling in Vercel dashboard
- Redeploy after adding/changing environment variables
- Variables should be added to all environments (Production, Preview, Development)

## Important Notes

- **Cold Starts**: Vercel serverless functions may have cold starts (2-3 second delay on first request after inactivity)
- **MongoDB Atlas Required**: Local MongoDB won't work on Vercel
- **Free Tier Limits**: Vercel free tier has bandwidth and execution time limits
- **Logs**: View logs in Vercel dashboard under "Deployments" > Click deployment > "Logs"

## API Endpoints

Once deployed, your API will be available at:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT token)

### Annotations (All require JWT token)
- `POST /api/annotations` - Create annotation
- `GET /api/annotations` - Get all user annotations
- `GET /api/annotations/:id` - Get specific annotation
- `PUT /api/annotations/:id` - Update annotation
- `DELETE /api/annotations/:id` - Delete annotation

### Health Check
- `GET /api/health` - Check if server is running
