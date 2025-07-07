import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';

let client;  
let clientPromise;   
   
if (process.env.MONGODB_URI) {
  client = new MongoClient(process.env.MONGODB_URI);  
  clientPromise = client.connect();    
} else { 
  console.warn('No MongoDB URI provided, using demo mode');
}

// ========== General Helpers ==========
export async function getDatabase() {
  if (!clientPromise) {
    throw new Error('Database not configured. Using demo mode.');
  }
  const client = await clientPromise;
  return client.db('internship_tracker');
}

export async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0];
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB URI not configured');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB via Mongoose');
    return mongoose.connections[0];
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

const isDemoMode = () => !process.env.MONGODB_URI || process.env.DEMO_MODE === 'true';
let demoData = {
  users: [],
  colleges: [],
  cohorts: [],
  joinRequests: []
};

// ========== User ==========
export async function createUser(userData) { /* unchanged */ }
export async function getUserByGitLabId(gitlabId) { /* unchanged */ }
export async function updateUser(userId, updateData) { /* unchanged */ }

// ========== College ==========
export async function createCollege(collegeData) { /* unchanged */ }
export async function getAllColleges() { /* unchanged */ }
export async function getCollegeById(collegeId) { /* unchanged */ }
export async function getCollegesByMentor(mentorId) { /* unchanged */ }

// ========== Cohort ==========
export async function createCohort(cohortData) { /* unchanged */ }
export async function getCohortsByCollege(collegeId) { /* unchanged */ }
export async function getCohortById(cohortId) { /* unchanged */ }
export async function updateCohort(cohortId, updateData) { /* unchanged */ }

// ✅ NEW FUNCTION: Get Cohorts by Mentor
export async function getCohortsByMentor(mentorUsername) {
  try {
    if (isDemoMode()) {
      const mentorColleges = demoData.colleges
        .filter(college => college.mentorUsername === mentorUsername && college.isActive)
        .map(college => college._id);

      return demoData.cohorts.filter(cohort =>
        mentorColleges.includes(cohort.collegeId) && cohort.isActive
      );
    }

    const db = await getDatabase();

    const colleges = await db.collection('colleges').find({
      mentorUsername,
      isActive: true
    }).toArray();

    const collegeIds = colleges.map(college => college._id);
    if (collegeIds.length === 0) return [];

    return await db.collection('cohorts').find({
      collegeId: { $in: collegeIds },
      isActive: true
    }).toArray();
  } catch (error) {
    console.error('Error fetching cohorts by mentor:', error);
    throw error;
  }
}

// ========== Join Request ==========
export async function createJoinRequest(requestData) { /* unchanged */ }
export async function getJoinRequestsByMentor(mentorId) { /* unchanged */ }
export async function getJoinRequestsByIntern(internId) { /* unchanged */ }
export async function updateJoinRequest(requestId, updateData) { /* unchanged */ }

// ========== Seed Demo Data ==========
export async function seedDemoData() { /* unchanged */ }

// ========== GitLab Integration ==========
export async function getGitLabUserInfo(accessToken) { /* unchanged */ }
export async function getGitLabUserProjects(accessToken, userId) { /* unchanged */ }
export async function getGitLabUserCommits(accessToken, projectId, since = null) { /* unchanged */ }
