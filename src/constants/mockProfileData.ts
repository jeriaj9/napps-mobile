export interface SkillItem {
  name: string;
  category?: string;
  rating: number; // 1-5 stars
}

export interface ProfileData {
  initials: string;
  name: string;
  role: string;
  departmentInfo: string;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  stats: {
    vacationDays: number;
    vacationDaysLabel: string;
    lastQuarterScore: number;
    lastQuarterLabel: string;
  };
  workInformation: {
    startDate: string;
    supervisor: string;
    vendor: string;
    branch: string;
    client: string;
    roles: string[];
  };
  interests: string[];
  skills: SkillItem[];
}

let profileDataState: ProfileData = {
  initials: 'SL',
  name: 'SAMUEL LUIS',
  role: 'Engineer II',
  departmentInfo: 'Engineering • Joined October 2020',
  contact: {
    email: 'samuelluis@outlook.com',
    phone: '829-570-4634',
    location: 'Santo Domingo R.D.',
  },
  stats: {
    vacationDays: 12,
    vacationDaysLabel: 'Remaining',
    lastQuarterScore: 0,
    lastQuarterLabel: 'Q1 2026',
  },
  workInformation: {
    startDate: 'October 12, 2020',
    supervisor: 'JUAN PRADO',
    vendor: 'Not provided',
    branch: 'NTG',
    client: 'Verizon',
    roles: ['ADMIN', 'SUPERVISOR'],
  },
  interests: ['Music', 'Gaming', 'Technology'],
  skills: [
    { name: 'TypeScript', category: 'Programming Languages', rating: 5 },
    { name: 'React Native', category: 'Frameworks & Tools', rating: 4 },
    { name: 'XGBoost', category: 'Data & AI', rating: 3 },
    { name: 'Scikit-learn', category: 'Data & AI', rating: 2 },
    { name: 'PyTorch', category: 'Data & AI', rating: 3 },
  ],
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function getProfileData(): ProfileData {
  return profileDataState;
}

export function addSkillToProfile(skill: SkillItem) {
  // Check if skill already exists, if so update rating, else add
  const existingIdx = profileDataState.skills.findIndex(
    (s) => s.name.toLowerCase() === skill.name.toLowerCase()
  );
  if (existingIdx >= 0) {
    profileDataState.skills[existingIdx] = skill;
  } else {
    profileDataState.skills = [...profileDataState.skills, skill];
  }
  notifyListeners();
}

export function updateInterestsInProfile(newInterests: string[]) {
  profileDataState.interests = newInterests;
  notifyListeners();
}

export function addInterestToProfile(interest: string) {
  if (!profileDataState.interests.includes(interest)) {
    profileDataState.interests = [...profileDataState.interests, interest];
    notifyListeners();
  }
}

export function subscribeProfileChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}
