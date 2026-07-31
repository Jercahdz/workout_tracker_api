import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const achievements = [
  { key: "FIRST_REP", name: "First Rep", description: "Complete your first workout session", xpReward: 200 },
  { key: "ON_FIRE", name: "On Fire", description: "Maintain a 7-day streak", xpReward: 200 },
  { key: "CONSISTENCY_KING", name: "Consistency King", description: "Maintain a 14-day streak", xpReward: 200 },
  { key: "UNSTOPPABLE", name: "Unstoppable", description: "Maintain a 30-day streak", xpReward: 200 },
  { key: "IRON_WILL", name: "Iron Will", description: "Complete 50 workout sessions", xpReward: 200 },
  { key: "CENTURY", name: "Century", description: "Complete 100 workout sessions", xpReward: 200 },
  { key: "AI_POWERED", name: "AI Powered", description: "Generate your first AI workout routine", xpReward: 200 },
];

const exercises = [
  { name: "Bench Press", muscleGroup: "CHEST", equipment: "Barbell", description: "Classic compound chest exercise using a flat bench and barbell." },
  { name: "Incline Dumbbell Press", muscleGroup: "CHEST", equipment: "Dumbbells", description: "Upper chest exercise performed on an incline bench." },
  { name: "Cable Fly", muscleGroup: "CHEST", equipment: "Cable Machine", description: "Isolation exercise for the chest using cables." },
  { name: "Push Up", muscleGroup: "CHEST", equipment: "Bodyweight", description: "Bodyweight exercise targeting chest, shoulders and triceps." },
  { name: "Dumbbell Pullover", muscleGroup: "CHEST", equipment: "Dumbbell", description: "Stretching exercise for chest and lats." },
  { name: "Decline Bench Press", muscleGroup: "CHEST", equipment: "Barbell", description: "Compound press targeting the lower chest." },
  { name: "Pec Deck Fly", muscleGroup: "CHEST", equipment: "Machine", description: "Machine isolation exercise for chest definition." },
  { name: "Close Grip Bench Press", muscleGroup: "CHEST", equipment: "Barbell", description: "Narrow grip bench press targeting inner chest and triceps." },
  { name: "Dumbbell Bench Press", muscleGroup: "CHEST", equipment: "Dumbbells", description: "Dumbbell variation of the bench press for greater range of motion." },
  { name: "Incline Cable Fly", muscleGroup: "CHEST", equipment: "Cable Machine", description: "Cable fly performed at an incline angle for upper chest." },
  { name: "Svend Press", muscleGroup: "CHEST", equipment: "Plates", description: "Plate squeeze press for inner chest activation." },
  { name: "Landmine Press", muscleGroup: "CHEST", equipment: "Barbell", description: "Angled press using a landmine attachment for upper chest." },


  { name: "Pull Up", muscleGroup: "BACK", equipment: "Pull-up Bar", description: "Bodyweight compound exercise for back and biceps." },
  { name: "Barbell Row", muscleGroup: "BACK", equipment: "Barbell", description: "Compound rowing movement for overall back thickness." },
  { name: "Lat Pulldown", muscleGroup: "BACK", equipment: "Cable Machine", description: "Cable exercise targeting the latissimus dorsi." },
  { name: "Seated Cable Row", muscleGroup: "BACK", equipment: "Cable Machine", description: "Horizontal pulling movement for mid and lower back." },
  { name: "Deadlift", muscleGroup: "BACK", equipment: "Barbell", description: "Fundamental compound movement for full posterior chain." },
  { name: "Dumbbell Row", muscleGroup: "BACK", equipment: "Dumbbell", description: "Single arm rowing exercise for back width and thickness." },
  { name: "T-Bar Row", muscleGroup: "BACK", equipment: "T-Bar", description: "Compound rowing movement for back thickness." },
  { name: "Face Pull", muscleGroup: "BACK", equipment: "Cable Machine", description: "Cable exercise for rear delts and upper back." },
  { name: "Good Morning", muscleGroup: "BACK", equipment: "Barbell", description: "Hip hinge movement for lower back and hamstrings." },
  { name: "Rack Pull", muscleGroup: "BACK", equipment: "Barbell", description: "Partial deadlift from knee height for upper back strength." },
  { name: "Chest Supported Row", muscleGroup: "BACK", equipment: "Dumbbells", description: "Chest supported dumbbell row eliminating lower back involvement." },
  { name: "Straight Arm Pulldown", muscleGroup: "BACK", equipment: "Cable Machine", description: "Cable exercise isolating the lats with straight arms." },
  { name: "Meadows Row", muscleGroup: "BACK", equipment: "Barbell", description: "Unilateral row for upper back thickness and width." },
  { name: "Inverted Row", muscleGroup: "BACK", equipment: "Barbell", description: "Bodyweight horizontal pull for mid back and biceps." },

  { name: "Overhead Press", muscleGroup: "SHOULDERS", equipment: "Barbell", description: "Compound pressing movement for overall shoulder development." },
  { name: "Dumbbell Shoulder Press", muscleGroup: "SHOULDERS", equipment: "Dumbbells", description: "Seated or standing press for shoulder mass." },
  { name: "Lateral Raise", muscleGroup: "SHOULDERS", equipment: "Dumbbells", description: "Isolation exercise for the lateral deltoid." },
  { name: "Front Raise", muscleGroup: "SHOULDERS", equipment: "Dumbbells", description: "Isolation exercise for the anterior deltoid." },
  { name: "Rear Delt Fly", muscleGroup: "SHOULDERS", equipment: "Dumbbells", description: "Isolation exercise for the posterior deltoid." },
  { name: "Face Pull", muscleGroup: "SHOULDERS", equipment: "Cable Machine", description: "Cable exercise for rear delts and rotator cuff." },
  { name: "Arnold Press", muscleGroup: "SHOULDERS", equipment: "Dumbbells", description: "Rotating dumbbell press for full shoulder development." },
  { name: "Upright Row", muscleGroup: "SHOULDERS", equipment: "Barbell", description: "Vertical pulling movement for traps and lateral deltoids." },
  { name: "Cable Lateral Raise", muscleGroup: "SHOULDERS", equipment: "Cable Machine", description: "Cable variation of lateral raise for constant tension." },
  { name: "Machine Shoulder Press", muscleGroup: "SHOULDERS", equipment: "Machine", description: "Guided press machine for shoulder mass and safety." },
  { name: "Plate Front Raise", muscleGroup: "SHOULDERS", equipment: "Plates", description: "Front raise using a weight plate for anterior deltoid." },
  { name: "Bent Over Lateral Raise", muscleGroup: "SHOULDERS", equipment: "Dumbbells", description: "Rear delt isolation with a bent over torso position." },

  { name: "Barbell Curl", muscleGroup: "ARMS", equipment: "Barbell", description: "Classic bicep curl with a barbell." },
  { name: "Dumbbell Curl", muscleGroup: "ARMS", equipment: "Dumbbells", description: "Alternating or simultaneous dumbbell bicep curl." },
  { name: "Hammer Curl", muscleGroup: "ARMS", equipment: "Dumbbells", description: "Neutral grip curl targeting brachialis and brachioradialis." },
  { name: "Tricep Pushdown", muscleGroup: "ARMS", equipment: "Cable Machine", description: "Cable isolation exercise for the triceps." },
  { name: "Skull Crusher", muscleGroup: "ARMS", equipment: "Barbell", description: "Lying tricep extension for mass and strength." },
  { name: "Dips", muscleGroup: "ARMS", equipment: "Parallel Bars", description: "Bodyweight compound movement for triceps and chest." },
  { name: "Preacher Curl", muscleGroup: "ARMS", equipment: "Barbell", description: "Strict bicep curl on a preacher bench." },
  { name: "Cable Curl", muscleGroup: "ARMS", equipment: "Cable Machine", description: "Bicep curl using cable for constant tension." },
  { name: "Concentration Curl", muscleGroup: "ARMS", equipment: "Dumbbell", description: "Seated isolation curl for peak bicep contraction." },
  { name: "Overhead Tricep Extension", muscleGroup: "ARMS", equipment: "Dumbbell", description: "Overhead extension targeting the long head of the triceps." },
  { name: "Close Grip Push Up", muscleGroup: "ARMS", equipment: "Bodyweight", description: "Narrow push up variation emphasizing the triceps." },
  { name: "Reverse Curl", muscleGroup: "ARMS", equipment: "Barbell", description: "Overhand grip curl for brachialis and forearm development." },
  { name: "EZ Bar Curl", muscleGroup: "ARMS", equipment: "EZ Bar", description: "Bicep curl with an EZ bar reducing wrist strain." },
  { name: "Tricep Kickback", muscleGroup: "ARMS", equipment: "Dumbbell", description: "Isolation exercise for tricep extension behind the body." },
  { name: "Spider Curl", muscleGroup: "ARMS", equipment: "Barbell", description: "Incline bench curl for peak bicep contraction." },

  { name: "Squat", muscleGroup: "LEGS", equipment: "Barbell", description: "King of leg exercises, compound movement for quads, glutes and hamstrings." },
  { name: "Romanian Deadlift", muscleGroup: "LEGS", equipment: "Barbell", description: "Hip hinge movement targeting hamstrings and glutes." },
  { name: "Leg Press", muscleGroup: "LEGS", equipment: "Leg Press Machine", description: "Machine compound exercise for quads and glutes." },
  { name: "Lunges", muscleGroup: "LEGS", equipment: "Dumbbells", description: "Unilateral lower body exercise for balance and strength." },
  { name: "Leg Curl", muscleGroup: "LEGS", equipment: "Machine", description: "Isolation exercise for the hamstrings." },
  { name: "Leg Extension", muscleGroup: "LEGS", equipment: "Machine", description: "Isolation exercise for the quadriceps." },
  { name: "Calf Raise", muscleGroup: "LEGS", equipment: "Machine", description: "Isolation exercise for the gastrocnemius and soleus." },
  { name: "Bulgarian Split Squat", muscleGroup: "LEGS", equipment: "Dumbbells", description: "Unilateral squat variation for quad and glute development." },
  { name: "Hack Squat", muscleGroup: "LEGS", equipment: "Machine", description: "Machine squat variation for quad development." },
  { name: "Sumo Deadlift", muscleGroup: "LEGS", equipment: "Barbell", description: "Wide stance deadlift targeting inner thighs and glutes." },
  { name: "Step Up", muscleGroup: "LEGS", equipment: "Dumbbells", description: "Unilateral exercise stepping onto a elevated platform." },
  { name: "Glute Bridge", muscleGroup: "LEGS", equipment: "Bodyweight", description: "Hip extension exercise targeting glutes and hamstrings." },
  { name: "Hip Thrust", muscleGroup: "LEGS", equipment: "Barbell", description: "Weighted hip extension for maximum glute activation." },
  { name: "Goblet Squat", muscleGroup: "LEGS", equipment: "Kettlebell", description: "Front loaded squat variation for quad and core development." },
  { name: "Seated Calf Raise", muscleGroup: "LEGS", equipment: "Machine", description: "Isolation exercise targeting the soleus muscle." },
  { name: "Nordic Hamstring Curl", muscleGroup: "LEGS", equipment: "Bodyweight", description: "Advanced bodyweight exercise for hamstring strength." },
  { name: "Leg Press Calf Raise", muscleGroup: "LEGS", equipment: "Leg Press Machine", description: "Calf raise variation using the leg press machine." },

  { name: "Plank", muscleGroup: "CORE", equipment: "Bodyweight", description: "Isometric core stability exercise." },
  { name: "Crunch", muscleGroup: "CORE", equipment: "Bodyweight", description: "Basic abdominal exercise targeting the rectus abdominis." },
  { name: "Hanging Leg Raise", muscleGroup: "CORE", equipment: "Pull-up Bar", description: "Advanced core exercise for lower abs." },
  { name: "Russian Twist", muscleGroup: "CORE", equipment: "Bodyweight", description: "Rotational core exercise for obliques." },
  { name: "Ab Wheel Rollout", muscleGroup: "CORE", equipment: "Ab Wheel", description: "Advanced core exercise for full abdominal wall." },
  { name: "Cable Crunch", muscleGroup: "CORE", equipment: "Cable Machine", description: "Weighted crunch using a cable machine." },
  { name: "Bicycle Crunch", muscleGroup: "CORE", equipment: "Bodyweight", description: "Dynamic crunch with rotation targeting obliques and rectus abdominis." },
  { name: "Mountain Climber", muscleGroup: "CORE", equipment: "Bodyweight", description: "Dynamic plank variation for core stability and conditioning." },
  { name: "Pallof Press", muscleGroup: "CORE", equipment: "Cable Machine", description: "Anti-rotation core stability exercise." },
  { name: "Dead Bug", muscleGroup: "CORE", equipment: "Bodyweight", description: "Core stability exercise focusing on anti-extension." },
  { name: "Side Plank", muscleGroup: "CORE", equipment: "Bodyweight", description: "Lateral isometric exercise targeting the obliques." },
  { name: "Hollow Body Hold", muscleGroup: "CORE", equipment: "Bodyweight", description: "Gymnastic core exercise for total abdominal tension." },
  { name: "Landmine Rotation", muscleGroup: "CORE", equipment: "Barbell", description: "Rotational core exercise using a landmine attachment." },
  { name: "Toes To Bar", muscleGroup: "CORE", equipment: "Pull-up Bar", description: "Hanging core exercise bringing toes to the bar." },

  { name: "Burpee", muscleGroup: "FULL_BODY", equipment: "Bodyweight", description: "High intensity full body conditioning exercise." },
  { name: "Kettlebell Swing", muscleGroup: "FULL_BODY", equipment: "Kettlebell", description: "Hip hinge power exercise for posterior chain and conditioning." },
  { name: "Clean and Press", muscleGroup: "FULL_BODY", equipment: "Barbell", description: "Olympic lifting movement combining a power clean and overhead press." },
  { name: "Thruster", muscleGroup: "FULL_BODY", equipment: "Barbell", description: "Front squat to overhead press combination movement." },
  { name: "Box Jump", muscleGroup: "FULL_BODY", equipment: "Box", description: "Plyometric jumping exercise for power and explosiveness." },
  { name: "Battle Ropes", muscleGroup: "FULL_BODY", equipment: "Battle Ropes", description: "High intensity conditioning exercise for upper body and core." },
  { name: "Medicine Ball Slam", muscleGroup: "FULL_BODY", equipment: "Medicine Ball", description: "Explosive power exercise for full body conditioning." },
  { name: "Turkish Get Up", muscleGroup: "FULL_BODY", equipment: "Kettlebell", description: "Complex movement for full body stability and strength." },
  { name: "Farmer Walk", muscleGroup: "FULL_BODY", equipment: "Dumbbells", description: "Loaded carry exercise for grip, traps and total body conditioning." },
  { name: "Sled Push", muscleGroup: "FULL_BODY", equipment: "Sled", description: "Pushing a weighted sled for lower body power and conditioning." },
  { name: "Jump Squat", muscleGroup: "FULL_BODY", equipment: "Bodyweight", description: "Plyometric squat for explosive leg power." },
  { name: "Bear Crawl", muscleGroup: "FULL_BODY", equipment: "Bodyweight", description: "Quadrupedal movement for full body coordination and strength." },
  { name: "Sandbag Clean", muscleGroup: "FULL_BODY", equipment: "Sandbag", description: "Power clean variation using a sandbag for functional strength." },
  { name: "Wall Ball", muscleGroup: "FULL_BODY", equipment: "Medicine Ball", description: "Squat to overhead throw for full body conditioning." },
  { name: "Rope Climb", muscleGroup: "FULL_BODY", equipment: "Rope", description: "Vertical pulling movement for upper body and grip strength." },
  { name: "Prowler Push", muscleGroup: "FULL_BODY", equipment: "Prowler", description: "Pushing a prowler sled for conditioning and lower body power." },
];

const main = async () => {
  console.log("Seeding achievements...");
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {},
      create: achievement,
    });
  }

  console.log("Seeding exercises...");
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise as any,
    });
  }

  console.log("Seeding completed.");
};

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());