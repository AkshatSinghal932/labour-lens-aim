
import type { Achievement as AchievementType, Report, ReportType } from '@/types';
// Lucide icons are imported dynamically in AchievementCard based on iconName
// import { Award, ShieldCheck, Users, TrendingUp } from 'lucide-react'; 

export const mockAchievements: Array<Omit<AchievementType, 'iconName'> & {icon?: React.ElementType}> = [
  {
    id: '1',
    title: '1000+ Reports Processed',
    description: 'Successfully processed over a thousand reports, aiding in addressing labor issues.',
    iconName: 'TrendingUp', // Storing name instead of component
    imageUrl: 'https://picsum.photos/seed/achievement1/300/200',
    // data-ai-hint="community support"
  },
  {
    id: '2',
    title: 'Safe Workplaces Initiative',
    description: 'Contributed to policy changes leading to safer working environments in 5 regions.',
    iconName: 'ShieldCheck',
    imageUrl: 'https://picsum.photos/seed/achievement2/300/200',
    // data-ai-hint="workplace safety"
  },
  {
    id: '3',
    title: 'Fair Wage Advocacy Success',
    description: 'Helped recover $50,000 in unpaid wages for workers through highlighted reports.',
    iconName: 'Award',
    imageUrl: 'https://picsum.photos/seed/achievement3/300/200',
    // data-ai-hint="financial justice"
  },
  {
    id: '4',
    title: 'Community Awareness Raised',
    description: 'Reached 100,000+ individuals with awareness campaigns on labor rights.',
    iconName: 'Users',
    imageUrl: 'https://picsum.photos/seed/achievement4/300/200',
    // data-ai-hint="public awareness"
  },
];

const reportDescriptions = [
  "Workers at the construction site on Elm Street are not being provided with proper safety harnesses or helmets. Multiple near-miss incidents have occurred in the past month. Management ignores complaints.",
  "Employees at the downtown restaurant 'Quick Bites' are consistently paid less than the minimum wage. Pay slips are often inaccurate, and overtime hours are not compensated correctly.",
  "Textile factory 'WearWell Apparels' has extremely poor ventilation and excessive heat, leading to workers fainting. Emergency exits are also partially blocked with materials.",
  "Delivery drivers for 'Speedy Couriers' are forced to work 12-14 hour shifts without adequate breaks. Their per-delivery pay rate effectively puts them below minimum wage for the hours worked.",
  "Farm workers at 'Green Valley Farms' are exposed to pesticides without protective gear. Several workers have reported skin rashes and respiratory problems.",
  "Call center 'Global Connect' mandates unpaid overtime, threatening termination for those who refuse. The work environment is also highly stressful with constant surveillance.",
  "Allegations of young children being employed at 'Shiny Gems Workshop' under hazardous conditions.",
  "Reports of persistent verbal abuse and intimidation by supervisors at 'Tech Solutions Inc'.",
  "Claims that 'RetailMart' systematically denies promotions to employees based on their ethnic background."
];

const locations = [
  "123 Elm Street",
  "456 Oak Avenue",
  "789 Pine Lane",
  "101 Maple Drive",
  "202 Birch Road",
  "303 Cedar Court",
  "55 Diamond Road",
  "88 Innovation Park",
  "12 Global Plaza"
];

const cities = [
  "Springfield",
  "Metropolis",
  "Gotham City",
  "Star City",
  "Central City",
  "Coast City",
  "Gemstone City",
  "Futureville",
  "Unity Town"
];

const reportTypesArray: ReportType[] = [
    'Wage Theft', 
    'Safety Violation', 
    'Unfair Wages', 
    'Unsafe Working Conditions',
    'Child Labor',
    'Harassment',
    'Discrimination',
    'Other'
];

export const mockReports: Report[] = Array.from({ length: 9 }, (_, i) => { // Increased length to 9 to better cover new types
  const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
  const reportType = reportTypesArray[i % reportTypesArray.length];

  return {
    id: `report-${String(i + 1).padStart(3, '0')}`, // Ensure unique IDs that can be used as Firestore doc IDs
    anonymousUserId: `user-${(i % 3) + 1}`, 
    dateOfIncidence: randomDate.toISOString().split('T')[0],
    location: locations[i % locations.length],
    city: cities[i % cities.length],
    typeOfIncidence: reportType,
    description: reportDescriptions[i % reportDescriptions.length],
    submittedAt: new Date(randomDate.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
    status: (['Pending', 'Reviewed', 'ActionTaken'] as Report['status'][])[i % 3],
    mediaProof: i % 2 === 0 ? { name: 'evidence.jpg', type: 'image/jpeg' } : undefined,
    // mediaProofUrl will be undefined for mock data initially
  };
});
